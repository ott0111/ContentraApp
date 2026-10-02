"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppPage } from "@/components/app/app-page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Opportunity={id:string;title:string;description:string|null;platform:string|null;score:number;status:string;suggestedHook:string|null;suggestedAngle:string|null;source:string|null;createdAt:string};

export default function CreatosPage(){
  const [items,setItems]=useState<Opportunity[]>([]);
  const [index,setIndex]=useState(0);
  const [saved,setSaved]=useState(0);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  useEffect(()=>{(async()=>{
    try{
      const me=await fetch("/api/auth/me").then(r=>r.json());
      const workspace=me.data?.workspaces?.[0];
      if(!workspace) return;
      const r=await fetch(`/api/workspaces/${workspace.id}/opportunities?limit=50`);
      const json=await r.json();
      if(!r.ok){setError(json.details?.code==="PLAN_REQUIRED"?"Creatos is available on Pro and above.":(json.error||"Couldn't load opportunities."));return;}
      setItems(json.data??[]);
    }catch{setError("Couldn't load opportunities.");}finally{setLoading(false);}
  })()},[]);
  const current=items[index];
  async function act(status:"SAVED"|"DISMISSED"){
    if(!current) return;
    const me=await fetch("/api/auth/me").then(r=>r.json());
    const workspace=me.data?.workspaces?.[0];
    if(!workspace)return;
    await fetch(`/api/workspaces/${workspace.id}/opportunities/${current.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status})});
    if(status==="SAVED")setSaved(x=>x+1);
    setIndex(x=>x+1);
  }
  if(loading)return <AppPage><div className="h-[620px] animate-pulse rounded-3xl bg-zinc-100"/></AppPage>;
  return <AppPage>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-orange-700">Content opportunities</span><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Find what is already working.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">Review opportunities surfaced for your workspace, save the ones worth remixing, and move on.</p></div><Button href="/app/create">Create content</Button></div>
    {error?<div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-orange-800">{error}</div>:
    !current?<Card className="mt-8 p-10 text-center"><p className="text-lg font-semibold">{items.length?"You're caught up.":"No opportunities yet."}</p><p className="mt-2 text-sm text-zinc-500">{items.length?"Come back when Contentra has more ideas for you.":"Once opportunities are available for your workspace, they'll appear here."}</p></Card>:
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <Card className="overflow-hidden"><div className="bg-zinc-950 p-6 text-white sm:p-8"><div className="flex items-center justify-between gap-4"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold">{current.platform||"Multi-platform"}</span>{current.source&&<span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold">{current.source}</span>}</div><div className="text-right"><p className="text-[10px] uppercase tracking-wide text-orange-300">Contentra fit</p><p className="text-2xl font-semibold">{Math.round(current.score)}%</p></div></div>
      <h2 className="mt-14 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{current.title}</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">{current.description||"A content opportunity matched to your workspace signals."}</p></div>
      <div className="space-y-4 p-5 sm:p-6">{current.suggestedHook&&<div className="rounded-2xl bg-orange-50 p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-orange-600">Suggested hook</p><p className="mt-2 text-sm font-semibold leading-6">{current.suggestedHook}</p></div>}{current.suggestedAngle&&<div className="rounded-2xl border border-zinc-200 p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-zinc-400">Suggested angle</p><p className="mt-2 text-sm leading-6 text-zinc-600">{current.suggestedAngle}</p></div>}<div className="grid grid-cols-3 gap-2"><button onClick={()=>act("SAVED")} className="rounded-xl border border-zinc-200 py-3 text-sm font-semibold hover:border-orange-300 hover:bg-orange-50">Save</button><button onClick={()=>act("SAVED")} className="rounded-xl bg-zinc-950 py-3 text-sm font-semibold text-white hover:bg-orange-500">Remix</button><button onClick={()=>act("DISMISSED")} className="rounded-xl border border-zinc-200 py-3 text-sm font-semibold text-zinc-600 hover:bg-zinc-50">Skip</button></div></div></Card>
      <aside className="space-y-4"><Card className="p-5"><p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Session</p><p className="mt-2 text-3xl font-semibold">{saved}</p><p className="text-sm text-zinc-500">opportunities saved this session</p><Link href="/app/library" className="mt-5 inline-flex rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold">Open Library</Link></Card><Card className="p-5"><p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">How it works</p><div className="mt-4 space-y-3 text-sm text-zinc-600"><p>01 · Contentra finds a pattern.</p><p>02 · Your Content DNA scores the fit.</p><p>03 · You save, remix, or skip.</p></div></Card></aside>
    </div>}
  </AppPage>;
}
