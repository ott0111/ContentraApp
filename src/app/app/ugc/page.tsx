"use client";

import Link from "next/link";
import { useState } from "react";

const characters = [
  { name: "Creator #014", style: "Casual creator · direct", status: "Ready" },
  { name: "Founder #008", style: "Founder story · confident", status: "Ready" },
  { name: "Reviewer #021", style: "Product review · energetic", status: "Draft" }
];

export default function UGCPage() {
  const [character, setCharacter] = useState("Creator #014");
  const [generated, setGenerated] = useState(false);
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-zinc-950">
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        <Sidebar active="AI UGC" />
        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-[#f7f7f5]/90 px-4 py-3 backdrop-blur-xl sm:px-6"><div className="mx-auto flex max-w-6xl items-center justify-between"><div><p className="text-sm font-semibold">AI UGC Studio</p><p className="text-xs text-zinc-500">Brief → script → scenes → generation.</p></div><Link href="/app/create" className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold">Back to Create</Link></div></header>
          <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
            <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
              <section className="space-y-5">
                <div className="rounded-[28px] border border-zinc-200 bg-zinc-950 p-6 text-white sm:p-8"><span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-300">GENERATIVE VIDEO</span><h1 className="mt-4 text-3xl font-semibold tracking-tight">Make UGC without starting from zero.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">Contentra uses your brand context to create a structured UGC brief, then turns it into a production-ready video generation.</p><div className="mt-7 grid grid-cols-3 gap-2"><Stat label="Format" value="9:16" /><Stat label="Length" value="30s" /><Stat label="Style" value="Talking head" /></div></div>
                <div className="rounded-[26px] border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"><p className="text-sm font-semibold">Choose a character</p><p className="mt-1 text-xs text-zinc-500">Characters keep your generated videos consistent.</p><div className="mt-5 space-y-2">{characters.map(item => <button key={item.name} onClick={() => setCharacter(item.name)} className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left ${character === item.name ? "border-orange-300 bg-orange-50" : "border-zinc-200 hover:bg-zinc-50"}`}><div><p className="text-sm font-semibold">{item.name}</p><p className="mt-1 text-xs text-zinc-500">{item.style}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${item.status === "Ready" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>{item.status}</span></button>)}</div></div>
                <div className="rounded-[26px] border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex justify-between"><div><p className="text-sm font-semibold">Generation brief</p><p className="mt-1 text-xs text-zinc-500">What the character should say and do.</p></div><span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-semibold text-orange-700">Brand-aware</span></div><textarea defaultValue="Open with a direct creator-growth hook. Explain one practical lesson, show a simple example, then end with a clear reason to follow for more." className="mt-5 min-h-32 w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" /></div>
              </section>
              <aside className="xl:sticky xl:top-24 xl:self-start"><div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm"><div className="border-b border-zinc-100 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Video preview</p><p className="mt-1 text-sm font-semibold">{character}</p></div><div className="m-4 flex aspect-[9/13] items-end rounded-[22px] bg-zinc-950 p-5 text-white"><div><span className="rounded-full bg-orange-500 px-2 py-1 text-[9px] font-bold">CONTENTRA UGC</span><h2 className="mt-3 text-xl font-semibold leading-tight">{generated ? "Your generation is queued." : "Your creator. Your message. Your brand."}</h2><p className="mt-2 text-xs leading-5 text-zinc-400">{generated ? "The production pipeline will track the generation status here." : "Preview the concept before rendering."}</p></div></div><div className="p-4 pt-0"><button onClick={() => setGenerated(true)} className="w-full rounded-2xl bg-orange-500 py-3.5 text-sm font-semibold text-white hover:bg-orange-600">{generated ? "Generation queued" : "Generate UGC video"}</button><p className="mt-3 text-center text-[10px] text-zinc-400">Generation availability depends on your configured video provider.</p></div></div></aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
function Stat({label,value}:{label:string,value:string}){return <div className="rounded-2xl border border-white/10 bg-white/5 p-3"><p className="text-[10px] text-zinc-500">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>}
function Sidebar({active}:{active:string}){const items=[["Overview","/app"],["Create","/app/create"],["Creatos","/app/creatos"],["Library","/app/library"],["Analytics","/app/analytics"],["Content DNA","/app/content-dna"],["Brand Brain","/app/brand-brain"],["AI UGC","/app/ugc"],["Campaigns","/app/campaigns"]];return <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white p-4 lg:flex lg:flex-col"><Link href="/" className="flex items-center gap-2 px-2 py-3 font-semibold tracking-tight"><span className="grid size-8 place-items-center rounded-xl bg-orange-500 text-sm font-black text-white">C</span>Contentra</Link><nav className="mt-7 space-y-1">{items.map(([label,href])=><Link key={label} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${active===label?"bg-orange-50 text-orange-700":"text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950"}`}><span className="grid size-7 place-items-center rounded-lg bg-zinc-100 text-[10px]">{label.slice(0,1)}</span>{label}</Link>)}</nav></aside>}
