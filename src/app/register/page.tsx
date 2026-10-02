import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-8 text-zinc-950">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-xl lg:grid-cols-2">
          <div className="hidden bg-orange-500 p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold"><span className="grid size-9 place-items-center rounded-xl bg-white text-sm font-black text-orange-500">C</span>Contentra</Link>
            <div><p className="text-sm font-semibold text-orange-100">START FREE</p><h1 className="mt-4 text-5xl font-semibold tracking-tight">Build your growth system.</h1><p className="mt-5 max-w-md leading-7 text-orange-100">Give Contentra the context it needs, then turn signals into content.</p></div>
            <p className="text-xs text-orange-100">Free to start. Upgrade when you need more.</p>
          </div>
          <div className="p-7 sm:p-10 lg:p-14">
            <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-950">← Back to Contentra</Link>
            <div className="mt-12"><h2 className="text-3xl font-semibold tracking-tight">Create your workspace</h2><p className="mt-2 text-sm text-zinc-500">Start with your brand. Build from there.</p></div>
            <form className="mt-8 space-y-4">
              <label className="block text-sm font-medium">Name<input type="text" placeholder="Your name" className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" /></label>
              <label className="block text-sm font-medium">Email<input type="email" placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" /></label>
              <label className="block text-sm font-medium">Password<input type="password" placeholder="Create a password" className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" /></label>
              <button type="submit" className="w-full rounded-xl bg-orange-500 py-3.5 text-sm font-semibold text-white hover:bg-orange-600">Create workspace</button>
            </form>
            <p className="mt-6 text-center text-sm text-zinc-500">Already have an account? <Link href="/login" className="font-medium text-orange-600">Log in</Link></p>
          </div>
        </div>
      </div>
    </main>
  );
}
