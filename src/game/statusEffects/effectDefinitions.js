/**
 * 状态异常定义（纯配置）
 *
 * type: 效果类型
 * label: 显示名
 * damagePerTurn: 每回合伤害
 * actionPenalty: 行动概率惩罚（0~1）
 * color: UI显示颜色
 */

export const STATUS_EFFECTS = {
  burn: {
    type: 'burn',
    label: '灼烧',
    damagePerTurn: 5,
    actionPenalty: 0,
    color: '#ff8800',
  },
  poison: {
    type: 'poison',
    label: '中毒',
    damagePerTurn: 3,
    actionPenalty: 0,
    color: '#88ff44',
  },
  freeze: {
    type: 'freeze',
    label: '冻结',
    damagePerTurn: 0,
    actionPenalty: 0.5,  // 50%概率无法行动
    color: '#44ccff',
  },
  bleed: {
    type: 'bleed',
    label: '流血',
    damagePerTurn: 0,
    actionPenalty: 0,
    color: '#cc4444',
    // 流血在行动后触发
    damageOnAction: 4,
  },
};

/**
 * 获取状态效果配置
 */
export function getEffectConfig(type) {
  return STATUS_EFFECTS[type] || null;
}
