"use client";

import { useGame } from "@/hooks/useGame";
import GlossableText from "../GlossableText";

export default function LootScreen() {
  const { state, dismissLoot } = useGame();
  const loot = state?.pendingLoot ?? [];

  return (
    <div className="flex flex-col h-full min-h-[100dvh] bg-[#1a252f] text-white px-4 py-8">
      <h2 className="text-2xl font-black text-[#f1c40f] text-center mb-6">
        <GlossableText text="战利品" />!
      </h2>
      <div className="space-y-2 mb-8">
        {loot.length === 0 && (
          <p className="text-center text-white/50">—</p>
        )}
        {loot.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#2c3e50]"
          >
            <GlossableText text={item.name} className="font-bold" />
            <span className="text-[#f1c40f]">×{item.qty}</span>
          </div>
        ))}
      </div>
      <button type="button" className="btn-primary" onClick={dismissLoot}>
        <GlossableText text="获得" />!
      </button>
    </div>
  );
}
