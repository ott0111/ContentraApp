"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const formats = [
  { id: "short", label: "Short-form video", detail: "Hook + script + shot plan" },
  { id: "post", label: "Social post", detail: "Text-first post with a strong hook" },
  { id: "ugc", label: "AI UGC", detail: "Character-led vertical video" },
  { id: "remix", label: "Remix", detail: "Turn a winning idea into yours" },
];

const platforms = ["TikTok", "Instagram", "YouTube", "X"];

const previewImages = {
  short: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=85",
  post: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=85",
  ugc: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
  remix: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
};

export default function CreatePage() {
  const [format, setFormat] = useState("short");
  const [platform, setPlatform] = useState("TikTok");
  const [prompt, setPrompt] = useState("Give me a practical creator-growth idea that feels like advice from someone actually building.");
  const [generated, setGenerated] = useState(false);

  const currentFormat = formats.find((item) => item.id === format) ?? formats[0];

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
              <Link key={label} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${label === "Create" ? "bg-orange-50 text-orange-700" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950"}`}>
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
                <p className="text-sm font-semibold">Create</p>
                <p className="hidden text-xs text-zinc-500 sm:block">Turn an idea into something worth publishing.</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/app/creatos" className="hidden rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold sm:inline-flex">Find ideas</Link>
                <button onClick={() => setGenerated(true)} className="rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-orange-600">Generate</button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
            <div className="mb-7">
              <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">CONTENT ENGINE</span>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">What are we making?</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">Start with a thought, a goal, or a winning idea. Contentra turns it into a publish-ready concept using your Brand Brain and Content DNA.</p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
              <section className="space-y-5">
                <div className="rounded-[26px] border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm font-semibold">1. Choose a format</p><p className="mt-1 text-xs text-zinc-500">Contentra adapts the output to the job.</p></div>
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Required</span>
                  </div>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {formats.map((item) => (
                      <button key={item.id} onClick={() => setFormat(item.id)} className={`rounded-2xl border p-4 text-left transition ${format === item.id ? "border-orange-300 bg-orange-50 ring-1 ring-orange-200" : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"}`}>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold">{item.label}</span>
                          <span className={`grid size-5 place-items-center rounded-full border text-[10px] ${format === item.id ? "border-orange-500 bg-orange-500 text-white" : "border-zinc-300 text-transparent"}`}>✓</span>
                        </div>
                        <p className="mt-1 text-xs leading-5 text-zinc-500">{item.detail}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[26px] border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
                  <div><p className="text-sm font-semibold">2. Tell Contentra what you want</p><p className="mt-1 text-xs text-zinc-500">You don't need to write a perfect prompt.</p></div>
                  <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="mt-5 min-h-36 w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 outline-none transition placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" placeholder="What should this content be about?" />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Make it more direct", "Give me 3 hooks", "Make it educational", "Make it controversial"].map((suggestion) => (
                      <button key={suggestion} onClick={() => setPrompt((value) => value + " " + suggestion + ".")} className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-500 hover:border-orange-200 hover:text-orange-700">{suggestion}</button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[26px] border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
                  <div><p className="text-sm font-semibold">3. Where is it going?</p><p className="mt-1 text-xs text-zinc-500">Choose the platform so the output feels native.</p></div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {platforms.map((item) => <button key={item} onClick={() => setPlatform(item)} className={`rounded-full px-4 py-2 text-xs font-semibold transition ${platform === item ? "bg-zinc-950 text-white" : "border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-950"}`}>{item}</button>)}
                  </div>
                </div>

                {format === "ugc" && (
                  <div className="rounded-[26px] border border-orange-200 bg-orange-50 p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-orange-500 text-sm font-black text-white">AI</div>
                      <div><p className="text-sm font-semibold">AI UGC studio</p><p className="mt-1 text-xs leading-5 text-orange-900/60">Pick a character, generate a brief, then render a vertical video. Your Brand Brain keeps the message on-brand.</p></div>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <div className="rounded-2xl border border-orange-200 bg-white p-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-orange-600">Character</p><p className="mt-1 text-sm font-semibold">Creator #014</p><p className="text-xs text-zinc-500">Casual · direct</p></div>
                      <div className="rounded-2xl border border-orange-200 bg-white p-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-orange-600">Style</p><p className="mt-1 text-sm font-semibold">Talking head</p><p className="text-xs text-zinc-500">9:16 · 30 sec</p></div>
                    </div>
                  </div>
                )}
              </section>

              <aside className="xl:sticky xl:top-24 xl:self-start">
                <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm">
                  <div className="border-b border-zinc-100 p-4">
                    <div className="flex items-center justify-between">
                      <div><p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Live preview</p><p className="mt-1 text-sm font-semibold">{currentFormat.label}</p></div>
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-medium text-zinc-500">{platform}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="relative overflow-hidden rounded-[22px] bg-zinc-950">
                      <Image src={previewImages[format as keyof typeof previewImages]} alt="Content preview" width={900} height={1100} className="aspect-[4/5] w-full object-cover opacity-90" unoptimized />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                        <span className="rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-semibold">CONTENTRA</span>
                        <h2 className="mt-3 text-xl font-semibold leading-tight">{generated ? "The content is ready. Now make it yours." : "Your strongest idea, turned into content."}</h2>
                        <p className="mt-2 text-xs leading-5 text-zinc-300">{generated ? "Hook, structure and CTA generated from your workspace signals." : "Preview updates as you choose the format, platform and angle."}</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-zinc-50 p-4">
                      <div className="flex items-center justify-between"><span className="text-xs font-medium text-zinc-500">Hook</span><span className="text-[10px] font-semibold text-orange-600">92% fit</span></div>
                      <p className="mt-2 text-sm font-semibold leading-5">"Nobody tells you this when you start creating."</p>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <Metric label="Hook" value="92%" />
                      <Metric label="Format" value="89%" />
                      <Metric label="Brand" value="96%" />
                    </div>

                    <button onClick={() => setGenerated(true)} className="mt-4 w-full rounded-2xl bg-zinc-950 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-500">
                      {generated ? "Regenerate content" : "Generate content"}
                    </button>
                    <p className="mt-3 text-center text-[10px] text-zinc-400">Uses your Brand Brain + Content DNA</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-zinc-200 bg-white p-3 text-center"><p className="text-[10px] text-zinc-400">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>;
}
