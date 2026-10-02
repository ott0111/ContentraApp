export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-zinc-200/90 bg-white shadow-sm ${className}`}>{children}</section>;
}
export function CardHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="flex items-start justify-between gap-4 p-5 sm:p-6"><div>{eyebrow && <p className="text-[10px] font-bold uppercase tracking-[.16em] text-orange-600">{eyebrow}</p>}<h2 className="mt-1 text-lg font-semibold tracking-tight">{title}</h2>{description && <p className="mt-1.5 text-sm leading-6 text-zinc-500">{description}</p>}</div>{action}</div>;
}
