"use client";

import { skills } from "@/lib/data";
import { useGame } from "@/hooks/useGame";
import GlossableText from "../GlossableText";

export default function LevelUpScreen() {
  const { state, dismissLevelUp } = useGame();
  if (!state) return null;
  const newly = skills.filter(
    (s) => s.unlockLevel === state.level && state.unlockedSkills.includes(s.id)
  );

  return (
    <div className="flex flex-col h-full min-h-[100dvh] bg-[#1a252f] text-white items-center justify-center px-6">
      <div className="text-5xl mb-2">⭐</div>
      <h2 className="text-3xl font-black text-[#f1c40f] mb-2">
        <GlossableText text="升级" />!
      </h2>
      <p className="text-xl mb-4">
        <GlossableText text="等级" /> {state.level}
      </p>
      <p className="text-sm text-white/70 mb-2">
        HP {state.maxHp} · ATK {state.attack}
      </p>
      {newly.map((sk) => (
        <div
          key={sk.id}
          className="px-4 py-2 rounded-xl mb-2 font-bold"
          style={{ background: sk.color }}
        >
          <GlossableText text="解锁" />: <GlossableText text={sk.name} />
        </div>
      ))}
      <button type="button" className="btn-primary w-full max-w-xs mt-6" onClick={dismissLevelUp}>
        <GlossableText text="继续" />
      </button>
    </div>
  );
}
