"use client";

import { skills } from "@/lib/data";
import { useGame } from "@/hooks/useGame";
import GlossableText from "../GlossableText";
import { EnemyArt, Knight } from "../LowPolyArt";

export default function CombatScreen() {
  const { state, castSkill, selectTarget, finishCombat, fleeCombat } = useGame();
  const combat = state?.combat;
  if (!state || !combat) return null;

  const unlocked = skills.filter((s) => state.unlockedSkills.includes(s.id));
  const hpPct = (combat.playerHp / combat.playerMaxHp) * 100;

  if (combat.phase === "victory") {
    return (
      <div className="flex flex-col h-full min-h-[100dvh] bg-[#1a252f] text-white px-4 py-8">
        <h2 className="text-3xl font-black text-[#f1c40f] text-center mb-4">
          <GlossableText text="胜利" />!
        </h2>
        <div className="card bg-[#2c3e50] text-white space-y-2 mb-6">
          <p>
            <GlossableText text="经验" /> +{combat.xpGained}
          </p>
          <p>
            <GlossableText text="识字" /> +{combat.literacyGained}
            {combat.noPeekBonus && (
              <span className="ml-2 text-[#2ecc71]">
                (<GlossableText text="无偷看" /> <GlossableText text="加成" />!
              </span>
            )}
          </p>
          <p>
            <GlossableText text="金币" /> +{combat.goldGained}
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={finishCombat}>
          <GlossableText text="继续" />
        </button>
      </div>
    );
  }

  if (combat.phase === "defeat") {
    return (
      <div className="flex flex-col h-full min-h-[100dvh] bg-[#1a252f] text-white px-4 py-8">
        <h2 className="text-3xl font-black text-[#e74c3c] text-center mb-4">
          <GlossableText text="失败" />…
        </h2>
        <p className="text-center mb-6 text-white/70">
          <GlossableText text="再试一次" /> — HP 已恢复一半
        </p>
        <button
          type="button"
          className="btn-primary"
          onClick={fleeCombat}
        >
          <GlossableText text="返回" /> <GlossableText text="地图" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-[100dvh] bg-gradient-to-b from-[#2c3e50] to-[#1a252f]">
      {/* trial banner */}
      {combat.isTrial && (
        <div className="px-3 py-2 bg-[#9b59b6] text-white text-center text-sm font-bold">
          <GlossableText text="识字试炼" /> —{" "}
          <GlossableText text="偷看" />{" "}
          <GlossableText text="剩余" /> {Math.max(0, (combat.maxPeeks ?? 0) - combat.peeksUsed)}
        </div>
      )}

      {/* enemies */}
      <div className="flex-1 flex items-end justify-center gap-4 px-4 pb-2 pt-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#5dade2]/30 to-transparent pointer-events-none" />
        {combat.enemies.map((e) => {
          const dead = e.hp <= 0;
          const selected = combat.selectedTarget === e.instanceId;
          return (
            <button
              key={e.instanceId}
              type="button"
              disabled={dead}
              onClick={() => selectTarget(e.instanceId)}
              className={`relative flex flex-col items-center transition ${
                dead ? "opacity-30 grayscale" : ""
              } ${selected ? "scale-110" : ""}`}
            >
              <EnemyArt shape={e.shape} color={e.color} className="w-20 h-16 drop-shadow-lg" />
              <div className="mt-1 text-white text-xs font-bold">
                <GlossableText text={e.name} />
              </div>
              <div className="w-16 h-2 rounded bg-[#2c3e50] mt-1 overflow-hidden">
                <div
                  className="h-full bg-[#e74c3c]"
                  style={{ width: `${(e.hp / e.maxHp) * 100}%` }}
                />
              </div>
              <div className="text-[10px] text-white/70">
                {e.hp}/{e.maxHp}
              </div>
              {selected && !dead && (
                <div className="absolute -top-2 text-[#f1c40f] text-xs">▼</div>
              )}
            </button>
          );
        })}
      </div>

      {/* player */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#1a252f]/80">
        <Knight className="w-10 h-14" />
        <div className="flex-1">
          <div className="text-white text-sm font-bold">{state.name}</div>
          <div className="h-3 rounded-full bg-[#2c3e50] overflow-hidden mt-1">
            <div
              className="h-full bg-[#2ecc71] transition-all"
              style={{ width: `${hpPct}%` }}
            />
          </div>
          <div className="text-[10px] text-white/60">
            HP {combat.playerHp}/{combat.playerMaxHp}
          </div>
        </div>
        {combat.blocking && (
          <span className="text-[#3498db] text-xs font-bold">
            <GlossableText text="格挡" />!
          </span>
        )}
      </div>

      {/* log */}
      <div className="h-16 overflow-y-auto px-3 text-xs text-white/70 bg-black/20">
        {combat.log.slice(-4).map((line, i) => (
          <div key={i}>
            <GlossableText text={line} />
          </div>
        ))}
      </div>

      {/* skills — big thumb buttons */}
      <div className="p-3 grid grid-cols-2 gap-2 bg-[#0d151c]">
        {unlocked.map((sk) => (
          <button
            key={sk.id}
            type="button"
            disabled={combat.phase !== "player"}
            onClick={() => castSkill(sk.id)}
            className="min-h-[64px] rounded-2xl font-black text-xl text-white shadow-lg active:scale-95 transition disabled:opacity-40 border-b-4 border-black/30"
            style={{ backgroundColor: sk.color }}
          >
            <GlossableText text={sk.name} />
          </button>
        ))}
      </div>
      <button
        type="button"
        className="py-2 text-xs text-white/40 bg-[#0d151c]"
        onClick={fleeCombat}
      >
        <GlossableText text="离开" />…
      </button>
    </div>
  );
}
