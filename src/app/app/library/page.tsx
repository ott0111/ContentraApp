"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppPage } from "@/components/app/app-page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Item = { id:string; title:string; type:string; status:string; platform:string|null; body:string|null; hook:string|null; caption:string|null; createdAt:string };

const filters = ["ALL","DRAFT","SCHEDULED","PUBLISHED"] as const;

export default function LibraryPage() {
  const [items,setItems]=useState<Item[]>([]);
  const [filter,setFilter]=useState<(typeof filters)[number]>("ALL");
  const [query,setQuery]=useState("");
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    (async()=>{
      try {
        const me=await fetch("/api/auth/me").then(r=>r.json());
        const workspace=me.data?.workspaces?.[0];
        if(!workspace) return;
        const r=await fetch(`/api/workspaces/${workspace.id}/content?limit=100`);
        const json=await r.json();
        setItems(json.data ?? []);
      } finally { setLoading(false); }
    })();
  },[]);

  const visible=useMemo(()=>items.filter(x=>(filter==="ALL"||x.status===filter)&&(!query||x.title.toLowerCase().includes(query.toLowerCase()))),[items,filter,query]);
  const counts={ALL:items.length,DRAFT:items.filter(x=>x.status==="DRAFT").length,SCHEDULED:items.filter(x=>x.status==="SCHEDULED").length,PUBLISHED:items.filter(x=>x.status==="PUBLISHED").length};

  return <AppPage>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div>
      <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-orange-700">Your content</span>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Everything you've made.</h1>
      <p className="mt-2 text-sm text-zinc-500">One place for drafts, scheduled posts, and published work.</p>
    </div><Button href="/app/create">Create</Button></div>

    <div className="mt-8 grid gap-3 sm:grid-cols-4">{filters.map(x=><button key={x} onClick={()=>setFilter(x)} className={`rounded-2xl border p-4 text-left transition ${filter===x?"border-orange-200 bg-orange-50":"border-zinc-200 bg-white hover:border-zinc-300"}`}><p className="text-xs text-zinc-400">{x==="ALL"?"All content":x[0]+x.slice(1).toLowerCase()}</p><p className="mt-1 text-2xl font-semibold">{counts[x]}</p></button>)}</div>

    <Card className="mt-7 overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-zinc-100 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-1 overflow-x-auto">{filters.map(x=><button key={x} onClick={()=>setFilter(x)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter===x?"bg-zinc-950 text-white":"text-zinc-500 hover:bg-zinc-100"}`}>{x}</button>)}</div>
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search content..." className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-orange-400 sm:w-64" /></div>
      {loading ? <div className="space-y-3 p-5"><div className="h-14 animate-pulse rounded-xl bg-zinc-100"/><div className="h-14 animate-pulse rounded-xl bg-zinc-100"/></div> :
      visible.length===0 ? <div className="p-12 text-center"><p className="text-sm font-semibold">Nothing here yet.</p><p className="mt-1 text-sm text-zinc-500">Create something and it will show up in your Library.</p><Link href="/app/create" className="mt-4 inline-flex rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white">Create content</Link></div> :
      <div className="divide-y divide-zinc-100">{visible.map(item=><div key={item.id} className="flex flex-col gap-4 p-5 transition hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0"><p className="truncate text-sm font-semibold">{item.title}</p><div className="mt-1 flex flex-wrap gap-2 text-xs text-zinc-400"><span>{item.type}</span><span>·</span><span>{item.platform||"No platform"}</span><span>·</span><span>{new Date(item.createdAt).toLocaleDateString()}</span></div>{item.hook&&<p className="mt-2 line-clamp-1 text-xs text-zinc-500">{item.hook}</p>}</div>
        <div className="flex shrink-0 items-center gap-2"><span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold text-zinc-600">{item.status}</span><button className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold hover:bg-zinc-50">Open</button></div>
      </div>)}</div>}
    </Card>
  </AppPage>;
}
