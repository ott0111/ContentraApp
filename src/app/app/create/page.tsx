"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppPage } from "@/components/app/app-page";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";

type Workspace = { id: string; name: string; plan: string };
type Result = { title: string; hook: string; script: string; caption: string; cta: string; visualDirection: string };

const formats = [
  { id: "VIDEO", label: "Short-form video", detail: "Hook + script + shot plan" },
  { id: "POST", label: "Social post", detail: "Text-first post with a strong hook" },
  { id: "UGC", label: "AI UGC", detail: "Character-led vertical video" },
  { id: "SCRIPT", label: "Remix", detail: "Turn a winning idea into yours" },
] as const;
const platforms = [
  ["TIKTOK", "TikTok"], ["INSTAGRAM", "Instagram"], ["YOUTUBE", "YouTube"], ["X", "X"]
] as const;

export default function CreatePage() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [format, setFormat] = useState<(typeof formats)[number]["id"]>("VIDEO");
  const [platform, setPlatform] = useState("TIKTOK");
  const [prompt, setPrompt] = useState("Give me a practical creator-growth idea that feels like advice from someone actually building.");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then(async r => {
      const json = await r.json();
      setWorkspace(json.data?.workspaces?.[0] ?? null);
      setLoading(false);
    }).catch(() => { setError("Couldn't load your workspace."); setLoading(false); });
  }, []);

  async function generate() {
    if (!workspace || !prompt.trim()) return;
    setGenerating(true); setError("");
    try {
      const response = await fetch(`/api/workspaces/${workspace.id}/ai/generate-content`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify({ prompt, platform, save: true })
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json.details?.code === "PLAN_REQUIRED" ? "AI creation is available on Pro and above." : (json.error || "Generation failed."));
        return;
      }
      setResult(json.data.content);
    } catch { setError("Something went wrong. Try again."); }
    finally { setGenerating(false); }
  }

  if (loading) return <AppPage><div className="h-96 animate-pulse rounded-3xl bg-zinc-100" /></AppPage>;

  return <AppPage>
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div><span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-orange-700">Content engine</span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">What are we making?</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">Start with a thought, goal, or winning idea. Contentra turns it into publish-ready content using your Brand Brain and Content DNA.</p>
      </div>
      <div className="flex gap-2"><Button href="/app/creatos" variant="secondary">Find ideas</Button><Button onClick={generate} className="min-w-28">{generating ? "Creating..." : "Generate"}</Button></div>
    </div>

    {error && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-5">
        <Card><CardHeader eyebrow="Step 1" title="Choose a format" description="Contentra adapts the output to the job." />
          <div className="grid gap-2 px-5 pb-5 sm:grid-cols-2 sm:px-6 sm:pb-6">{formats.map(item =>
            <button key={item.id} onClick={() => setFormat(item.id)} className={`rounded-2xl border p-4 text-left transition ${format===item.id ? "border-orange-300 bg-orange-50 ring-1 ring-orange-200" : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"}`}>
              <div className="flex items-center justify-between"><span className="text-sm font-semibold">{item.label}</span><span className={`grid size-5 place-items-center rounded-full border text-[10px] ${format===item.id ? "border-orange-500 bg-orange-500 text-white" : "border-zinc-300 text-transparent"}`}>✓</span></div>
              <p className="mt-1 text-xs leading-5 text-zinc-500">{item.detail}</p>
            </button>)}</div>
        </Card>

        <Card><CardHeader eyebrow="Step 2" title="Tell Contentra what you want" description="You don't need a perfect prompt." />
          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} className="min-h-40 w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
            <div className="mt-3 flex flex-wrap gap-2">{["Make it more direct","Give me 3 hooks","Make it educational","Make it controversial"].map(x =>
              <button key={x} onClick={()=>setPrompt(v=>v+` ${x}.`)} className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-500 hover:border-orange-200 hover:text-orange-700">{x}</button>)}</div>
          </div>
        </Card>

        <Card><CardHeader eyebrow="Step 3" title="Where is it going?" description="Choose the platform so the output feels native." />
          <div className="flex flex-wrap gap-2 px-5 pb-5 sm:px-6 sm:pb-6">{platforms.map(([id,label]) =>
            <button key={id} onClick={()=>setPlatform(id)} className={`rounded-full px-4 py-2 text-xs font-semibold transition ${platform===id ? "bg-zinc-950 text-white" : "border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-950"}`}>{label}</button>)}</div>
        </Card>
      </div>

      <aside className="xl:sticky xl:top-24 xl:self-start">
        <Card className="overflow-hidden">
          <CardHeader eyebrow="Output" title={result?.title || "Your content will appear here"} description={result ? "Saved to your Library automatically." : "Generate a real content package from your workspace signals."} />
          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            {result ? <div className="space-y-4">
              <Block label="Hook" text={result.hook} />
              <Block label="Script" text={result.script} />
              <Block label="Caption" text={result.caption} />
              <Block label="CTA" text={result.cta} />
              <Block label="Visual direction" text={result.visualDirection} />
              <Button href="/app/library" variant="secondary" className="w-full">Open in Library</Button>
            </div> :
            <div className="rounded-2xl bg-zinc-950 p-5 text-white"><p className="text-xs font-semibold uppercase tracking-wide text-orange-300">{platforms.find(x=>x[0]===platform)?.[1]} · {format}</p><p className="mt-3 text-xl font-semibold leading-tight">Turn the idea into something you can actually post.</p><p className="mt-2 text-sm leading-6 text-zinc-400">Contentra uses your Brand Brain + Content DNA instead of giving you a blank AI chat box.</p><button onClick={generate} disabled={generating} className="mt-5 w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold hover:bg-orange-600 disabled:opacity-60">{generating ? "Generating..." : "Generate content"}</button></div>}
          </div>
        </Card>
      </aside>
    </div>
  </AppPage>;
}

function Block({label,text}:{label:string;text:string}) {
  return <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-orange-600">{label}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700">{text}</p></div>;
}
