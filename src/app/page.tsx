import ContentraIcon from "../../Assets/Contentra_Logo_FINAL-removebg-preview.png";
import ContentraLogo from "../../Assets/Contentra_Logo_FINAL.png";
"use client";

import Image from "next/image";
import Link from "next/link";

const features = [
  ["Brand Brain", "Give Contentra the context behind your business, audience, positioning, voice, offers and goals.", "/app/brand-brain"],
  ["Content DNA", "See the hooks, formats, topics and patterns that are actually working across your content.", "/app/content-dna"],
  ["Creatos", "Find strong content opportunities, save them, remix them and turn them into your next move.", "/app/creatos"],
  ["AI UGC", "Go from a concept to a structured UGC brief and production-ready generation workflow.", "/app/ugc"],
];

const stats = [
  ["01", "Understand", "Contentra builds a living model of your brand and audience."],
  ["02", "Create", "Turn context into hooks, scripts, posts, UGC and remixes."],
  ["03", "Improve", "Use performance signals to decide what to do next."],
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-zinc-950">
      <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-zinc-200/80 bg-white/85 px-3 py-2 shadow-lg shadow-zinc-900/5 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2.5 rounded-full px-2 py-1.5">
            <Image src={ContentraIcon.src} alt="Contentra" width={38} height={38} className="size-9 object-contain" />
            <span className="text-sm font-semibold tracking-tight">Contentra</span>
          </Link>
          <div className="hidden items-center gap-7 text-sm text-zinc-500 md:flex">
            <a href="#product" className="hover:text-zinc-950">Product</a>
            <a href="#workflow" className="hover:text-zinc-950">How it works</a>
            <a href="#features" className="hover:text-zinc-950">Features</a>
            <a href="#pricing" className="hover:text-zinc-950">Pricing</a>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/login" className="hidden rounded-full px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 sm:inline-flex">Log in</Link>
            <Link href="/register" className="rounded-full bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500">Get started</Link>
          </div>
        </div>
      </nav>

      <section className="relative px-4 pb-20 pt-36 sm:px-6 sm:pt-44">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[720px] w-[1100px] -translate-x-1/2 rounded-full bg-orange-100/80 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-44 -z-0 h-[380px] w-[700px] -translate-x-1/2 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold text-orange-700 shadow-sm backdrop-blur">
            <span className="size-1.5 rounded-full bg-orange-500" />
            The operating system for creators
          </div>
          <h1 className="mx-auto mt-7 max-w-6xl text-5xl font-semibold tracking-[-0.065em] sm:text-6xl md:text-8xl">
            Turn ideas into content.
            <span className="block text-orange-500">Then know what to do next.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
            Contentra connects your business, content, audience, analytics and AI into one growth system for creators, businesses and agencies.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/register" className="rounded-full bg-orange-500 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600">Start for free</Link>
            <a href="#product" className="rounded-full border border-zinc-200 bg-white px-7 py-3.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300">See the product</a>
          </div>

          <div id="product" className="mx-auto mt-20 max-w-6xl overflow-hidden rounded-[32px] border border-zinc-200 bg-zinc-950 p-2 shadow-2xl shadow-zinc-900/15">
            <div className="overflow-hidden rounded-[25px] bg-[#f7f7f5]">
              <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <Image src={ContentraIcon.src} alt="" width={30} height={30} className="size-7 object-contain" />
                  <span className="text-xs font-semibold">Contentra</span>
                </div>
                <div className="hidden items-center gap-1 rounded-full bg-zinc-100 p-1 sm:flex">
                  {["Overview", "Create", "Creatos", "Analytics"].map((item, i) => <span key={item} className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${i === 0 ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-400"}`}>{item}</span>)}
                </div>
                <span className="size-2 rounded-full bg-orange-500" />
              </div>
              <div className="grid gap-4 p-4 text-left sm:p-6 lg:grid-cols-[1.45fr_.8fr]">
                <div className="rounded-[24px] border border-zinc-200 bg-white p-5 sm:p-7">
                  <div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-zinc-400">Next best action</p><p className="mt-1 text-xs text-zinc-400">Based on your latest signals</p></div><span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-orange-700">82% confidence</span></div>
                  <h2 className="mt-8 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">Turn your strongest topic into a short-form series.</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">Your Content DNA found a repeatable pattern around creator growth and direct hooks. Build on the signal instead of starting from scratch.</p>
                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    {[["Hook", "Direct statement", "91%"], ["Format", "Talking head", "86%"], ["Topic", "Creator growth", "88%"]].map(([a,b,c]) => <div key={a} className="rounded-2xl bg-zinc-50 p-3"><p className="text-[9px] font-semibold uppercase tracking-wide text-zinc-400">{a}</p><p className="mt-1 text-xs font-semibold">{b}</p><p className="mt-1 text-[10px] text-orange-600">{c} fit</p></div>)}
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-[24px] bg-orange-500 p-5 text-white"><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-orange-100">Content ready</p><p className="mt-2 text-4xl font-semibold">24</p><p className="mt-1 text-xs text-orange-100">ideas, hooks & drafts</p></div>
                  <div className="rounded-[24px] border border-zinc-200 bg-white p-5"><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-zinc-400">Audience signal</p><p className="mt-2 text-4xl font-semibold">+38%</p><p className="mt-1 text-xs text-zinc-500">engagement opportunity</p></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
            <Image src="/assets/Turn Ideas Into Content, Faster.png" alt="Turn Ideas Into Content, Faster" width={1600} height={500} className="h-auto w-full object-cover" priority />
          </div>
        </div>
      </section>

      <section id="workflow" className="border-y border-zinc-100 bg-[#fafaf9] px-6">
        <div className="mx-auto max-w-7xl py-24 sm:py-28">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-orange-500">One workflow</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Less guessing. More momentum.</h2><p className="mt-5 text-base leading-7 text-zinc-500">Contentra turns your information and performance signals into a system you can actually use every day.</p></div>
          <div className="mt-16 grid gap-10 md:grid-cols-3">{stats.map(([num,title,text]) => <div key={num} className="border-t border-zinc-300 pt-5"><span className="text-xs font-bold text-orange-500">{num}</span><h3 className="mt-8 text-2xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-zinc-500">{text}</p></div>)}</div>
        </div>
      </section>

      <section id="features" className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-orange-500">The system</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Everything connected.</h2></div><p className="max-w-md text-sm leading-6 text-zinc-500">Every feature feeds the next one, so your content gets smarter as your workspace gets more complete.</p></div>
          <div className="mt-14 grid gap-4 md:grid-cols-2">{features.map(([title,text,href],i) => <Link href={href} key={title} className="group rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-8"><div className="flex items-start justify-between"><span className="grid size-11 place-items-center rounded-2xl bg-orange-50 text-sm font-bold text-orange-600">0{i+1}</span><span className="text-zinc-300 transition group-hover:translate-x-1 group-hover:text-orange-500">↗</span></div><h3 className="mt-16 text-2xl font-semibold">{title}</h3><p className="mt-3 max-w-lg text-sm leading-6 text-zinc-500">{text}</p></Link>)}</div>
        </div>
      </section>

      <section id="pricing" className="px-6 pb-28">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-zinc-950 p-8 text-white sm:p-12">
          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-orange-400">Start free</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Your next piece of content starts with your next decision.</h2><p className="mt-5 text-sm leading-6 text-zinc-400">Start with Contentra Free. Upgrade when the system becomes part of your workflow.</p></div><Link href="/register" className="shrink-0 rounded-full bg-orange-500 px-7 py-3.5 text-sm font-semibold text-white hover:bg-orange-600">Create your workspace</Link></div>
        </div>
      </section>

      <footer className="border-t border-zinc-100 px-6 py-9"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-sm text-zinc-500 sm:flex-row"><Link href="/" className="flex items-center gap-2 font-semibold text-zinc-950"><Image src={ContentraIcon.src} alt="" width={28} height={28} className="size-7 object-contain" />Contentra</Link><div className="flex gap-5"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link></div></div></footer>
    </main>
  );
}
