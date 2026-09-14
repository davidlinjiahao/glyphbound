"use client";

import { GameProvider, useGame } from "@/hooks/useGame";
import TitleScreen from "./screens/TitleScreen";
import CreateScreen from "./screens/CreateScreen";
import MapScreen from "./screens/MapScreen";
import NodeScreen from "./screens/NodeScreen";
import CombatScreen from "./screens/CombatScreen";
import DialogueScreen from "./screens/DialogueScreen";
import LootScreen from "./screens/LootScreen";
import QuestsScreen from "./screens/QuestsScreen";
import InventoryScreen from "./screens/InventoryScreen";
import LevelUpScreen from "./screens/LevelUpScreen";

function Router() {
  const { state, ready } = useGame();
  if (!ready || !state) {
    return (
      <div className="flex items-center justify-center h-[100dvh] bg-[#1a252f] text-white">
        字境…
      </div>
    );
  }

  switch (state.screen) {
    case "title":
      return <TitleScreen />;
    case "create":
      return <CreateScreen />;
    case "map":
      return <MapScreen />;
    case "node":
      return <NodeScreen />;
    case "combat":
      return <CombatScreen />;
    case "dialogue":
      return <DialogueScreen />;
    case "loot":
      return <LootScreen />;
    case "quests":
      return <QuestsScreen />;
    case "inventory":
      return <InventoryScreen />;
    case "levelup":
      return <LevelUpScreen />;
    default:
      return <TitleScreen />;
  }
}

export default function GameShell() {
  return (
    <GameProvider>
      <div className="game-frame">
        <Router />
      </div>
    </GameProvider>
  );
}
