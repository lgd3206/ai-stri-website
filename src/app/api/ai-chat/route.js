// 基于智谱AI的用户分级系统 - route.js
// src/app/api/ai-chat/route.js

import { NextResponse } from 'next/server';

// 智谱AI配置
const ZHIPU_CONFIG = {
  apiKey: process.env.ZHIPU_API_KEY,
  baseURL: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  model: 'glm-4',
  maxTokens: 8000,
  temperature: 0.3
};

// 用户分级配置
const USER_TIERS = {
  free: {
    name: '免费用户',
    dailyLimit: 5,           // 每日5次免费问答
    monthlyLimit: 50,        // 每月50次
    maxTokens: 1000,         // 单次回答限制1000 tokens
    features: ['基础安全咨询', '技术参数查询'],
    price: 0
  },
  basic: {
    name: '基础版',
    dailyLimit: 20,          // 每日20次问答
    monthlyLimit: 300,       // 每月300次
    maxTokens: 2000,         // 单次回答限制2000 tokens
    features: ['深度安全分析', '专业建议', '优先响应'],
    price: 19.9             // 19.9元/月
  },
  pro: {
    name: '专业版', 
    dailyLimit: 100,         // 每日100次问答
    monthlyLimit: 1500,      // 每月1500次
    maxTokens: 4000,         // 单次回答限制4000 tokens
    features: ['无限安全咨询', '复杂问题分析', '专家级回答', 'API接口'],
    price: 99              // 99元/月
  },
  enterprise: {
    name: '企业版',
    dailyLimit: -1,          // 无限制
    monthlyLimit: -1,        // 无限制
    maxTokens: 8000,         // 最大tokens
    features: ['企业定制', '专属客服', '批量处理', '数据导出'],
    price: 499             // 499元/月
  }
};

// 内存存储用户使用记录（生产环境建议使用Redis或数据库）
const userUsageStore = new Map();
const userAuthStore = new Map();

// 生成简单的用户标识
function generateUserToken(userId, tier = 'free', expireTime = null) {
  const userData = {
    userId,
    tier,
    expireTime: expireTime || (Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后过期
    createdAt: Date.now()
  };
  
  // 简化的token：base64编码的用户数据
  const token = btoa(JSON.stringify(userData));
  userAuthStore.set(token, userData);
  
  return token;
}

// 验证用户token和获取用户信息
function validateUserToken(token) {
  if (!token) return { userId: 'anonymous', tier: 'free' };
  
  try {
    const userData = userAuthStore.get(token);
    if (!userData) {
      // 尝试解析token
      const decoded = JSON.parse(atob(token));
      if (decoded.expireTime && decoded.expireTime > Date.now()) {
        return decoded;
      }
      return { userId: 'anonymous', tier: 'free' };
    }
    
    // 检查是否过期
    if (userData.expireTime && userData.expireTime < Date.now()) {
      userAuthStore.delete(token);
      return { userId: 'anonymous', tier: 'free' };
    }
    
    return userData;
  } catch (error) {
    console.error('Token验证失败:', error);
    return { userId: 'anonymous', tier: 'free' };
  }
}

// 获取用户今日使用次数
function getUserTodayUsage(userId) {
  const today = new Date().toDateString();
  const usageKey = `${userId}-${today}`;
  return userUsageStore.get(usageKey) || 0;
}

// 获取用户本月使用次数
function getUserMonthlyUsage(userId) {
  const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const usageKey = `${userId}-${thisMonth}`;
  return userUsageStore.get(usageKey) || 0;
}

// 增加用户使用次数
function incrementUserUsage(userId) {
  const today = new Date().toDateString();
  const thisMonth = new Date().toISOString().slice(0, 7);
  
  const dailyKey = `${userId}-${today}`;
  const monthlyKey = `${userId}-${thisMonth}`;
  
  userUsageStore.set(dailyKey, (userUsageStore.get(dailyKey) || 0) + 1);
  userUsageStore.set(monthlyKey, (userUsageStore.get(monthlyKey) || 0) + 1);
}

// 检查用户是否超出使用限制
function checkUsageLimit(userId, userTier) {
  const tierConfig = USER_TIERS[userTier];
  if (!tierConfig) return false;
  
  const todayUsage = getUserTodayUsage(userId);
  const monthlyUsage = getUserMonthlyUsage(userId);
  
  // 检查日限制
  if (tierConfig.dailyLimit !== -1 && todayUsage >= tierConfig.dailyLimit) {
    return { 
      allowed: false, 
      reason: 'daily_limit',
      message: `您今日的${tierConfig.dailyLimit}次免费问答已用完`,
      suggestion: '升级到付费版本获得更多问答次数'
    };
  }
  
  // 检查月限制
  if (tierConfig.monthlyLimit !== -1 && monthlyUsage >= tierConfig.monthlyLimit) {
    return { 
      allowed: false, 
      reason: 'monthly_limit',
      message: `您本月的${tierConfig.monthlyLimit}次问答已用完`,
      suggestion: '升级到更高版本获得更多问答次数'
    };
  }
  
  return { 
    allowed: true,
    remaining: {
      daily: tierConfig.dailyLimit === -1 ? '无限制' : tierConfig.dailyLimit - todayUsage,
      monthly: tierConfig.monthlyLimit === -1 ? '无限制' : tierConfig.monthlyLimit - monthlyUsage
    }
  };
}

// 安全生产专业提示词
function generateSafetyPrompt(question, userTier) {
  const tierConfig = USER_TIERS[userTier];
  const maxTokens = tierConfig.maxTokens;
  
  let promptSuffix = '';
  if (userTier === 'free') {
    promptSuffix = `\n\n回答要求：由于是免费版本，请控制回答长度在${maxTokens}字符以内，重点突出关键信息。`;
  } else if (userTier === 'pro' || userTier === 'enterprise') {
    promptSuffix = `\n\n回答要求：作为专业版用户，请提供详细、深入的专业分析，包含具体的实施建议和注意事项。`;
  }

  return `你是一位资深的安全生产专家，具有20年的安全管理和技术经验。请基于中国安全生产法律法规和国际先进标准，为用户提供专业、准确、实用的安全生产指导。

核心原则：
1. 答案必须准确、专业，基于现行有效的法规标准
2. 技术参数必须引用具体的国家标准或行业规范  
3. 提供具体可操作的建议和措施
4. 如涉及生命安全，请特别强调风险和注意事项

用户问题：${question}${promptSuffix}`;
}

// 调用智谱AI
async function callZhipuAI(question, userTier) {
  if (!ZHIPU_CONFIG.apiKey) {
    throw new Error('智谱AI API密钥未配置');
  }

  const tierConfig = USER_TIERS[userTier];
  const prompt = generateSafetyPrompt(question, userTier);

  try {
    console.log(`智谱AI调用 - 用户等级: ${userTier}, 问题: ${question.substring(0, 50)}...`);

    const response = await fetch(ZHIPU_CONFIG.baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZHIPU_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: ZHIPU_CONFIG.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: tierConfig.maxTokens,
        temperature: ZHIPU_CONFIG.temperature
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`智谱AI API调用失败: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const tokensUsed = data.usage?.total_tokens || 0;

    console.log(`智谱AI调用成功: tokens=${tokensUsed}, 长度=${content.length}`);

    // 根据用户等级添加不同的后缀
    let suffix = '\n\n*（智谱AI专业回答）*';
    if (userTier === 'free') {
      suffix = '\n\n*（智谱AI基础版回答，升级获得更详细解答）*';
    } else if (userTier === 'pro' || userTier === 'enterprise') {
      suffix = '\n\n*（智谱AI专业版深度分析）*';
    }

    return {
      success: true,
      answer: content + suffix,
      tokensUsed,
      model: 'zhipu-glm4'
    };

  } catch (error) {
    console.error('智谱AI调用失败:', error);
    throw error;
  }
}

// 主要API处理函数
export async function POST(request) {
  try {
    const { question, userToken, action } = await request.json();

    // 处理用户注册/登录
    if (action === 'register' || action === 'login') {
      const userId = request.body?.userId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const tier = request.body?.tier || 'free';
      
      const token = generateUserToken(userId, tier);
      
      return NextResponse.json({
        success: true,
        action: action,
        userToken: token,
        userInfo: {
          userId,
          tier,
          tierConfig: USER_TIERS[tier]
        }
      });
    }

    // 处理问答请求
    if (!question || question.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: '问题不能为空，请输入您的安全生产相关问题'
      }, { status: 400 });
    }

    // 验证用户身份
    const userInfo = validateUserToken(userToken);
    const { userId, tier: userTier } = userInfo;

    console.log(`收到问答请求 - 用户: ${userId}, 等级: ${userTier}, 问题: ${question}`);

    // 检查使用限制
    const usageCheck = checkUsageLimit(userId, userTier);
    if (!usageCheck.allowed) {
      return NextResponse.json({
        success: false,
        error: usageCheck.message,
        suggestion: usageCheck.suggestion,
        reason: usageCheck.reason,
        upgradeInfo: {
          available: true,
          tiers: USER_TIERS
        }
      }, { status: 429 });
    }

    // 调用智谱AI
    const aiResponse = await callZhipuAI(question, userTier);
    
    // 增加用户使用次数
    incrementUserUsage(userId);

    // 构建响应
    const response = {
      success: true,
      answer: aiResponse.answer,
      userInfo: {
        tier: userTier,
        tierName: USER_TIERS[userTier].name,
        remaining: usageCheck.remaining
      },
      apiInfo: {
        model: aiResponse.model,
        tokensUsed: aiResponse.tokensUsed,
        timestamp: new Date().toISOString()
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('AI Chat API错误:', error);
    
    return NextResponse.json({
      success: false,
      error: '抱歉，AI助手暂时无法回答，请稍后再试',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// GET请求 - 返回用户信息和配置
export async function GET(request) {
  const url = new URL(request.url);
  const userToken = url.searchParams.get('token');
  const action = url.searchParams.get('action');

  // 获取用户信息
  if (action === 'user-info') {
    const userInfo = validateUserToken(userToken);
    const usageCheck = checkUsageLimit(userInfo.userId, userInfo.tier);
    
    return NextResponse.json({
      userInfo: {
        ...userInfo,
        tierConfig: USER_TIERS[userInfo.tier],
        usage: {
          today: getUserTodayUsage(userInfo.userId),
          thisMonth: getUserMonthlyUsage(userInfo.userId),
          remaining: usageCheck.remaining
        }
      }
    });
  }

  // 返回系统配置信息
  return NextResponse.json({
    message: '安全生产AI助手 - 智谱AI驱动',
    version: '2.0',
    aiModel: 'zhipu-glm4',
    userTiers: Object.entries(USER_TIERS).map(([key, config]) => ({
      id: key,
      name: config.name,
      price: config.price,
      features: config.features,
      limits: {
        daily: config.dailyLimit,
        monthly: config.monthlyLimit
      }
    })),
    features: [
      '智谱AI专业回答',
      '用户分级管理',
      '使用量统计',
      '成本优化控制'
    ]
  });
}
