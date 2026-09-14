import { getEnemy, getSkill } from "./data";
import type { CombatEnemy, CombatState, InventoryItem, Skill } from "./types";

let _id = 0;
function uid() {
  return `e${++_id}_${Date.now()}`;
}

export function startCombat(
  enemyIds: string[],
  playerHp: number,
  playerMaxHp: number,
  opts?: { isTrial?: boolean; maxPeeks?: number }
): CombatState {
  const enemies: CombatEnemy[] = enemyIds.map((id) => {
    const e = getEnemy(id)!;
    return {
      id: e.id,
      instanceId: uid(),
      name: e.name,
      hp: e.hp,
      maxHp: e.hp,
      attack: e.attack,
      xp: e.xp,
      gold: e.gold,
      loot: e.loot,
      color: e.color,
      shape: e.shape,
    };
  });
  return {
    enemies,
    playerHp,
    playerMaxHp,
    blocking: false,
    log: ["战斗开始！"],
    selectedTarget: enemies[0]?.instanceId ?? null,
    phase: "player",
    peeksUsed: 0,
    maxPeeks: opts?.maxPeeks ?? null,
    isTrial: opts?.isTrial ?? false,
    noPeekBonus: true,
    loot: [],
    goldGained: 0,
    xpGained: 0,
    literacyGained: 0,
  };
}

export function applyPlayerSkill(
  combat: CombatState,
  skill: Skill,
  playerAttack: number
): CombatState {
  if (combat.phase !== "player") return combat;
  const next = { ...combat, log: [...combat.log], enemies: combat.enemies.map((e) => ({ ...e })) };
  next.blocking = false;

  if (skill.type === "attack") {
    const target = next.enemies.find((e) => e.instanceId === next.selectedTarget && e.hp > 0);
    if (!target) {
      next.log.push("请选择目标！");
      return next;
    }
    const dmg = skill.power + Math.floor(playerAttack / 2);
    target.hp = Math.max(0, target.hp - dmg);
    next.log.push(`你使用${skill.name}，造成 ${dmg} 伤害！`);
  } else if (skill.type === "defend") {
    next.blocking = true;
    next.log.push(`你使用${skill.name}，准备格挡！`);
  } else if (skill.type === "heal") {
    const heal = skill.power;
    next.playerHp = Math.min(next.playerMaxHp, next.playerHp + heal);
    next.log.push(`你使用${skill.name}，恢复 ${heal} 生命！`);
  }

  // check victory
  if (next.enemies.every((e) => e.hp <= 0)) {
    return resolveVictory(next);
  }

  next.phase = "enemy";
  return next;
}

export function runEnemyTurn(combat: CombatState): CombatState {
  if (combat.phase !== "enemy") return combat;
  const next = { ...combat, log: [...combat.log], enemies: combat.enemies.map((e) => ({ ...e })) };
  let hp = next.playerHp;

  for (const e of next.enemies) {
    if (e.hp <= 0) continue;
    let dmg = e.attack;
    if (next.blocking) dmg = Math.floor(dmg / 2);
    hp = Math.max(0, hp - dmg);
    next.log.push(`${e.name}攻击，造成 ${dmg} 伤害！`);
  }

  next.playerHp = hp;
  next.blocking = false;

  if (hp <= 0) {
    next.phase = "defeat";
    next.log.push("你战败了…");
    return next;
  }

  next.phase = "player";
  // auto-select next living target
  if (!next.enemies.find((e) => e.instanceId === next.selectedTarget && e.hp > 0)) {
    next.selectedTarget = next.enemies.find((e) => e.hp > 0)?.instanceId ?? null;
  }
  return next;
}

function resolveVictory(combat: CombatState): CombatState {
  const next = { ...combat, log: [...combat.log] };
  next.phase = "victory";
  next.log.push("胜利！");

  let gold = 0;
  let xp = 0;
  const loot: InventoryItem[] = [];

  for (const e of next.enemies) {
    gold += e.gold;
    xp += e.xp;
    for (const drop of e.loot) {
      // deterministic: chance based on id hash + always drop if chance >= 0.5 for MVP feel
      if (drop.chance >= 0.5 || (drop.id.length + e.id.length) % 3 !== 0) {
        const existing = loot.find((l) => l.id === drop.id);
        if (existing) existing.qty += 1;
        else loot.push({ id: drop.id, name: drop.name, qty: 1 });
      }
    }
  }

  let literacy = Math.floor(xp / 3);
  if (next.noPeekBonus) {
    literacy = Math.floor(literacy * 1.5);
    gold = Math.floor(gold * 1.2);
    next.log.push("无偷看加成！更好的奖励！");
  }
  if (next.isTrial) {
    literacy += 40;
    next.log.push("识字试炼完成！");
  }

  next.goldGained = gold;
  next.xpGained = xp;
  next.literacyGained = literacy;
  next.loot = loot;
  return next;
}

export function recordPeek(combat: CombatState): CombatState {
  const next = { ...combat };
  next.peeksUsed += 1;
  next.noPeekBonus = false;
  return next;
}

export function canPeek(combat: CombatState): boolean {
  if (combat.maxPeeks === null) return true;
  return combat.peeksUsed < combat.maxPeeks;
}

export { getSkill };
