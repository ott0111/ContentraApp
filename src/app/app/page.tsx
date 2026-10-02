"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Dashboard = {
  workspace: { id: string; name: string; plan: string; brandBrain?: { businessName: string | null; niche: string | null; audience: string | null; positioning: string | null; voice: string | null } | null; contentDNA?: { confidence: number | null } | null };
  metrics: { views: number; likes: number; comments: number; shares: number; saves: number; reach: number; contentCount: number };
  recentContent: Array<{ id: string; title: string; hook: string | null; status: string; type: string }>;
  opportunities: Array<{ id: string; title: string; description: string | null; score: number; platform: string }>;
  recommendations: Array<{ id: string; title: string; description: string | null; priority: string }>;
};

export default function AppDashboard() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const me = await fetch("/api/auth/me", { credentials: "include" }).then((r) => r.json());
        const workspace = me?.data?.workspaces?.[0];
        if (!workspace) return;
        const result = await fetch(`/api/workspaces/${workspace.id}/dashboard`, { credentials: "include" }).then((r) => r.json());
        if (!cancelled) setData(result?.data ?? null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const engagement = useMemo(() => {
    if (!data?.metrics.views) return "0%";
    const interactions = data.metrics.likes + data.metrics.comments + data.metrics.shares + data.metrics.saves;
    return `${((interactions / data.metrics.views) * 100).toFixed(1)}%`;
  }, [data]);

  if (loading) return <DashboardSkeleton />;
  if (!data) return <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6"><div className="rounded-3xl border border-zinc-200 bg-white p-8"><h1 className="text-xl font-semibold">Your workspace is loading</h1><p className="mt-2 text-sm text-zinc-500">Sign in and refresh if this continues.</p></div></div>;

  const brand = data.workspace.brandBrain;
  const dna = data.workspace.contentDNA;
  const topOpportunity = data.opportunities[0];
  const action = data.recommendations[0];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 pb-24 sm:px-6 sm:py-8 lg:px-8 lg:pb-10">
      <section className="rounded-[30px] bg-zinc-950 p-6 text-white shadow-xl shadow-zinc-900/10 sm:p-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-[.14em] text-orange-200">NEXT BEST ACTION</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{action?.title ?? "Connect your brand and let Contentra find the next move."}</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">{action?.description ?? "Complete your Brand Brain and start building Content DNA so your workspace can turn signals into actions."}</p>
            <Link href={brand?.businessName ? "/app/create" : "/app/brand-brain"} className="mt-6 inline-flex rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-400">{brand?.businessName ? "Create from signal" : "Set up Brand Brain"}</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:w-80"><Metric label="Content DNA" value={dna?.confidence ? `${Math.round(dna.confidence * 100)}%` : "—"} detail="confidence" /><Metric label="Audience reach" value={formatNumber(data.metrics.reach)} detail="last 30 days" /></div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Views" value={formatNumber(data.metrics.views)} detail="last 30 days" />
        <Stat label="Engagement" value={engagement} detail="views → interactions" />
        <Stat label="Published" value={String(data.metrics.contentCount)} detail="recent content" />
        <Stat label="Saves" value={formatNumber(data.metrics.saves)} detail="last 30 days" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_.75fr]">
        <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.12em] text-zinc-400">Creatos</p><h2 className="mt-1 text-xl font-semibold">Your next opportunities</h2></div><Link href="/app/creatos" className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50">View all</Link></div>
          <div className="mt-5 space-y-3">
            {data.opportunities.length ? data.opportunities.map((idea) => <div key={idea.id} className="group flex flex-col gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 transition hover:border-orange-200 hover:bg-orange-50/40 sm:flex-row sm:items-center"><div className="grid size-12 shrink-0 place-items-center rounded-xl bg-white text-sm font-semibold shadow-sm">{idea.score}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2 text-[11px]"><span className="rounded-full bg-orange-100 px-2 py-1 text-orange-700">{idea.platform}</span><span className="rounded-full bg-white px-2 py-1 text-zinc-500">Opportunity</span></div><h3 className="mt-2 font-medium">{idea.title}</h3>{idea.description && <p className="mt-1 text-xs text-zinc-500">{idea.description}</p>}</div><Link href="/app/create" className="rounded-full bg-zinc-950 px-4 py-2 text-center text-xs font-semibold text-white transition group-hover:bg-orange-500">Remix</Link></div>) : <Empty title="No opportunities yet" body="Analyze your Content DNA after adding some content and performance data." href="/app/content-dna" label="Open Content DNA" />}
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[.12em] text-zinc-400">Content Brain</p>
          <h2 className="mt-1 text-xl font-semibold">{brand?.businessName ?? "Set your brand signal"}</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-500">{brand?.positioning ?? "Brand Brain gives Contentra the context it needs to make recommendations that actually fit your business."}</p>
          <div className="mt-6 space-y-3"><Info label="Niche" value={brand?.niche ?? "Not set"} /><Info label="Audience" value={brand?.audience ?? "Not set"} /><Info label="Voice" value={brand?.voice ?? "Not set"} /></div>
          <Link href="/app/brand-brain" className="mt-6 block w-full rounded-full border border-zinc-200 py-2.5 text-center text-sm font-medium hover:bg-zinc-50">Open Brand Brain</Link>
        </section>
      </div>

      <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-xs font-semibold uppercase tracking-[.12em] text-zinc-400">Library</p><h2 className="mt-1 text-xl font-semibold">Recent content</h2></div><Link href="/app/library" className="text-sm font-semibold text-orange-600 hover:text-orange-700">Open library →</Link></div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{data.recentContent.length ? data.recentContent.slice(0,4).map((item) => <Link key={item.id} href="/app/library" className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 hover:border-orange-200 hover:bg-orange-50/40"><div className="flex items-center justify-between gap-2"><span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">{item.type}</span><span className="rounded-full bg-white px-2 py-1 text-[10px] text-zinc-500">{item.status}</span></div><h3 className="mt-4 line-clamp-2 text-sm font-semibold">{item.title}</h3><p className="mt-2 line-clamp-2 text-xs text-zinc-500">{item.hook ?? "No hook added yet."}</p></Link>) : <Empty title="Your library is empty" body="Create your first piece and it will appear here." href="/app/create" label="Create content" />}</div>
      </section>
    </div>
  );
}

function formatNumber(value:number){return new Intl.NumberFormat("en-US",{notation:"compact",maximumFractionDigits:1}).format(value);}
function Stat({label,value,detail}:{label:string;value:string;detail:string}){return <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"><p className="text-xs text-zinc-400">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p><p className="mt-1 text-xs text-zinc-500">{detail}</p></div>}
function Metric({label,value,detail}:{label:string;value:string;detail:string}){return <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-zinc-400">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p><p className="text-xs text-zinc-500">{detail}</p></div>}
function Info({label,value}:{label:string;value:string}){return <div className="rounded-2xl bg-zinc-50 p-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">{label}</p><p className="mt-1 truncate text-sm font-medium">{value}</p></div>}
function Empty({title,body,href,label}:{title:string;body:string;href:string;label:string}){return <div className="rounded-2xl border border-dashed border-zinc-200 p-6"><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-zinc-500">{body}</p><Link href={href} className="mt-4 inline-flex rounded-full bg-zinc-950 px-4 py-2 text-xs font-semibold text-white">{label}</Link></div>}
function DashboardSkeleton(){return <div className="mx-auto max-w-[1440px] animate-pulse px-4 py-6 sm:px-6 lg:px-8"><div className="h-72 rounded-[30px] bg-zinc-200"/><div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map(i=><div key={i} className="h-28 rounded-2xl bg-zinc-200" />)}</div><div className="mt-8 grid gap-6 xl:grid-cols-2"><div className="h-80 rounded-3xl bg-zinc-200"/><div className="h-80 rounded-3xl bg-zinc-200"/></div></div>}
