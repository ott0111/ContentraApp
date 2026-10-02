import { db } from "@/lib/db";

export async function enqueueJob(input: {
  workspaceId?: string;
  kind: string;
  payload: Record<string, unknown>;
  runAt?: Date;
}) {
  return db.backgroundJob.create({
    data: {
      workspaceId: input.workspaceId,
      kind: input.kind,
      payload: input.payload,
      runAt: input.runAt ?? new Date()
    }
  });
}

export async function processJobs(limit = 10) {
  const jobs = await db.$transaction(async (tx) => {
    const candidates = await tx.backgroundJob.findMany({
      where: { status: "QUEUED", runAt: { lte: new Date() } },
      orderBy: { runAt: "asc" },
      take: limit,
      select: { id: true }
    });
    const claimed: typeof candidates = [];
    for (const candidate of candidates) {
      const updated = await tx.backgroundJob.updateMany({
        where: { id: candidate.id, status: "QUEUED" },
        data: { status: "PROCESSING", lockedAt: new Date(), attempts: { increment: 1 } }
      });
      if (updated.count) claimed.push(candidate);
    }
    return claimed;
  });

  const results = [];
  for (const job of jobs) {
    try {
      const row = await db.backgroundJob.findUnique({ where: { id: job.id } });
      if (!row) continue;

      if (row.kind === "POLL_UGC_GENERATION") {
        const { generationId } = row.payload as { generationId: string };
        const generation = await db.generationJob.findUnique({ where: { id: generationId } });
        if (generation?.operationName && generation.status === "PROCESSING") {
          const { pollVeoOperation } = await import("@/lib/ugc");
          const result = await pollVeoOperation(generation.operationName);
          if (result.status === "COMPLETED") {
            await db.generationJob.update({
              where: { id: generation.id },
              data: { status: "COMPLETED", outputUrl: result.outputUrl, outputMimeType: result.outputMimeType }
            });
          } else if (result.status === "FAILED") {
            await db.generationJob.update({
              where: { id: generation.id },
              data: { status: "FAILED", error: result.error }
            });
          } else {
            await db.backgroundJob.update({
              where: { id: row.id },
              data: { status: "QUEUED", lockedAt: null, runAt: new Date(Date.now() + 15000) }
            });
            continue;
          }
        }
      }

      await db.backgroundJob.update({ where: { id: row.id }, data: { status: "COMPLETED", lockedAt: null } });
      results.push(row.id);
    } catch (error) {
      await db.backgroundJob.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          lockedAt: null,
          lastError: error instanceof Error ? error.message : "Job failed"
        }
      });
    }
  }

  return { claimed: jobs.length, completed: results.length };
}
