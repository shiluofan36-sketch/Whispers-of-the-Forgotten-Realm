import { CAMP_NPCS } from './npcData.js';
import { getUnseenLore, markLoreSeen } from '../lore/loreManager.js';
import { hasWorldFlag } from '../world/worldFlags.js';

export function getNpcInfo(npcId) {
  return CAMP_NPCS[npcId.toUpperCase()] || null;
}

function getWorldFlagDialogue(npcId, state) {
  const hunter = CAMP_NPCS.HUNTER;
  const scholar = CAMP_NPCS.SCHOLAR;
  const blacksmith = CAMP_NPCS.BLACKSMITH;

  if (npcId === 'hunter') {
    if (hasWorldFlag(state, 'dragonSlain')) return '"你真的干掉了远古巨龙？！我以前见过的小队连它的巢穴都没找到..."';
    if (hasWorldFlag(state, 'demonSlain')) return '"恶魔领主倒下之后，我感觉到整个地牢的气氛都变了。"';
    if (hasWorldFlag(state, 'necromancerSlain')) return '"你不怕死吗？亡灵法师可是最难缠的..."';
  }
  if (npcId === 'scholar') {
    if (hasWorldFlag(state, 'fireElementalSlain')) return '"元素神殿被净化了...地牢的力量正在消退。你做到了前人未能完成的事。"';
    if (hasWorldFlag(state, 'shadowSlain')) return '"暗影领主是虚空中诞生的，你的胜利证明光明终将驱散黑暗。"';
    if (hasWorldFlag(state, 'ancientGateOpened')) return '"你触碰了那尊雕像...你知道那是什么吗？远古传送门的一部分！"';
  }
  if (npcId === 'blacksmith') {
    if (hasWorldFlag(state, 'dragonSlain')) return '"龙鳞甲！如果还有鳞片残留，我可以给你锻造更好的装备。"';
  }
  return null;
}

export function talkToNpc(state, npcId, topicIndex) {
  const npc = getNpcInfo(npcId);
  if (!npc) return { error: 'NPC not found' };

  if (topicIndex === -1 || topicIndex == null) {
    let dialogue = npc.greeting;

    // Check worldFlags for special dialogue
    const flagDialogue = getWorldFlagDialogue(npcId, state);
    if (flagDialogue) {
      dialogue += `\n\n${flagDialogue}`;
    }

    const lore = getUnseenLore(state, npc.loreCategory);
    if (lore) {
      dialogue += `\n\n"${lore.text}"`;
      markLoreSeen(state, lore.id);
    }
    return { dialogue, npcName: npc.name };
  }

  const topic = npc.topics[topicIndex];
  if (!topic) return { error: 'Topic not found' };

  let dialogue = topic.response;

  // World flag variation for topic
  const flagDialogue = getWorldFlagDialogue(npcId, state);
  if (flagDialogue) {
    dialogue += `\n\n${flagDialogue}`;
  }

  if (topic.lore) {
    const lore = getUnseenLore(state, npc.loreCategory);
    if (lore) {
      dialogue += `\n\n她/他顿了顿，补充道："${lore.text}"`;
      markLoreSeen(state, lore.id);
    }
  }

  return { dialogue, npcName: npc.name };
}

export function generateCampNpcs(state) {
  if (!state.npcs || state.npcs.length === 0) {
    state.npcs = ['blacksmith', 'merchant', 'hunter', 'scholar'];
  }
}
