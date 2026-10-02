"use client";

import Link from "next/link";
import { useState } from "react";

const sections = [
  ["Business", "What you sell, who you serve, and what makes the business different."],
  ["Audience", "The people Contentra should speak to, including their problems and motivations."],
  ["Positioning", "The angle, promise, and category you want your brand to own."],
  ["Voice", "How your brand sounds across posts, scripts, captions, and campaigns."],
  ["Goals", "The outcomes Contentra should optimize your content around."],
  ["Offers", "Products, services, launches, and calls-to-action you want content to support."]
];

export default function BrandBrainPage() {
  const [saved, setSaved] = useState(false);
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-zinc-950">
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        <AppSidebar active="Brand Brain" />
        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-[#f7f7f5]/90 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
              <div><p className="text-sm font-semibold">Brand Brain</p><p className="hidden text-xs text-zinc-500 sm:block">The context layer behind every Contentra decision.</p></div>
              <button onClick={() => setSaved(true)} className="rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600">{saved ? "Saved" : "Save changes"}</button>
            </div>
          </header>
          <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
            <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-zinc-950 p-6 text-white shadow-xl sm:p-8">
              <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div className="max-w-2xl"><span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-300">YOUR BRAND CONTEXT</span><h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Teach Contentra how your brand thinks.</h1><p className="mt-3 text-sm leading-6 text-zinc-400">Brand Brain gives every generation, recommendation, and opportunity the context it needs to sound like you.</p></div>
                <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-white/5 p-4"><div className="flex justify-between text-xs"><span className="text-zinc-400">Completeness</span><span className="font-semibold text-orange-300">82%</span></div><div className="mt-3 h-2 rounded-full bg-white/10"><div className="h-2 w-[82%] rounded-full bg-orange-500" /></div><p className="mt-3 text-[11px] text-zinc-500">Add your offers and competitors to improve recommendations.</p></div>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {sections.map(([title, text], index) => <div key={title} className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-orange-50 text-xs font-bold text-orange-600">{String(index + 1).padStart(2,"0")}</span><h2 className="text-sm font-semibold">{title}</h2></div><span className="size-2 rounded-full bg-emerald-500" /></div><p className="mt-4 text-xs leading-5 text-zinc-500">{text}</p><div className="mt-4 rounded-2xl bg-zinc-50 p-3 text-xs text-zinc-700">{title === "Voice" ? "Direct · useful · confident" : title === "Audience" ? "Creators, businesses & agencies" : "Add your workspace context here..."}</div></div>)}
            </div>
            <div className="mt-6 rounded-[24px] border border-orange-200 bg-orange-50 p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-sm font-semibold text-orange-950">Website intelligence</p><p className="mt-1 text-xs text-orange-900/60">Paste your website and Contentra can extract useful brand context for you.</p></div><Link href="/app/settings" className="rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600">Configure source</Link></div></div>
          </div>
        </section>
      </div>
    </main>
  );
}

function AppSidebar({ active }: { active: string }) {
  const items = [["Overview","/app"],["Create","/app/create"],["Creatos","/app/creatos"],["Library","/app/library"],["Analytics","/app/analytics"],["Content DNA","/app/content-dna"],["Brand Brain","/app/brand-brain"],["Campaigns","/app/campaigns"]];
  return <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white p-4 lg:flex lg:flex-col"><Link href="/" className="flex items-center gap-2 px-2 py-3 font-semibold tracking-tight"><span className="grid size-8 place-items-center rounded-xl bg-orange-500 text-sm font-black text-white">C</span>Contentra</Link><nav className="mt-7 space-y-1">{items.map(([label,href]) => <Link key={label} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${active === label ? "bg-orange-50 text-orange-700" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950"}`}><span className="grid size-7 place-items-center rounded-lg bg-zinc-100 text-[10px]">{label.slice(0,1)}</span>{label}</Link>)}</nav><div className="mt-auto border-t border-zinc-100 pt-4"><Link href="/app/settings" className="block rounded-xl bg-zinc-50 p-3 text-xs text-zinc-500 hover:bg-zinc-100">Workspace settings</Link></div></aside>;
}
