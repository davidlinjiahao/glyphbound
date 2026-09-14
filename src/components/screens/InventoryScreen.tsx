"use client";

import { skills } from "@/lib/data";
import { useGame } from "@/hooks/useGame";
import GlossableText from "../GlossableText";
import Hud from "../Hud";

export default function InventoryScreen() {
  const { state, go } = useGame();
  if (!state) return null;
  const unlocked = skills.filter((s) => state.unlockedSkills.includes(s.id));

  return (
    <div className="flex flex-col h-full min-h-[100dvh] bg-[#ecf0f1]">
      <Hud />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <h2 className="text-xl font-black">
          <GlossableText text="背包" />
        </h2>
        <div className="card">
          <div className="text-sm text-[#7f8c8d] mb-2">
            <GlossableText text="物品" />
          </div>
          {state.inventory.length === 0 && (
            <p className="text-sm text-[#95a5a6]">空</p>
          )}
          {state.inventory.map((it) => (
            <div
              key={it.id}
              className="flex justify-between py-2 border-b border-[#ecf0f1] last:border-0"
            >
              <GlossableText text={it.name} className="font-bold" />
              <span>×{it.qty}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="text-sm text-[#7f8c8d] mb-2">
            <GlossableText text="技能" />
          </div>
          {unlocked.map((sk) => (
            <div key={sk.id} className="flex items-center gap-2 py-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: sk.color }}
              />
              <GlossableText text={sk.name} className="font-bold" />
              <span className="text-xs text-[#7f8c8d] ml-auto">
                <GlossableText text={sk.description} />
              </span>
            </div>
          ))}
        </div>
        <div className="card text-sm space-y-1">
          <div>
            <GlossableText text="识字" /> XP: {state.literacyXp}
          </div>
          <div>
            <GlossableText text="无偷看" /> 次数: {state.noPeekActions}
          </div>
          <div>
            <GlossableText text="偷看" /> 总计: {state.totalPeeks}
          </div>
        </div>
      </div>
      <button
        type="button"
        className="m-3 btn-secondary"
        onClick={() => go("map")}
      >
        <GlossableText text="返回" />
      </button>
    </div>
  );
}
