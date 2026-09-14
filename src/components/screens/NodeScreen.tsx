"use client";

import { getNode, getQuest } from "@/lib/data";
import { useGame } from "@/hooks/useGame";
import GlossableText from "../GlossableText";
import Hud from "../Hud";
import { DioramaBackground, Knight } from "../LowPolyArt";
import {
  getAvailableAtNode,
  getTurnInAtNode,
  objectiveProgressLabel,
} from "@/lib/gameLogic";

export default function NodeScreen() {
  const {
    state,
    go,
    talkToNpc,
    startCombatHere,
    startTrial,
    gather,
    rest,
    turnInQuest,
    acceptQuestAt,
  } = useGame();
  if (!state) return null;
  const node = getNode(state.currentNode);
  if (!node) return null;

  const available = getAvailableAtNode(state, node.id);
  const turnIns = getTurnInAtNode(state, node.id);
  const activeHere = state.quests.filter((qp) => {
    if (qp.status !== "active" && qp.status !== "ready") return false;
    const q = getQuest(qp.questId);
    return q?.giverNode === node.id || q?.turnInNode === node.id;
  });

  return (
    <div className="relative flex flex-col h-full min-h-[100dvh]">
      <DioramaBackground />
      <div className="relative z-10 flex flex-col flex-1">
        <Hud />
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <Knight className="w-12 h-16 shrink-0" />
            <div>
              <h2 className="text-xl font-black text-[#1a252f]">
                <GlossableText text={node.name} />
              </h2>
              <p className="text-sm text-[#2c3e50]">
                <GlossableText text={node.description} />
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {available.map((qp) => {
              const q = getQuest(qp.questId)!;
              return (
                <div
                  key={qp.questId}
                  className="card border-l-4 border-[#f1c40f]"
                >
                  <div className="font-bold text-[#1a252f]">
                    <GlossableText text="新任务" />:{" "}
                    <GlossableText text={q.title} />
                  </div>
                  <p className="text-sm text-[#2c3e50] mt-1">
                    <GlossableText text={q.description} />
                  </p>
                  <button
                    type="button"
                    className="btn-primary w-full mt-2"
                    onClick={() =>
                      node.npc
                        ? talkToNpc(node.npc)
                        : acceptQuestAt(qp.questId)
                    }
                  >
                    <GlossableText text="接受" />
                  </button>
                </div>
              );
            })}

            {turnIns.map((qp) => {
              const q = getQuest(qp.questId)!;
              return (
                <div
                  key={qp.questId}
                  className="card border-l-4 border-[#2ecc71]"
                >
                  <div className="font-bold text-[#1a252f]">
                    <GlossableText text="交还" />:{" "}
                    <GlossableText text={q.title} />
                  </div>
                  <button
                    type="button"
                    className="btn-primary w-full mt-2 bg-[#27ae60]"
                    onClick={() => turnInQuest(qp.questId)}
                  >
                    <GlossableText text="交还" /> <GlossableText text="任务" />
                  </button>
                </div>
              );
            })}

            {activeHere.map((qp) => {
              if (turnIns.some((t) => t.questId === qp.questId)) return null;
              if (available.some((t) => t.questId === qp.questId)) return null;
              const q = getQuest(qp.questId)!;
              return (
                <div key={qp.questId} className="card">
                  <div className="font-bold text-sm">
                    <GlossableText text={q.title} />
                  </div>
                  {q.objectives.map((_, idx) => (
                    <div key={idx} className="text-xs text-[#2c3e50] mt-1">
                      <GlossableText
                        text={objectiveProgressLabel(state, qp.questId, idx)}
                      />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 p-3 bg-[#1a252f]/95 space-y-2">
          {node.npc && (
            <button
              type="button"
              className="btn-primary w-full"
              onClick={() => talkToNpc(node.npc!)}
            >
              <GlossableText text="对话" />: <GlossableText text={node.npc} />
            </button>
          )}
          {node.type === "combat" && (
            <button
              type="button"
              className="btn-danger w-full"
              onClick={startCombatHere}
            >
              <GlossableText text="战斗" />!
            </button>
          )}
          {node.type === "trial" && (
            <button
              type="button"
              className="btn-danger w-full"
              onClick={startTrial}
            >
              <GlossableText text="识字试炼" />
            </button>
          )}
          {node.type === "gather" && (
            <button type="button" className="btn-secondary w-full" onClick={gather}>
              <GlossableText text="收集" /> <GlossableText text="药草" />
            </button>
          )}
          {node.type === "rest" && (
            <button type="button" className="btn-secondary w-full" onClick={rest}>
              <GlossableText text="休息" /> — HP{" "}
              {state.maxHp}/{state.maxHp}
            </button>
          )}
          <button
            type="button"
            className="w-full py-3 rounded-xl bg-[#34495e] text-white font-bold"
            onClick={() => go("map")}
          >
            <GlossableText text="返回" /> <GlossableText text="地图" />
          </button>
        </div>
      </div>
    </div>
  );
}
