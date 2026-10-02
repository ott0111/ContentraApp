import { processJobs } from "@/server/jobs/service";

export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  if (!expected || authorization !== `Bearer ${expected}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return Response.json(await processJobs(10));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Job processing failed" }, { status: 500 });
  }
}
