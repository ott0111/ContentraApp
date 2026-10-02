"use client";
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="grid min-h-[70vh] place-items-center bg-[#f7f7f5] p-6"><div className="max-w-md rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm"><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-orange-100 font-bold text-orange-700">!</div><h1 className="mt-5 text-xl font-semibold">Something went wrong</h1><p className="mt-2 text-sm leading-6 text-zinc-500">We couldn't load this workspace view. Try again, and if it keeps happening, check Help.</p><button onClick={reset} className="mt-6 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white">Try again</button></div></div>;
}
