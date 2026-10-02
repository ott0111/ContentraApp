import Link from "next/link";

type Props = { children: React.ReactNode; href?: string; variant?: "primary"|"secondary"|"ghost"|"danger"; className?: string; onClick?: () => void; type?: "button"|"submit" };
const styles = { primary:"bg-orange-500 text-white hover:bg-orange-600 shadow-sm shadow-orange-500/15", secondary:"border border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50", ghost:"text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950", danger:"border border-red-200 bg-white text-red-600 hover:bg-red-50" };
export function Button({ children, href, variant="primary", className="", onClick, type="button" }: Props) {
  const classes = `inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-orange-400/40 disabled:pointer-events-none disabled:opacity-50 ${styles[variant]} ${className}`;
  return href ? <Link href={href} className={classes}>{children}</Link> : <button type={type} onClick={onClick} className={classes}>{children}</button>;
}
