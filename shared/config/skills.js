// 技能定义（唯一配置源：shared/config/skills.js）
export const SKILLS = {
  HEAVY_STRIKE: { name: '重击',      mp: 5,  multiplier: 1.8,            key: 'q', cooldown: 0 },
  SHIELD:       { name: '护盾',      mp: 8,  turns: 2,                    key: 'e', cooldown: 0 },
  DRAIN:        { name: '吸血',      mp: 10, drainRate: 0.5,              key: 'r', cooldown: 0 },
  POISON_STRIKE:{ name: '毒击',      mp: 12, multiplier: 1.2, status: 'poison', statusDuration: 3, key: 't', cooldown: 3 },
  ICE_BARRIER:  { name: '冰霜屏障',  mp: 15, shieldTurns: 2, status: 'freeze', statusReflect: true, key: 'f', cooldown: 4 },
};
