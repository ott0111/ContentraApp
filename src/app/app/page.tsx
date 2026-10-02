"use client";

import Link from "next/link";
import { useState } from "react";

const nav = [
  ["Overview", "/app", "⌂"],
  ["Create", "/app/create", "＋"],
  ["Creatos", "/app/creatos", "◈"],
  ["Library", "/app/library", "▣"],
  ["Analytics", "/app/analytics", "↗"],
  ["Campaigns", "/app/campaigns", "◇"],
];

const ideas = [
  { title: "Why most creators are posting too much", type: "Hook + Demo", score: "94", tag: "High signal" },
  { title: "The 3-part system behind consistent growth", type: "Talking Head", score: "89", tag: "Trending" },
  { title: "I stopped guessing what to post", type: "UGC", score: "86", tag: "New" },
];

export default function AppDashboard() {
  const [active, setActive] = useState("Overview");

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-zinc-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white p-4 lg:flex lg:flex-col">
          <Link href="/" className="flex items-center gap-2 px-2 py-3 font-semibold tracking-tight">
            <span className="grid size-8 place-items-center rounded-xl bg-orange-500 text-sm font-black text-white">C</span>
            Contentra
          </Link>

          <div className="mt-8 space-y-1">
            {nav.map(([label, href, icon]) => (
              <Link
                href={href}
                key={label}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active === label ? "bg-zinc-100 text-zinc-950" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"}`}
              >
                <span className="grid size-7 place-items-center rounded-lg bg-zinc-100 text-xs">{icon}</span>
                {label}
              </button>
            ))}
          </div>

          <div className="mt-auto space-y-1 border-t border-zinc-100 pt-4">
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-500 hover:bg-zinc-50">⚙ <span>Settings</span></button>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-500 hover:bg-zinc-50">? <span>Help</span></button>
            <div className="mt-3 flex items-center gap-3 rounded-xl bg-zinc-50 p-3">
              <div className="grid size-9 place-items-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700">Y</div>
              <div className="min-w-0"><p className="truncate text-sm font-medium">Your workspace</p><p className="text-xs text-zinc-500">Free plan</p></div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-[#f7f7f5]/90 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/" className="grid size-9 place-items-center rounded-xl bg-orange-500 font-black text-white lg:hidden">C</Link>
                <div><p className="text-sm font-semibold">{active}</p><p className="hidden text-xs text-zinc-500 sm:block">Your growth system, in one place.</p></div>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600">Free</button>
                <button className="grid size-9 place-items-center rounded-full bg-zinc-950 text-sm font-semibold text-white">Y</button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
            <div className="rounded-3xl bg-zinc-950 p-6 text-white shadow-xl shadow-zinc-900/10 sm:p-8">
              <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-orange-200">NEXT BEST ACTION</div>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Turn your strongest topic into a short-form series.</h1>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">Contentra found a repeatable signal in your content. Build on it instead of starting from zero.</p>
                  <button className="mt-6 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-400">Create from signal</button>
                </div>
                <div className="grid grid-cols-2 gap-3 lg:w-80">
                  <Metric label="Content DNA" value="82%" detail="confidence" />
                  <Metric label="Audience" value="+38%" detail="opportunity" />
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Stat label="Content ready" value="24" detail="ideas + drafts" />
              <Stat label="Saved concepts" value="12" detail="this month" />
              <Stat label="Published" value="18" detail="last 30 days" />
              <Stat label="Avg. engagement" value="6.8%" detail="+1.4% vs prior" />
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_.75fr]">
              <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Creatos</p><h2 className="mt-1 text-xl font-semibold">Your next opportunities</h2></div>
                  <button className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium">View all</button>
                </div>
                <div className="mt-5 space-y-3">
                  {ideas.map((idea) => (
                    <div key={idea.title} className="group flex flex-col gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 transition hover:border-orange-200 hover:bg-orange-50/40 sm:flex-row sm:items-center">
                      <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-white text-sm font-semibold shadow-sm">{idea.score}</div>
                      <div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2 text-[11px]"><span className="rounded-full bg-orange-100 px-2 py-1 text-orange-700">{idea.tag}</span><span className="rounded-full bg-white px-2 py-1 text-zinc-500">{idea.type}</span></div><h3 className="mt-2 font-medium">{idea.title}</h3></div>
                      <button className="rounded-full bg-zinc-950 px-4 py-2 text-xs font-semibold text-white transition group-hover:bg-orange-500">Remix</button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Content Brain</p>
                <h2 className="mt-1 text-xl font-semibold">Your brand signal</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-500">Contentra is learning what makes your audience stop, watch, and engage.</p>
                <div className="mt-6 space-y-4">
                  <Signal label="Direct hooks" value="High" width="86%" />
                  <Signal label="Educational" value="Strong" width="74%" />
                  <Signal label="Storytelling" value="Growing" width="58%" />
                </div>
                <button className="mt-6 w-full rounded-full border border-zinc-200 py-2.5 text-sm font-medium hover:bg-zinc-50">Open Content DNA</button>
              </section>
            </div>

            <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div><p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Create</p><h2 className="mt-1 text-xl font-semibold">What are you making?</h2></div>
                <button className="rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">Open creator</button>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["AI UGC", "Hook + Demo", "Trend Remix"].map((item, i) => <button key={item} className="rounded-2xl border border-zinc-200 p-4 text-left hover:border-orange-300 hover:bg-orange-50/40"><span className="text-xs text-zinc-400">0{i + 1}</span><p className="mt-5 font-medium">{item}</p><p className="mt-1 text-xs text-zinc-500">Generate from your brand context</p></button>)}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({label,value,detail}:{label:string;value:string;detail:string}) {
  return <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"><p className="text-xs text-zinc-400">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p><p className="mt-1 text-xs text-zinc-500">{detail}</p></div>;
}
function Metric({label,value,detail}:{label:string;value:string;detail:string}) {
  return <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-zinc-400">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p><p className="text-xs text-zinc-500">{detail}</p></div>;
}
function Signal({label,value,width}:{label:string;value:string;width:string}) {
  return <div><div className="flex justify-between text-xs"><span className="text-zinc-600">{label}</span><span className="font-medium">{value}</span></div><div className="mt-2 h-2 rounded-full bg-zinc-100"><div className="h-2 rounded-full bg-orange-500" style={{width}} /></div></div>;
}
