"use client";

import GlossableText from "./GlossableText";
import { useGame } from "@/hooks/useGame";

export default function Hud() {
  const { state, go } = useGame();
  if (!state?.created) return null;
  const hpPct = Math.max(0, (state.hp / state.maxHp) * 100);

  return (
    <header className="relative z-20 flex items-center gap-2 px-3 py-2 bg-[#1a252f]/90 backdrop-blur text-white">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold truncate">{state.name}</span>
          <GlossableText text="剑客" className="text-[#85c1e9] text-xs" />
          <span className="text-[#f1c40f] text-xs">
            <GlossableText text="等级" /> {state.level}
          </span>
        </div>
        <div className="mt-1 h-2.5 rounded-full bg-[#2c3e50] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#e74c3c] transition-all"
            style={{ width: `${hpPct}%` }}
          />
        </div>
        <div className="flex gap-3 mt-0.5 text-[10px] text-white/70">
          <span>
            HP {state.hp}/{state.maxHp}
          </span>
          <span>
            <GlossableText text="识字" /> {state.literacyXp}
          </span>
          <span>
            <GlossableText text="金币" /> {state.gold}
          </span>
        </div>
      </div>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => go("quests")}
          className="px-2.5 py-2 rounded-lg bg-[#34495e] text-xs font-bold active:bg-[#3d566e]"
        >
          <GlossableText text="任务" />
        </button>
        <button
          type="button"
          onClick={() => go("inventory")}
          className="px-2.5 py-2 rounded-lg bg-[#34495e] text-xs font-bold active:bg-[#3d566e]"
        >
          <GlossableText text="背包" />
        </button>
        <button
          type="button"
          onClick={() => go("map")}
          className="px-2.5 py-2 rounded-lg bg-[#34495e] text-xs font-bold active:bg-[#3d566e]"
        >
          <GlossableText text="地图" />
        </button>
      </div>
    </header>
  );
}
