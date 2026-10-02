"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const tabs = ["For You", "Trending", "Saved"];

const opportunities = [
  {
    id: 1,
    creator: "Alex Hormozi",
    handle: "@alexhormozi",
    type: "Talking head",
    score: 96,
    title: "The mistake creators make when trying to grow",
    caption: "A direct hook with a fast payoff. This format matches your strongest educational content.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
    views: "2.4M",
    age: "2d ago",
  },
  {
    id: 2,
    creator: "Ali Abdaal",
    handle: "@aliabdaal",
    type: "B-roll + voiceover",
    score: 91,
    title: "How I would start from zero in 2026",
    caption: "A strong framework you can remix around your own niche and experience.",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=85",
    views: "840K",
    age: "4d ago",
  },
  {
    id: 3,
    creator: "Creator Strategy",
    handle: "@creatorstrategy",
    type: "UGC",
    score: 88,
    title: "I stopped making content like this",
    caption: "A relatable before/after structure with a clear curiosity gap.",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=900&q=85",
    views: "612K",
    age: "1d ago",
  },
];

export default function CreatosPage() {
  const [tab, setTab] = useState("For You");
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState<number[]>([]);
  const current = opportunities[index % opportunities.length];

  const next = (save = false) => {
    if (save && !saved.includes(current.id)) setSaved((items) => [...items, current.id]);
    setIndex((value) => value + 1);
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-zinc-950">
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white p-4 lg:flex lg:flex-col">
          <Link href="/" className="flex items-center gap-2 px-2 py-3 font-semibold tracking-tight">
            <span className="grid size-8 place-items-center rounded-xl bg-orange-500 text-sm font-black text-white">C</span>
            Contentra
          </Link>
          <nav className="mt-8 space-y-1">
            {[
              ["Overview", "/app", "⌂"],
              ["Create", "/app/create", "＋"],
              ["Creatos", "/app/creatos", "◈"],
              ["Library", "/app/library", "▣"],
              ["Analytics", "/app/analytics", "↗"],
            ].map(([label, href, icon]) => (
              <Link key={label} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${label === "Creatos" ? "bg-orange-50 text-orange-700" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950"}`}>
                <span className="grid size-7 place-items-center rounded-lg bg-zinc-100 text-xs">{icon}</span>{label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t border-zinc-100 pt-4">
            <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-3">
              <div className="grid size-9 place-items-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700">Y</div>
              <div><p className="text-sm font-medium">Your workspace</p><p className="text-xs text-zinc-500">Free plan</p></div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-[#f7f7f5]/90 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Creatos</p>
                <p className="hidden text-xs text-zinc-500 sm:block">Find what is working. Make it yours.</p>
              </div>
              <Link href="/app/create" className="rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600">Create content</Link>
            </div>
          </header>

          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">CONTENT OPPORTUNITIES</span>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Your next idea is already working.</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">Contentra surfaces real formats and topics that match your Content DNA. Save the ones worth turning into your own.</p>
              </div>
              <div className="flex rounded-full border border-zinc-200 bg-white p-1 shadow-sm">
                {tabs.map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-full px-4 py-2 text-xs font-medium transition ${tab === item ? "bg-zinc-950 text-white" : "text-zinc-500 hover:text-zinc-950"}`}>{item}</button>)}
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <section className="rounded-[28px] border border-zinc-200 bg-white p-3 shadow-sm sm:p-4">
                <div className="relative overflow-hidden rounded-[22px] bg-zinc-950">
                  <img src={current.image} alt="" className="aspect-[4/3] w-full object-cover sm:aspect-[16/9]" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent p-5 pt-24 text-white sm:p-7 sm:pt-32">
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">{current.type}</span>
                      <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">{current.views} views</span>
                      <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">{current.age}</span>
                    </div>
                    <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">{current.title}</h2>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 px-2 pb-1 pt-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-zinc-950 text-xs font-semibold text-white">A</div>
                    <div className="min-w-0"><p className="truncate text-sm font-semibold">{current.creator}</p><p className="truncate text-xs text-zinc-500">{current.handle}</p></div>
                  </div>
                  <div className="hidden rounded-2xl bg-orange-50 px-4 py-2 text-right sm:block"><p className="text-[10px] font-semibold uppercase tracking-wide text-orange-600">Contentra fit</p><p className="text-lg font-semibold text-orange-700">{current.score}%</p></div>
                </div>

                <p className="px-2 pt-4 text-sm leading-6 text-zinc-500">{current.caption}</p>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <button onClick={() => next(true)} className="rounded-2xl border border-zinc-200 bg-white py-3 text-sm font-semibold transition hover:border-orange-300 hover:bg-orange-50">Save</button>
                  <button onClick={() => next(false)} className="rounded-2xl bg-zinc-950 py-3 text-sm font-semibold text-white transition hover:bg-orange-500">Remix</button>
                  <button onClick={() => next(false)} className="rounded-2xl border border-zinc-200 bg-white py-3 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50">Skip</button>
                </div>
              </section>

              <aside className="space-y-4">
                <div className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Why this is here</p>
                  <h3 className="mt-2 text-lg font-semibold">Matches your Content DNA</h3>
                  <div className="mt-5 space-y-4">
                    <Match label="Hook style" value="Direct" score="94%" />
                    <Match label="Format" value="Talking head" score="89%" />
                    <Match label="Topic fit" value="Growth" score="92%" />
                  </div>
                </div>
                <div className="rounded-[24px] bg-zinc-950 p-5 text-white shadow-lg">
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-300">Saved</p>
                  <p className="mt-2 text-3xl font-semibold">{saved.length}</p>
                  <p className="mt-1 text-sm text-zinc-400">opportunities ready to remix</p>
                  <Link href="/app/library" className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-zinc-950">Open library</Link>
                </div>
                <div className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Trend radar</p>
                  <div className="mt-4 flex flex-wrap gap-2">{["Creator growth","AI workflows","Behind the scenes","Personal systems"].map((x) => <span key={x} className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs text-zinc-600">{x}</span>)}</div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Match({label,value,score}:{label:string;value:string;score:string}) {
  return <div><div className="flex justify-between text-xs"><span className="text-zinc-500">{label}</span><span className="font-medium">{value} · {score}</span></div><div className="mt-2 h-1.5 rounded-full bg-zinc-100"><div className="h-1.5 rounded-full bg-orange-500" style={{width:score}} /></div></div>;
}
