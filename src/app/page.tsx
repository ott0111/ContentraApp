import Link from "next/link";

const features = [
  { title: "Brand Brain", text: "Connect your business and give Contentra the context it needs to understand your brand." },
  { title: "Content DNA", text: "Find the formats, hooks, topics, and patterns that actually fit your audience." },
  { title: "Creatos", text: "Discover content opportunities and turn strong ideas into your next post." },
  { title: "AI UGC", text: "Build UGC concepts, characters, scripts, and video generations from one workflow." },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-xl bg-orange-500 text-sm font-black text-white">C</span>
          Contentra
        </Link>
        <div className="hidden items-center gap-8 text-sm text-zinc-600 md:flex">
          <a href="#features" className="transition hover:text-zinc-950">Features</a>
          <a href="#how-it-works" className="transition hover:text-zinc-950">How it works</a>
          <a href="#pricing" className="transition hover:text-zinc-950">Pricing</a>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100">Log in</Link>
          <Link href="/register" className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-500">Get started</Link>
        </div>
      </nav>

      <section className="relative overflow-hidden border-b border-zinc-100">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-orange-100/70 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 text-center md:pt-28">
          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-medium text-orange-700">
            <span className="size-1.5 rounded-full bg-orange-500" />
            The operating system for creators
          </div>
          <h1 className="mx-auto max-w-5xl text-5xl font-semibold tracking-[-0.055em] md:text-7xl">
            Stop guessing what to post.
            <span className="block text-orange-500">Know what to do next.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
            Contentra connects your business, content, audience, and AI into one growth system built for creators, businesses, and agencies.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/register" className="rounded-full bg-orange-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600">
              Start for free
            </Link>
            <a href="#features" className="rounded-full border border-zinc-200 bg-white px-7 py-3.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-300">
              Explore Contentra
            </a>
          </div>

          <div className="mx-auto mt-20 max-w-6xl rounded-[28px] border border-zinc-200 bg-zinc-950 p-2 shadow-2xl shadow-zinc-900/10">
            <div className="overflow-hidden rounded-[22px] bg-zinc-50">
              <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-4">
                <div className="flex items-center gap-2 text-sm font-semibold"><span className="size-7 rounded-lg bg-orange-500" /> Contentra</div>
                <div className="hidden gap-2 sm:flex"><span className="rounded-full bg-zinc-100 px-3 py-1 text-xs">Overview</span><span className="rounded-full px-3 py-1 text-xs text-zinc-500">Content</span><span className="rounded-full px-3 py-1 text-xs text-zinc-500">Analytics</span></div>
              </div>
              <div className="grid min-h-[390px] gap-4 p-5 md:grid-cols-[1.5fr_1fr]">
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-left">
                  <p className="text-xs font-medium text-zinc-500">NEXT BEST ACTION</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight">Turn your strongest topic into a short-form series.</h3>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-500">Contentra found a repeatable pattern across your content and turned it into a concrete action.</p>
                  <div className="mt-8 rounded-2xl bg-orange-50 p-4">
                    <div className="text-sm font-semibold text-orange-800">Content DNA signal</div>
                    <div className="mt-2 h-2 rounded-full bg-orange-100"><div className="h-2 w-4/5 rounded-full bg-orange-500" /></div>
                    <div className="mt-2 text-xs text-orange-700">High confidence · 82%</div>
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-left"><div className="text-xs text-zinc-500">CONTENT READY</div><div className="mt-2 text-3xl font-semibold">24</div><div className="mt-1 text-sm text-zinc-500">ideas, hooks & drafts</div></div>
                  <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-left"><div className="text-xs text-zinc-500">AUDIENCE SIGNAL</div><div className="mt-2 text-3xl font-semibold">+38%</div><div className="mt-1 text-sm text-zinc-500">engagement opportunity</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl"><p className="text-sm font-semibold text-orange-500">ONE SYSTEM</p><h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Everything your growth workflow needs.</h2></div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {features.map((feature) => <div key={feature.title} className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="mb-12 size-10 rounded-xl bg-orange-100" /><h3 className="text-xl font-semibold">{feature.title}</h3><p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">{feature.text}</p></div>)}
        </div>
      </section>

      <section id="how-it-works" className="border-y border-zinc-100 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-12 md:grid-cols-3">
            {[["01","Connect","Give Contentra your website, brand, goals, and platforms."],["02","Understand","Brand Brain and Content DNA turn your information into a living growth model."],["03","Create","Generate content, UGC, opportunities, and next actions from that context."]].map(([num,title,text]) => <div key={num}><span className="text-sm font-semibold text-orange-500">{num}</span><h3 className="mt-5 text-2xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-zinc-500">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6 py-24 text-center">
        <p className="text-sm font-semibold text-orange-500">START FREE</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">Your growth system starts here.</h2>
        <p className="mx-auto mt-4 max-w-xl text-zinc-500">Start with the free plan. Upgrade when Contentra becomes part of your workflow.</p>
        <Link href="/register" className="mt-8 inline-flex rounded-full bg-orange-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600">Create your workspace</Link>
      </section>

      <footer className="border-t border-zinc-100 px-6 py-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-zinc-500 sm:flex-row"><span>© {new Date().getFullYear()} Contentra</span><div className="flex gap-5"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="mailto:hello@contentra.app">Contact</a></div></div></footer>
    </main>
  );
}
