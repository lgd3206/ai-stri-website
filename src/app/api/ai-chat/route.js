// app/api/ai-chat/route.js - 增强版模拟模式（修复版）
import { NextResponse } from 'next/server';


// 安全生产知识库
const safetyKnowledge = [
  {
    id: 1,
    category: "安全生产法",
    keywords: ["安全生产法", "法律", "法规", "主体责任", "安全责任制"],
    content: `《安全生产法》是我国安全生产领域的基本法律，于2002年首次发布，2021年进行了最新修订。

**核心内容：**
• 确立了"安全第一、预防为主、综合治理"的安全生产方针
• 明确了生产经营单位的主体责任
• 规定了从业人员的权利义务
• 确定了政府及其部门的监管职责

**主要负责人职责：**
• 建立健全本单位安全生产责任制
• 组织制定本单位安全生产规章制度和操作规程
• 组织制定并实施本单位安全生产教育和培训计划
• 保证本单位安全生产投入的有效实施`
  },
  {
    id: 2,
    category: "风险评估",
    keywords: ["风险评估", "风险识别", "LEC", "风险矩阵", "风险等级"],
    content: `风险评估是安全管理的核心环节，通过系统识别、分析和评价风险，为安全决策提供科学依据。

**风险评估流程：**
1. **风险识别** - 识别作业活动中的危险源
2. **风险分析** - 分析风险发生的可能性和后果严重程度  
3. **风险评价** - 确定风险等级，判断是否可接受
4. **风险控制** - 制定风险控制措施

**常用评估方法：**
• **LEC法**：L(可能性) × E(暴露频率) × C(后果严重性)
• **风险矩阵法**：可能性 × 严重程度
• **HAZOP法**：危险与可操作性分析

**风险等级划分：**
• 极高风险(红色)：立即停止作业，采取紧急措施
• 高风险(橙色)：需要制定详细控制措施
• 中等风险(黄色)：需要关注并制定控制措施
• 低风险(绿色)：可接受，但需定期复查`
  },
  {
    id: 3,
    category: "应急管理",
    keywords: ["应急预案", "应急演练", "应急响应", "事故处置"],
    content: `应急管理是指对突发安全事故的预防、准备、响应和恢复的全过程管理。

**应急预案体系：**
• **综合应急预案** - 企业总体应急策略和程序
• **专项应急预案** - 针对特定风险的专门预案
• **现场处置方案** - 具体作业场所的应急处置

**应急演练要求：**
• **频次**：综合演练每年至少1次，专项演练每半年至少1次
• **类型**：桌面演练、功能演练、全面演练
• **评估**：演练效果评估，及时修订预案`
  },
  {
    id: 4,
    category: "隐患排查",
    keywords: ["隐患排查", "安全检查", "隐患治理", "双重预防"],
    content: `隐患排查治理是预防事故的重要手段，通过系统排查和及时治理，消除安全隐患。

**隐患排查制度：**
• **日常排查** - 岗位员工班前班中班后检查
• **定期排查** - 专业人员周检查、月检查
• **专项排查** - 针对特定时期、特定风险的检查
• **综合排查** - 全面系统的安全大检查

**双重预防机制：**
• **风险分级管控** - 超前防范，从源头预防
• **隐患排查治理** - 精准治理，有效化解风险`
  },
  {
    id: 5,
    category: "安全培训",
    keywords: ["安全培训", "安全教育", "三级教育", "特种作业"],
    content: `安全培训教育是提高从业人员安全素质，防范事故发生的重要手段。

**三级安全教育：**
• **厂级教育** - 安全法规、企业安全制度、基本安全知识(不少于24学时)
• **车间级教育** - 车间安全制度、作业环境、危险因素(不少于16学时)  
• **班组级教育** - 岗位操作规程、安全技能、个体防护(不少于8学时)

**特种作业人员要求：**
• **范围**：电工、焊工、高处作业、危险化学品等
• **证书**：必须持证上岗，定期复审
• **培训**：初训不少于140学时，复训不少于20学时
• **考核**：理论考试+实际操作，80分以上合格`
  },
  {
    id: 6,
    category: "重大危险源",
    keywords: ["重大危险源", "危险源辨识", "监控", "临界量"],
    content: `重大危险源是指长期或临时生产、搬运、使用或贮存危险物品，且危险物品的数量等于或超过临界量的单元。

**重大危险源辨识：**
• **判定标准**：危险物品数量≥临界量
• **计算方法**：∑(q₁/Q₁ + q₂/Q₂ + ... + qₙ/Qₙ) ≥ 1

**分级标准：**
• **一级**：R≥100(极高危险)
• **二级**：100>R≥50(高度危险)  
• **三级**：50>R≥10(中度危险)
• **四级**：R<10(一般危险)

**安全管理要求：**
1. **建立管理制度** - 安全管理制度、操作规程
2. **配备安全设施** - 监测、报警、联锁、紧急切断等
3. **制定应急预案** - 专项应急预案和现场处置方案`
  }
];

// 智能匹配算法
function findBestMatch(question) {
  let bestMatches = [];
  
  for (const knowledge of safetyKnowledge) {
    let score = 0;
    const questionLower = question.toLowerCase();
    
    // 关键词匹配
    for (const keyword of knowledge.keywords) {
      if (questionLower.includes(keyword)) {
        score += 10;
      }
    }
    
    // 分类匹配
    if (questionLower.includes(knowledge.category)) {
      score += 5;
    }
    
    if (score > 0) {
      bestMatches.push({ 
        knowledge, 
        score,
        matchInfo: `匹配分数: ${score.toFixed(1)}, 类别: ${knowledge.category}`
      });
    }
  }
  
  bestMatches.sort((a, b) => b.score - a.score);
  return bestMatches.slice(0, 2);
}

// 生成回答
function generateAnswer(question, matches) {
  if (matches.length === 0) {
    return {
      answer: `抱歉，我暂时无法找到关于"${question}"的相关信息。

我目前的知识库涵盖以下6个安全生产领域：
• 安全生产法律法规
• 风险评估与管控  
• 应急管理
• 隐患排查治理
• 安全教育培训
• 重大危险源管理

建议您重新描述问题，或者选择上述领域中的具体问题咨询。`,
      relatedTopics: ["安全生产法", "风险评估", "应急管理"],
      matchScore: 0
    };
  }
  
  const bestMatch = matches[0];
  const knowledge = bestMatch.knowledge;
  
  let answer = `关于"${question}"的专业回答：\n\n`;
  answer += knowledge.content;
  answer += `\n\n📋 **相关要点提醒：**\n`;
  answer += `• 所属领域：${knowledge.category}\n`;
  answer += `• 匹配度：${bestMatch.score.toFixed(1)}分\n`;
  
  if (matches.length > 1) {
    answer += `• 相关领域：${matches[1].knowledge.category}\n`;
  }
  
  answer += `\n💡 **实施建议：**\n`;
  answer += `• 结合企业实际情况制定具体措施\n`;
  answer += `• 定期检查和更新相关制度\n`;
  answer += `• 加强培训，提高员工认知水平\n`;
  answer += `\n（当前为增强演示模式，基于专业安全生产知识库）`;
  
  return {
    answer,
    relatedTopics: [knowledge.category, ...(matches.length > 1 ? [matches[1].knowledge.category] : [])],
    matchScore: bestMatch.score
  };
}

// 处理POST请求
// 处理POST请求
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

   if (true) {
      // 增强演示模式
      const matches = findBestMatch(question);
      console.log(`找到 ${matches.length} 个匹配项:`, matches.map(m => m.matchInfo));

      // 模拟思考时间
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

      const result = generateAnswer(question, matches);
      
      console.log(`生成增强回答，长度: ${result.answer.length}, 匹配分数: ${result.matchScore}`);

      return NextResponse.json({
        success: true,
        answer: result.answer,
        relatedTopics: result.relatedTopics,
        timestamp: new Date().toISOString(),
        tokensUsed: Math.floor(result.answer.length / 4),
        mode: "enhanced_demo",
        matchScore: result.matchScore
      });
    } else {
      // 真实API模式（当需要时使用）
      return NextResponse.json({
        success: false,
        error: '真实AI模式暂时不可用，请使用演示模式'
      }, { status: 503 });
    }

  } catch (error) {
    console.error('AI Chat API错误:', error);
    return NextResponse.json({
      success: false,
      error: '抱歉，AI助手暂时无法回答，请稍后再试'
    }, { status: 500 });
  }
}

// 处理GET请求
export async function GET() {
  return NextResponse.json({
    message: "AI聊天API - 增强演示模式",
    features: [
      "智能关键词匹配",
      "6大安全领域知识库", 
      "详细专业回答",
      "相关主题推荐",
      "匹配度评分"
    ],
    knowledgeAreas: safetyKnowledge.map(k => ({
      category: k.category,
      keywordCount: k.keywords.length
    })),
    mode: "enhanced_demo",
    version: "2.0"
  });
}
