/**
 * NDCG (Normalized Discounted Cumulative Gain) Calculator
 * 用于计算两个热榜的NDCG值
 */

/**
 * 计算单个条目的Term值
 * @param {number} rel - 相关性得分
 * @param {number} rank - 排名（从1开始）
 * @returns {number} Term值
 */
function calculateTerm(rel, rank) {
  const gain = Math.pow(2, rel) - 1;
  const discount = Math.log2(rank + 1);
  const term = gain / discount;
  return term;
}

/**
 * 计算折损累计增益(DCG@K)
 * @param {number[]} relevanceScores - 相关性得分列表
 * @param {number} k - 前K个结果
 * @returns {number} DCG值
 */
function dcgAtK(relevanceScores, k) {
  let dcg = 0.0;
  for (let i = 0; i < Math.min(relevanceScores.length, k); i++) {
    const rel = relevanceScores[i];
    const rank = i + 1; // 排名从1开始
    const term = calculateTerm(rel, rank);
    dcg += term;
  }
  return dcg;
}

/**
 * 计算合并后的理想折损累计增益(IDCG@K)
 * @param {number[]} ownScores - 自己热榜得分
 * @param {number[]} targetScores - 对标热榜得分
 * @param {number} k - 前K个结果
 * @returns {Object} { idealScores, idcg }
 */
function idcgCombined(ownScores, targetScores, k) {
  // 将两个数组合并
  const combinedScores = [...ownScores, ...targetScores];
  
  // 按相关性降序排列，取前k个作为理想排序
  const idealScores = combinedScores.sort((a, b) => b - a).slice(0, k);
  
  const idcg = dcgAtK(idealScores, k);
  return { idealScores, idcg };
}

/**
 * 计算两个热榜的NDCG值
 * @param {number[]} ownScores - 自己热榜得分
 * @param {number[]} targetScores - 对标热榜得分
 * @param {number} k - 前K个结果（默认10）
 * @returns {Object} NDCG计算结果
 */
function ndcgForLeaderboard(ownScores, targetScores, k = 10) {
  // 计算合并后的IDCG（共享同一个理想基准）
  const { idealScores, idcg: idcgCombinedValue } = idcgCombined(ownScores, targetScores, k);
  
  // 计算各自热榜的DCG
  const dcgOwn = dcgAtK(ownScores, k);
  const dcgTarget = dcgAtK(targetScores, k);
  
  // 计算NDCG
  if (idcgCombinedValue === 0) {
    return {
      dcgOwn: 0.0,
      dcgTarget: 0.0,
      idealScores: [],
      idcg: 0.0,
      ndcgOwn: 0.0,
      ndcgTarget: 0.0
    };
  }
  
  const ndcgOwn = dcgOwn / idcgCombinedValue;
  const ndcgTarget = dcgTarget / idcgCombinedValue;
  
  // 保留4位小数
  return {
    dcgOwn: Math.round(dcgOwn * 10000) / 10000,
    dcgTarget: Math.round(dcgTarget * 10000) / 10000,
    idealScores,
    idcg: Math.round(idcgCombinedValue * 10000) / 10000,
    ndcgOwn: Math.round(ndcgOwn * 10000) / 10000,
    ndcgTarget: Math.round(ndcgTarget * 10000) / 10000
  };
}

/**
 * 主函数：计算完整的NDCG结果
 * @param {number[]} ownContentScores - Group A的内容评分
 * @param {number[]} ownTimeScores - Group A的时效评分
 * @param {number[]} targetContentScores - Group B的内容评分
 * @param {number[]} targetTimeScores - Group B的时效评分
 * @returns {Object} 完整的NDCG计算结果
 */
export function calculateNDCG(ownContentScores, ownTimeScores, targetContentScores, targetTimeScores) {
  try {
    const contentResult = ndcgForLeaderboard(ownContentScores, targetContentScores, 10);
    const timeResult = ndcgForLeaderboard(ownTimeScores, targetTimeScores, 10);
    
    return {
      ownContentDcg: contentResult.dcgOwn,
      targetContentDcg: contentResult.dcgTarget,
      contentIdcg: contentResult.idcg,
      contentIdealScores: contentResult.idealScores,
      ownContentNdcg: contentResult.ndcgOwn,
      targetContentNdcg: contentResult.ndcgTarget,
      
      ownTimeDcg: timeResult.dcgOwn,
      targetTimeDcg: timeResult.dcgTarget,
      timeIdcg: timeResult.idcg,
      timeIdealScores: timeResult.idealScores,
      ownTimeNdcg: timeResult.ndcgOwn,
      targetTimeNdcg: timeResult.ndcgTarget,
      
      msg: ""
    };
  } catch (e) {
    return {
      ownContentDcg: 0,
      targetContentDcg: 0,
      contentIdcg: 0,
      contentIdealScores: [],
      ownContentNdcg: 0,
      targetContentNdcg: 0,
      
      ownTimeDcg: 0,
      targetTimeDcg: 0,
      timeIdcg: 0,
      timeIdealScores: [],
      ownTimeNdcg: 0,
      targetTimeNdcg: 0,
      
      msg: e.message
    };
  }
}
