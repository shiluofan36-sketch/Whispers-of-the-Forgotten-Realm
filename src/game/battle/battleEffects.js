/**
 * 护盾回合衰减（每回合结束时调用）
 */
export function tickShieldTurns(state) {
  const { player } = state;
  if (player.shieldTurns > 0) {
    player.shieldTurns -= 1;
    if (player.shieldTurns === 0) {
      state.battleLog.push('护盾效果已消失');
    }
  }
}

/**
 * 消耗防御卷轴层数（受到伤害后调用）
 */
export function consumeDefenseBuff(player) {
  if (player.defenseBuff > 0) {
    player.defenseBuff -= 1;
  }
}

/**
 * 消耗攻击卷轴（攻击后调用，返回额外伤害值）
 */
export function consumeAttackBuff(player) {
  if (player.attackBuff > 0) {
    const bonus = player.attackBuff;
    player.attackBuff = 0;
    return bonus;
  }
  return 0;
}

/**
 * 清除所有战斗buff（战斗结束时调用）
 */
export function clearBuffs(state) {
  state.player.isDefending = false;
  state.player.shieldTurns = 0;
  state.player.attackBuff = 0;
  state.player.defenseBuff = 0;
  // Phase 10: 清除状态异常 + 小兵
  state.statusEffects = [];
  state.bossMinions = [];
  if (state.monster) {
    state.monster.statusEffects = [];
  }
}
