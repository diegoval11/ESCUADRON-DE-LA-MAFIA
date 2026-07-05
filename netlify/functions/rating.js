function calculateUserRating(skillLevel, points, level) {
  const base = skillLevel === 'intermedio' ? 280 : skillLevel === 'avanzado' ? 480 : 80;
  return Math.min(1000, Math.max(1, base + (points * 0.3) + (level * 15)));
}

function selectWithTopicDiversity(pool, count, topicKey = 'topic') {
  const selected = [];
  const usedTopics = {};

  for (const item of pool) {
    if (selected.length >= count) break;
    const topic = item[topicKey] || 'general';
    if (usedTopics[topic] && selected.length < count - 1 && pool.length > count) continue;
    selected.push(item);
    usedTopics[topic] = true;
  }

  if (selected.length < count) {
    const pickedIds = new Set(selected.map(s => s.id));
    for (const item of pool) {
      if (selected.length >= count) break;
      if (pickedIds.has(item.id)) continue;
      selected.push(item);
      pickedIds.add(item.id);
    }
  }

  return selected;
}

function pickByDifficultyWindow(bank, count, userRating, excludeIds, acceptItem) {
  const expansions = [0, 50, 100, 200, 400];

  for (const expand of expansions) {
    const min = Math.max(1, userRating - 60 - expand);
    const max = Math.min(1000, userRating + 100 + expand);
    let pool = bank.filter(item => {
      if (!item.id || !item.difficulty) return false;
      if (item.difficulty < min || item.difficulty > max) return false;
      if (excludeIds.includes(item.id)) return false;
      if (!acceptItem(item)) return false;
      return true;
    });

    pool = pool.sort(() => Math.random() - 0.5);
    const selected = selectWithTopicDiversity(pool, count);
    if (selected.length >= count) return selected.slice(0, count);
  }

  let fallback = bank.filter(item => {
    if (!item.id || !item.difficulty) return false;
    if (excludeIds.includes(item.id)) return false;
    return acceptItem(item);
  });
  fallback = fallback.sort(() => Math.random() - 0.5);
  return fallback.slice(0, count);
}

module.exports = { calculateUserRating, selectWithTopicDiversity, pickByDifficultyWindow };
