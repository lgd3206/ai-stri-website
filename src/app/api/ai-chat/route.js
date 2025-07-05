// 安全生产AI助手 - 三层模型架构
// src/app/api/ai-chat/route.js

import { NextResponse } from 'next/server';

// 配置 - 多AI模型支持
const AI_CONFIG = {
  zhipu: {
    apiKey: process.env.ZHIPU_API_KEY,
    baseURL: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    model: 'glm-4',
    costPer1kTokens: 0.005, // 约0.5分/1k tokens
    maxTokens: 8000,
    suitable: ['general', 'technical', 'management']
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4',
    costPer1kTokens: 0.03, // 约3分/1k tokens
    maxTokens: 8000,
    suitable: ['complex', 'analysis', 'creative']
  },
  claude: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseURL: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-sonnet-20240229',
    costPer1kTokens: 0.015, // 约1.5分/1k tokens  
    maxTokens: 8000,
    suitable: ['analysis', 'reasoning', 'professional']
  }
};

// 智能模型选择策略
function selectOptimalModel(question, userLevel = 'free') {
  const analysis = analyzeQuestion(question);
  
  // 用户级别限制
  const userLimits = {
    free: ['zhipu'], // 免费用户只能用智谱AI
    premium: ['zhipu', 'claude'], // 付费用户可用智谱AI和Claude
    enterprise: ['zhipu', 'claude', 'openai'] // 企业用户可用所有模型
  };
  
  const availableModels = userLimits[userLevel] || ['zhipu'];
  
  // 策略1：超高复杂度 → 顶级模型
  if (analysis.complexity >= 9 && availableModels.includes('openai')) {
    return {
      model: 'openai',
      reason: '超高复杂度问题，使用GPT-4获得最佳效果',
      estimatedCost: analysis.estimatedTokens * AI_CONFIG.openai.costPer1kTokens / 1000
    };
  }
  
  // 策略2：高复杂度分析问题 → Claude  
  if (analysis.complexity >= 7 && 
      (analysis.needsReasoning || analysis.needsAnalysis) && 
      availableModels.includes('claude')) {
    return {
      model: 'claude',
      reason: '复杂分析问题，Claude推理能力更强',
      estimatedCost: analysis.estimatedTokens * AI_CONFIG.claude.costPer1kTokens / 1000
    };
  }
  
  // 策略3：默认使用智谱AI（性价比最高）
  return {
    model: 'zhipu',
    reason: '智谱AI处理中文安全生产问题效果最佳',
    estimatedCost: analysis.estimatedTokens * AI_CONFIG.zhipu.costPer1kTokens / 1000
  };
}

// 问题复杂度和类型分析
function analyzeQuestion(question) {
  const questionLower = question.toLowerCase();
  let complexity = 1;
  let estimatedTokens = 200; // 基础token估算
  
  // 复杂度评分因子
  const complexityFactors = {
    // 长度因子
    length: question.length > 50 ? 2 : (question.length > 20 ? 1 : 0),
    
    // 关键词复杂度
    highComplexity: [
      '详细分析', '深入分析', '系统性分析', '全面评估',
      '对比分析', '可行性研究', '风险评估报告',
      '管理体系设计', '实施方案制定', '应急预案编制',
      '安全评价', '职业病危害评价', '消防设计'
    ].some(keyword => questionLower.includes(keyword)) ? 4 : 0,
    
    mediumComplexity: [
      '如何建立', '如何实施', '怎么做', '具体步骤',
      '注意事项', '技术要求', '操作规程',
      '检查清单', '培训计划', '整改措施'
    ].some(keyword => questionLower.includes(keyword)) ? 2 : 0,
    
    technicalTerms: [
      '临界量', '爆炸极限', '防爆等级', '耐火等级',
      '毒性参数', '理化性质', '安全距离',
      'hazop', 'lopa', 'qra', 'pha'
    ].some(keyword => questionLower.includes(keyword)) ? 2 : 0,
    
    // 多主题复合
    multiTopic: (questionLower.match(/[，。；,;]/g) || []).length > 2 ? 2 : 0,
    
    // 需要推理分析
    needsReasoning: [
      '为什么', '原因', '影响因素', '依据',
      '优缺点', '比较', '选择', '建议'
    ].some(keyword => questionLower.includes(keyword)) ? 2 : 0
  };
  
  // 计算总复杂度
  complexity = Object.values(complexityFactors).reduce((sum, factor) => sum + factor, 1);
  complexity = Math.min(complexity, 10); // 限制最大值
  
  // Token估算
  estimatedTokens = Math.max(200, question.length * 3 + complexity * 100);
  
  return {
    complexity,
    estimatedTokens,
    needsReasoning: complexityFactors.needsReasoning > 0,
    needsAnalysis: complexityFactors.highComplexity > 0,
    isTechnical: complexityFactors.technicalTerms > 0,
    factors: complexityFactors
  };
}

// 安全生产专业提示词生成
function generateSafetyPrompt(question, modelType) {
  const basePrompt = `你是一位资深的安全生产专家，具有20年的安全管理和技术经验。请基于中国安全生产法律法规和国际先进标准，为用户提供专业、准确、实用的安全生产指导。

核心原则：
1. 答案必须准确、专业，基于现行有效的法规标准
2. 技术参数必须引用具体的国家标准或行业规范
3. 提供具体可操作的建议和措施
4. 如涉及生命安全，请特别强调风险和注意事项

请回答以下问题：${question}

回答要求：
- 结构清晰，要点明确
- 如涉及技术参数，请注明标准依据
- 如涉及法规要求，请注明法规名称和条款
- 提供实用的实施建议`;

  // 不同模型的特殊指令
  const modelSpecificInstructions = {
    zhipu: '\n\n特别提醒：请重点关注中国的法规标准和实践经验，回答长度控制在500-800字。',
    claude: '\n\n特别要求：请进行深入的逻辑分析，考虑各种情况和影响因素，提供系统性的解决方案。',
    openai: '\n\n高级要求：请提供创新性的解决思路，结合国际最佳实践，给出前瞻性的专业建议。'
  };

  return basePrompt + (modelSpecificInstructions[modelType] || '');
}

// 通用AI调用函数
async function callAIModel(modelName, question, userLevel = 'free') {
  const config = AI_CONFIG[modelName];
  if (!config || !config.apiKey) {
    throw new Error(`${modelName} API未配置`);
  }

  const prompt = generateSafetyPrompt(question, modelName);
  
  try {
    let requestBody, headers;
    
    if (modelName === 'claude') {
      // Claude API格式
      headers = {
        'Content-Type': 'application/json',
        'X-API-Key': config.apiKey,
        'anthropic-version': '2023-06-01'
      };
      
      requestBody = {
        model: config.model,
        max_tokens: config.maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      };
    } else {
      // OpenAI/智谱AI格式
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      };
      
      requestBody = {
        model: config.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: config.maxTokens,
        temperature: 0.3
      };
    }

    console.log(`调用${modelName}模型处理问题:`, question.substring(0, 50) + '...');
    
    const response = await fetch(config.baseURL, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${modelName} API调用失败: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    let content, tokensUsed;
    
    if (modelName === 'claude') {
      content = data.content[0].text;
      tokensUsed = data.usage.input_tokens + data.usage.output_tokens;
    } else {
      content = data.choices[0].message.content;
      tokensUsed = data.usage?.total_tokens || 0;
    }

    const actualCost = tokensUsed * config.costPer1kTokens / 1000;
    
    console.log(`${modelName}调用成功:`, {
      tokensUsed,
      cost: actualCost.toFixed(4),
      answerLength: content.length
    });

    return {
      success: true,
      answer: content + `\n\n*（${getModelDisplayName(modelName)}专业回答）*`,
      tokensUsed,
      cost: actualCost,
      model: modelName
    };

  } catch (error) {
    console.error(`${modelName}调用失败:`, error);
    throw error;
  }
}

// 模型显示名称
function getModelDisplayName(modelName) {
  const displayNames = {
    zhipu: '智谱AI',
    openai: 'GPT-4',
    claude: 'Claude'
  };
  return displayNames[modelName] || modelName;
}

// 缓存机制
const responseCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时

function getCachedResponse(question) {
  const cacheKey = question.toLowerCase().trim();
  const cached = responseCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('使用缓存回答');
    return cached.response;
  }
  
  return null;
}

function setCachedResponse(question, response) {
  const cacheKey = question.toLowerCase().trim();
  responseCache.set(cacheKey, {
    response,
    timestamp: Date.now()
  });
  
  // 清理过期缓存
  if (responseCache.size > 1000) {
    const entries = Array.from(responseCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // 删除最旧的20%
    const deleteCount = Math.floor(entries.length * 0.2);
    for (let i = 0; i < deleteCount; i++) {
      responseCache.delete(entries[i][0]);
    }
  }
}

// 主要API处理函数
export async function POST(request) {
  try {
    const { question, userLevel = 'free' } = await request.json();
    
    if (!question || question.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: '问题不能为空，请输入您的安全生产相关问题'
      }, { status: 400 });
    }

    console.log('收到问题:', question);
    console.log('用户级别:', userLevel);

    // 检查缓存
    const cachedResponse = getCachedResponse(question);
    if (cachedResponse) {
      return NextResponse.json({
        ...cachedResponse,
        cached: true
      });
    }

    // 选择最优模型
    const modelSelection = selectOptimalModel(question, userLevel);
    console.log('选择模型:', modelSelection);

    // 调用AI模型
    const aiResponse = await callAIModel(modelSelection.model, question, userLevel);
    
    // 构建响应
    const response = {
      success: true,
      answer: aiResponse.answer,
      model: getModelDisplayName(aiResponse.model),
      modelSelection: modelSelection.reason,
      tokensUsed: aiResponse.tokensUsed,
      cost: aiResponse.cost,
      timestamp: new Date().toISOString(),
      strategy: 'real_ai',
      cached: false
    };

    // 缓存响应
    setCachedResponse(question, response);

    return NextResponse.json(response);

  } catch (error) {
    console.error('AI Chat API错误:', error);
    
    return NextResponse.json({
      success: false,
      error: '抱歉，AI助手暂时无法回答，请稍后再试',
      details: error.message
    }, { status: 500 });
  }
}

// GET请求 - 返回配置信息
export async function GET() {
  const configuredModels = Object.keys(AI_CONFIG).filter(
    model => AI_CONFIG[model].apiKey
  );

  return NextResponse.json({
    message: '安全生产AI助手 - 三层模型架构',
    version: '3.0',
    configuredModels,
    supportedUserLevels: ['free', 'premium', 'enterprise'],
    cacheEnabled: true,
    features: [
      '智能模型选择',
      '成本优化控制', 
      '专业安全提示词',
      '多级用户支持',
      '智能缓存机制'
    ]
  });
}
