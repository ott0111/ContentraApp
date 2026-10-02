"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ContentraIcon from "../../../Assets/Contentra_Logo_FINAL-removebg-preview.png";

const primary = [
  { label: "Overview", href: "/app", icon: "⌂" },
  { label: "Create", href: "/app/create", icon: "＋" },
  { label: "Creatos", href: "/app/creatos", icon: "◈" },
  { label: "Library", href: "/app/library", icon: "▣" },
  { label: "Analytics", href: "/app/analytics", icon: "↗" },
  { label: "Campaigns", href: "/app/campaigns", icon: "◇" },
];

const secondary = [
  { label: "Brand Brain", href: "/app/brand-brain" },
  { label: "Content DNA", href: "/app/content-dna" },
  { label: "Next Actions", href: "/app/next-actions" },
  { label: "AI UGC", href: "/app/ugc" },
];

type Workspace = { id: string; name: string; plan: string; role: string };

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const active = primary.find((item) => pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href)))?.label
    ?? secondary.find((item) => pathname.startsWith(item.href))?.label ?? "Workspace";

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.ok ? res.json() : null)
      .then((json) => {
        if (!cancelled) setWorkspace(json?.data?.workspaces?.[0] ?? null);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const plan = workspace?.plan ? workspace.plan[0] + workspace.plan.slice(1).toLowerCase() : "Free";
  const initial = workspace?.name?.trim()?.[0]?.toUpperCase() ?? "Y";

  return (
    <div className="app-shell min-h-screen bg-[#f7f7f5] text-zinc-950">
      <aside className="app-sidebar fixed inset-y-0 left-0 z-40 hidden w-[272px] border-r border-zinc-200/80 bg-white lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b border-zinc-100 px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src={ContentraIcon.src} alt="Contentra" width={34} height={34} className="size-8 object-contain" />
            <span className="text-[15px] font-semibold tracking-tight">Contentra</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[.16em] text-zinc-400">Workspace</p>
          <div className="space-y-1">{primary.map((item) => <NavItem key={item.href} {...item} active={active === item.label} />)}</div>
          <p className="px-3 pb-2 pt-7 text-[10px] font-bold uppercase tracking-[.16em] text-zinc-400">Intelligence</p>
          <div className="space-y-1">{secondary.map((item) => <NavItem key={item.href} {...item} active={active === item.label} />)}</div>
        </nav>
        <div className="border-t border-zinc-100 p-3">
          <Link href="/app/settings" className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950"><span className="grid size-7 place-items-center rounded-lg bg-zinc-100 text-xs">⚙</span> Settings</Link>
          <Link href="/app/help" className="mb-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950"><span className="grid size-7 place-items-center rounded-lg bg-zinc-100 text-xs">?</span> Help</Link>
          <Link href="/app/billing" className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">{initial}</span>
            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{workspace?.name ?? "Your workspace"}</span><span className="mt-0.5 block text-xs text-zinc-500">{plan} plan</span></span>
            <span className="text-zinc-400">›</span>
          </Link>
        </div>
      </aside>
      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-[#f7f7f5]/90 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Link href="/" className="lg:hidden"><Image src={ContentraIcon.src} alt="Contentra" width={32} height={32} className="size-8 object-contain" /></Link>
              <div><p className="text-sm font-semibold">{active}</p><p className="hidden text-xs text-zinc-500 sm:block">{workspace?.name ?? "Your growth system"}, in one place.</p></div>
            </div>
            <div className="flex items-center gap-2"><Link href="/app/billing" className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:border-zinc-300">{plan}</Link><Link href="/app/settings" className="grid size-9 place-items-center rounded-full bg-zinc-950 text-xs font-semibold text-white">{initial}</Link></div>
          </div>
        </header>
        <main className="min-w-0">{children}</main>
      </div>
      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 rounded-2xl border border-zinc-200/90 bg-white/95 p-1.5 shadow-2xl shadow-zinc-900/10 backdrop-blur-xl lg:hidden">
        {primary.slice(0, 5).map((item) => <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-semibold ${pathname === item.href ? "bg-orange-50 text-orange-700" : "text-zinc-400"}`}><span className="text-sm">{item.icon}</span>{item.label}</Link>)}
      </nav>
    </div>
  );
}

function NavItem({ label, href, icon, active }: { label: string; href: string; icon?: string; active: boolean }) {
  return <Link href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-orange-50 text-orange-700" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950"}`}><span className={`grid size-7 place-items-center rounded-lg text-xs ${active ? "bg-white" : "bg-zinc-100"}`}>{icon ?? "•"}</span>{label}</Link>;
}
