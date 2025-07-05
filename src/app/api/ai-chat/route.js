// src/app/api/ai-chat/route.js - 智谱AI集成版本（语法修复）
import { NextResponse } from 'next/server';

// 配置
const AI_MODE = process.env.AI_MODE || 'hybrid'; // hybrid | local | zhipu
const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;
const USE_CACHE = true; // 启用缓存降低成本
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时缓存

// 简单内存缓存（生产环境建议使用Redis）
const responseCache = new Map();

// 安全生产知识库（保留用于混合模式）
const safetyKnowledge = [
  {
    id: 1,
    category: "安全生产法律法规",
    keywords: [
      "安全生产法", "法律", "法规", "主体责任", "安全责任制", "法律责任",
      "安全管理制度", "制度建立", "制度建设", "规章制度", "管理制度", "制度体系", "操作规程",
      "安全标准化", "管理体系", "责任体系", "考核制度", "奖惩制度",
      "监督检查", "执法检查", "行政处罚", "停产整顿", "关闭取缔",
      "从业人员权利", "知情权", "建议权", "举报权", "拒绝权", "紧急避险权"
    ],
    content: `《安全生产法》是我国安全生产领域的基本法律，确立了"安全第一、预防为主、综合治理"的安全生产方针。

**主要内容：**
• **主体责任**：生产经营单位是安全生产责任主体
• **安全责任制**：建立健全全员安全生产责任制
• **安全投入**：保证安全生产所必需的资金投入
• **制度建设**：制定安全生产规章制度和操作规程
• **教育培训**：对从业人员进行安全生产教育培训
• **监督管理**：接受安全生产监督检查`,
    complexity: 3
  },
  {
    id: 2,
    category: "风险评估与管控", 
    keywords: [
      "风险评估", "风险识别", "危险源", "风险分析", "危险因素", "有害因素",
      "风险管控", "风险控制", "管控措施", "控制措施", "防控措施",
      "LEC法", "风险矩阵", "定性评估", "定量评估", "危险性评价",
      "作业条件危险性评价", "工作危害分析", "JHA", "JSA",
      "风险分级", "分级管控", "红橙黄蓝", "四色风险", "风险清单"
    ],
    content: `风险评估是安全生产管理的核心环节，通过系统性识别、分析和评价风险，制定相应的管控措施。

**风险评估流程：**
• **风险识别**：识别作业活动中可能导致人员伤亡的危险因素
• **风险分析**：分析风险发生的可能性和严重程度  
• **风险评价**：确定风险等级，判断风险是否可接受
• **风险控制**：制定并实施风险管控措施

**常用评估方法：**
• **LEC法**：L(可能性) × E(暴露频率) × C(后果严重度)
• **风险矩阵法**：可能性与严重程度二维矩阵评价
• **工作危害分析(JHA)**：将作业分解为步骤，逐步识别危险`,
    complexity: 4
  },
  {
    id: 3,
    category: "应急管理与预案",
    keywords: [
      "应急预案", "应急管理", "应急响应", "应急处置", "应急救援",
      "综合应急预案", "专项应急预案", "现场处置方案",
      "应急组织", "应急指挥", "应急队伍", "救援队伍", "指挥体系",
      "应急演练", "演练计划", "演练方案", "演练评估", "演练总结",
      "应急物资", "应急设备", "应急通讯", "应急避险", "疏散撤离"
    ],
    content: `应急管理是企业安全生产的重要保障，确保在事故发生时能够迅速、有效地开展应急救援。

**应急预案体系：**
• **综合应急预案**：企业总体应急组织机构、职责、程序
• **专项应急预案**：针对特定类型事故的专门预案
• **现场处置方案**：具体岗位、具体部位的现场应急处置措施

**应急演练要求：**
• 综合应急预案：每年至少1次
• 专项应急预案：每半年至少1次  
• 现场处置方案：每季度至少1次`,
    complexity: 4
  }
];

// 更精准的智能路由：决定使用本地知识库还是智谱AI
function getResponseStrategy(question) {
  const questionLower = question.toLowerCase();
  
  // 强制使用智谱AI的关键词
  const zhipuKeywords = [
    '详细分析', '请详细', '具体分析', '深入分析', '全面分析',
    '如何建立', '如何实施', '如何构建', '实施步骤', '具体步骤',
    '对比分析', '比较分析', '优缺点', '差异', '区别',
    '最佳实践', '案例分析', '实际应用', '操作指导',
    '体系建设', '管理体系', '制度体系', '组织架构',
    '完整的', '系统的', '全面的', '综合的'
  ];
  
  // 检查是否包含强制使用智谱AI的关键词
  const hasZhipuKeywords = zhipuKeywords.some(keyword => questionLower.includes(keyword));
  
  console.log(`强制智谱AI关键词检查: ${hasZhipuKeywords}`);
  
  // 分析问题复杂度 - 更敏感的算法
  const complexity = analyzeQuestionComplexity(question);
  
  // 检查本地知识库匹配度
  const localMatches = findLocalMatches(question);
  const bestLocalScore = localMatches.length > 0 ? localMatches[0].score : 0;
  
  console.log(`问题: "${question}"`);
  console.log(`复杂度: ${complexity}, 本地最佳匹配: ${bestLocalScore}, 强制智谱: ${hasZhipuKeywords}`);
  
  // 路由决策逻辑 - 更倾向于使用智谱AI
  if (AI_MODE === 'local') {
    console.log('强制本地模式');
    return 'local';
  } else if (AI_MODE === 'zhipu') {
    console.log('强制智谱模式');
    return 'zhipu';
  } else { // hybrid模式
    // 1. 包含强制关键词 → 必须使用智谱AI
    if (hasZhipuKeywords) {
      console.log('检测到复杂关键词，使用智谱AI');
      return 'zhipu';
    }
    
    // 2. 高复杂度问题 → 使用智谱AI
    if (complexity >= 4) {
      console.log('高复杂度问题，使用智谱AI');
      return 'zhipu';
    }
    
    // 3. 中等复杂度且本地匹配不佳 → 使用智谱AI
    if (complexity >= 3 && bestLocalScore < 15) {
      console.log('中等复杂度且本地匹配不佳，使用智谱AI');
      return 'zhipu';
    }
    
    // 4. 问题较长 → 使用智谱AI
    if (question.length > 30) {
      console.log('问题较长，使用智谱AI');
      return 'zhipu';
    }
    
    // 5. 其他情况 → 使用本地知识库
    console.log('使用本地知识库');
    return 'local';
  }
}

// 更敏感的问题复杂度分析 (1-5级)
function analyzeQuestionComplexity(question) {
  let complexity = 1;
  
  // 基础长度因子
  if (question.length > 15) complexity += 1;
  if (question.length > 30) complexity += 1;
  if (question.length > 50) complexity += 1;
  
  // 高价值关键词 - 直接加高分
  const highValueKeywords = [
    '详细', '具体', '全面', '完整', '系统', '深入',
    '分析', '建立', '实施', '构建', '制定',
    '体系', '架构', '流程', '步骤', '方案',
    '如何', '怎么', '怎样', '措施', '方法'
  ];
  
  let keywordCount = 0;
  highValueKeywords.forEach(keyword => {
    if (question.includes(keyword)) {
      keywordCount++;
    }
  });
  
  complexity += keywordCount; // 每个关键词+1分
  
  // 复杂句式识别
  const complexPatterns = [
    '如何建立', '如何实施', '如何构建', '如何制定',
    '请详细', '具体分析', '深入分析', '全面分析',
    '包括', '涉及', '步骤', '流程', '体系',
    '对比', '比较', '区别', '差异', '优缺点'
  ];
  
  complexPatterns.forEach(pattern => {
    if (question.includes(pattern)) {
      complexity += 2; // 复杂句式+2分
    }
  });
  
  // 多概念组合
  const concepts = question.split(/[，、；和与及]/).length;
  if (concepts > 2) complexity += 1;
  if (concepts > 3) complexity += 1;
  
  // 问号数量（多个问题）
  const questionMarks = (question.match(/[？?]/g) || []).length;
  if (questionMarks > 1) complexity += 1;
  
  console.log(`复杂度计算: 长度因子+基础分, 关键词数量: ${keywordCount}, 最终复杂度: ${Math.min(complexity, 5)}`);
  
  return Math.min(complexity, 5);
}

// 本地知识库匹配
function findLocalMatches(question) {
  let allMatches = [];
  const questionLower = question.toLowerCase();
  
  safetyKnowledge.forEach(knowledge => {
    let matchScore = 0;
    let matchedKeywords = [];
    
    // 关键词匹配
    knowledge.keywords.forEach(keyword => {
      if (questionLower.includes(keyword)) {
        matchScore += keyword.length * 2;
        matchedKeywords.push(keyword);
      }
    });
    
    if (matchScore > 0) {
      allMatches.push({
        knowledge,
        score: matchScore,
        matchedKeywords
      });
    }
  });
  
  return allMatches.sort((a, b) => b.score - a.score);
}

// 智谱AI调用增强版 - 添加更多错误处理
async function callZhipuAI(question) {
  if (!ZHIPU_API_KEY) {
    console.error('智谱AI密钥未配置');
    throw new Error('智谱AI密钥未配置');
  }
  
  // 针对安全管理体系问题的专门提示词
  const isManagementSystemQuestion = question.includes('管理体系') || 
                                   question.includes('组织架构') || 
                                   question.includes('制度建设');
  
  let systemPrompt = `你是一位资深的安全生产专家，具有20年以上的企业安全管理经验。请基于以下要求回答用户问题：

1. 回答要准确、专业、实用，具有很强的可操作性
2. 内容要结构化，合理使用**粗体**、• 列表、数字编号等格式
3. 涉及法规时要引用具体条文和标准
4. 提供具体的实施建议、操作指导和时间安排
5. 回答长度控制在800-1200字，确保信息量充足
6. 语言要专业但通俗易懂，适合企业管理者阅读
7. 如涉及体系建设，要从组织、制度、流程、考核等多维度分析`;

  if (isManagementSystemQuestion) {
    systemPrompt += `

特别注意：当前问题涉及安全管理体系建设，请重点关注：
- 组织架构设计的层级和职责分工
- 制度体系的完整性和系统性  
- 实施步骤的先后顺序和关键节点
- 各环节的质量控制和效果评估
- 与相关法规标准的对应关系`;
  }
  
  try {
    console.log('开始调用智谱AI...', { 
      question: question.substring(0, 50) + '...',
      isManagementSystem: isManagementSystemQuestion 
    });
    
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ZHIPU_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "glm-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        temperature: 0.2, // 降低随机性，提高专业性
        max_tokens: 1500,  // 增加token限制
        top_p: 0.8
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('智谱AI HTTP错误:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`智谱AI调用失败: HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('智谱AI返回数据格式错误:', data);
      throw new Error('智谱AI返回数据格式错误');
    }
    
    console.log('智谱AI调用成功:', {
      tokensUsed: data.usage?.total_tokens || 0,
      answerLength: data.choices[0].message.content.length
    });
    
    return {
      answer: data.choices[0].message.content,
      tokensUsed: data.usage?.total_tokens || 0,
      model: 'glm-4'
    };
    
  } catch (error) {
    console.error('智谱AI调用完整错误信息:', {
      message: error.message,
      stack: error.stack,
      apiKey: ZHIPU_API_KEY ? 'configured' : 'missing'
    });
    throw error;
  }
}

// 本地知识库回答生成
function generateLocalAnswer(question, matches) {
  if (matches.length === 0) {
    return generateFallbackAnswer(question);
  }
  
  const bestMatch = matches[0];
  const knowledge = bestMatch.knowledge;
  
  let answer = `关于"${question}"的专业回答：\n\n`;
  answer += knowledge.content;
  
  answer += "\n\n**相关建议：**\n";
  answer += "• 结合企业实际情况制定具体措施\n";
  answer += "• 定期检查和更新相关制度\n";
  answer += "• 加强培训，提高员工认知水平\n";
  
  answer += `\n\n- 所属领域：${knowledge.category}`;
  answer += `\n- 匹配度：${bestMatch.score.toFixed(1)}分`;
  answer += `\n（本地知识库回答）`;
  
  return {
    answer,
    relatedTopics: [knowledge.category],
    matchScore: bestMatch.score,
    source: 'local'
  };
}

// 兜底回答
function generateFallbackAnswer(question) {
  let answer = `感谢您的提问："${question}"。\n\n`;
  answer += `基于安全生产最佳实践，我建议您：\n\n`;
  answer += `**基本原则：**\n`;
  answer += `• 遵循"安全第一、预防为主、综合治理"方针\n`;
  answer += `• 建立健全安全生产责任制\n`;
  answer += `• 定期开展安全检查和隐患排查\n`;
  answer += `• 加强安全教育培训\n\n`;
  
  answer += `**推荐咨询领域：**\n`;
  answer += `• 安全生产法律法规\n`;
  answer += `• 风险评估与管控\n`;
  answer += `• 应急管理与预案\n`;
  
  answer += `\n（智能兜底回答）`;
  
  return {
    answer,
    relatedTopics: ["安全生产管理"],
    matchScore: 1.0,
    source: 'fallback'
  };
}

// 缓存管理
function getCacheKey(question) {
  return `ai_chat_${Buffer.from(question).toString('base64')}`;
}

function getFromCache(question) {
  if (!USE_CACHE) return null;
  
  const cacheKey = getCacheKey(question);
  const cached = responseCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('返回缓存结果');
    return cached.data;
  }
  
  return null;
}

function setCache(question, data) {
  if (!USE_CACHE) return;
  
  const cacheKey = getCacheKey(question);
  responseCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  // 清理过期缓存
  if (responseCache.size > 1000) {
    const now = Date.now();
    for (const [key, value] of responseCache.entries()) {
      if (now - value.timestamp > CACHE_DURATION) {
        responseCache.delete(key);
      }
    }
  }
}

// 主处理函数
export async function POST(request) {
  try {
    const { question } = await request.json();
    
    if (!question || question.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: '问题不能为空，请输入您的安全生产相关问题'
      }, { status: 400 });
    }
    
    console.log('收到问题:', question);
    
    // 检查缓存
    const cachedResponse = getFromCache(question);
    if (cachedResponse) {
      return NextResponse.json({
        ...cachedResponse,
        fromCache: true
      });
    }
    
    // 决定使用哪种策略
    const strategy = getResponseStrategy(question);
    console.log('选择策略:', strategy);
    
    let result;
    
    if (strategy === 'local') {
      // 使用本地知识库
      const matches = findLocalMatches(question);
      result = generateLocalAnswer(question, matches);
      
    } else if (strategy === 'zhipu') {
      // 使用智谱AI
      try {
        const zhipuResult = await callZhipuAI(question);
        result = {
          answer: zhipuResult.answer + '\n\n（智谱AI专业回答）',
          relatedTopics: ['AI智能分析'],
          tokensUsed: zhipuResult.tokensUsed,
          source: 'zhipu',
          model: zhipuResult.model
        };
      } catch (error) {
        console.error('智谱AI调用失败，降级到本地模式:', error);
        const matches = findLocalMatches(question);
        result = generateLocalAnswer(question, matches);
        result.source = 'local_fallback';
      }
    }
    
    // 构建响应
    const response = {
      success: true,
      answer: result.answer,
      relatedTopics: result.relatedTopics,
      timestamp: new Date().toISOString(),
      tokensUsed: result.tokensUsed || Math.floor(result.answer.length / 4),
      mode: AI_MODE,
      strategy: strategy,
      source: result.source,
      matchScore: result.matchScore
    };
    
    // 缓存结果
    setCache(question, response);
    
    console.log(`回答生成完成, 策略: ${strategy}, 来源: ${result.source}, 长度: ${result.answer.length}`);
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('AI Chat API错误:', error);
    return NextResponse.json({
      success: false,
      error: '抱歉，AI助手暂时无法回答，请稍后再试'
    }, { status: 500 });
  }
}

// GET请求 - API信息
export async function GET() {
  return NextResponse.json({
    message: "AI聊天API - 智谱AI混合模式",
    features: [
      "智谱AI大模型集成",
      "智能路由策略", 
      "本地知识库备份",
      "自动缓存机制",
      "成本控制优化",
      "错误降级处理"
    ],
    config: {
      mode: AI_MODE,
      cacheEnabled: USE_CACHE,
      zhipuConfigured: !!ZHIPU_API_KEY
    },
    knowledgeAreas: safetyKnowledge.map(item => ({
      category: item.category,
      keywordCount: item.keywords.length,
      complexity: item.complexity
    })),
    version: "2.0-zhipu"
  });
}
