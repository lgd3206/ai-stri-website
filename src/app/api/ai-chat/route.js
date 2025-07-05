// src/app/api/ai-chat/route.js - 完整修复版
import { NextResponse } from 'next/server';

// 安全生产知识库
// 大幅优化的安全生产知识库
const safetyKnowledge = [
  {
    id: 1,
    category: "安全生产法",
    keywords: [
      // 法律法规相关
      "安全生产法", "法律", "法规", "主体责任", "安全责任制", "法律责任",
      // 制度建设相关  
      "安全管理制度", "制度建立", "制度建设", "规章制度", "管理制度", "制度体系",
      "操作规程", "作业规程", "安全规程", "管理规程", "制度完善", "制度健全",
      // 责任体系相关
      "责任制", "责任体系", "主要负责人", "安全责任", "责任落实", "责任分工",
      "组织架构", "管理体系", "安全组织", "管理架构"
    ],
    content: `《安全生产法》是我国安全生产领域的基本法律，为安全管理制度建立提供了法律依据。

**安全管理制度建立步骤：**

**1. 建立安全生产责任制**
• 明确主要负责人安全职责
• 制定各级管理人员安全责任
• 确定各岗位安全职责
• 建立责任考核机制

**2. 制定安全管理制度**
• 安全生产投入管理制度
• 安全教育培训制度  
• 安全检查和隐患排查制度
• 劳动防护用品管理制度
• 安全设施设备管理制度

**3. 编制操作规程**
• 各工种安全操作规程
• 设备安全操作规程
• 特殊作业安全规程
• 应急处置操作规程

**4. 建立管理档案**
• 制度发布和培训记录
• 制度执行检查记录
• 制度修订完善记录

**制度建设要点：**
• 结合企业实际情况
• 符合法律法规要求
• 操作性强，便于执行
• 定期评估和完善`
  },
  {
    id: 2,
    category: "风险评估",
    keywords: [
      // 风险评估相关
      "风险评估", "风险识别", "风险分析", "风险评价", "风险管理",
      // 风险控制相关
      "风险控制", "风险管控", "管控措施", "控制措施", "风险防控", "风险预防",
      "风险管控措施", "管控方法", "控制方法", "防控手段", "防范措施",
      // 评估方法相关
      "LEC", "风险矩阵", "风险等级", "HAZOP", "FMEA", "评估方法",
      "风险级别", "风险分级", "危险等级", "风险程度"
    ],
    content: `风险评估是安全管理的核心环节，风险管控措施是确保安全的关键。

**风险管控措施体系：**

**1. 工程技术措施（优先级最高）**
• 本质安全设计 - 从源头消除危险
• 安全防护装置 - 安全阀、防爆装置等
• 隔离防护措施 - 隔离墙、防护栏等
• 自动控制系统 - 自动监测、报警、联锁

**2. 管理控制措施**
• 安全管理制度建立和执行
• 安全操作规程制定和培训
• 安全检查和隐患排查
• 作业许可和审批制度
• 应急预案制定和演练

**3. 培训教育措施**
• 安全意识教育提升
• 技能培训和资格认证
• 应急处置能力培训
• 安全文化建设

**4. 个体防护措施（最后防线）**
• 个人防护装备配备
• 防护用品正确使用
• 定期检查和更换

**风险管控原则：**
• 预防为主，源头治理
• 分级管控，重点突出
• 动态调整，持续改进
• 全员参与，责任到人

**管控效果评估：**
• 定期评估管控措施有效性
• 根据评估结果调整措施
• 建立管控措施档案记录`
  },
  {
    id: 3,
    category: "应急管理",
    keywords: [
      "应急预案", "应急演练", "应急响应", "事故处置", "应急救援", "应急管理",
      "应急准备", "应急处理", "事故应急", "紧急响应", "救援预案", "处置方案",
      "应急体系", "应急机制", "应急程序", "应急流程", "应急指挥", "应急组织"
    ],
    content: `应急管理是对突发安全事故的预防、准备、响应和恢复的全过程管理。

**应急预案体系：**
• **综合应急预案** - 企业总体应急策略和程序
• **专项应急预案** - 针对特定风险的专门预案
• **现场处置方案** - 具体作业场所的应急处置

**应急预案要素：**
1. **应急组织机构** - 指挥部、各工作组职责
2. **预警机制** - 监测、预警、信息报告
3. **应急响应程序** - 分级响应、处置流程
4. **应急保障** - 人员、装备、资金、技术保障
5. **后期处置** - 善后处理、事故调查、恢复重建

**应急演练要求：**
• **频次**：综合演练每年至少1次，专项演练每半年至少1次
• **类型**：桌面演练、功能演练、全面演练
• **评估**：演练效果评估，及时修订预案

**应急响应级别：**
• Ⅰ级(特别重大)：死亡30人以上或直接损失1亿元以上
• Ⅱ级(重大)：死亡10-29人或直接损失5000万-1亿元
• Ⅲ级(较大)：死亡3-9人或直接损失1000万-5000万元
• Ⅳ级(一般)：死亡1-2人或直接损失1000万元以下`
  },
  {
    id: 4,
    category: "隐患排查",
    keywords: [
      "隐患排查", "安全检查", "隐患治理", "双重预防", "隐患分级",
      "排查制度", "检查制度", "隐患整改", "安全巡查", "现场检查",
      "隐患管理", "排查要点", "检查要点", "隐患识别", "问题排查"
    ],
    content: `隐患排查治理是预防事故的重要手段，通过系统排查和及时治理，消除安全隐患。

**隐患排查制度：**
• **日常排查** - 岗位员工班前班中班后检查
• **定期排查** - 专业人员周检查、月检查
• **专项排查** - 针对特定时期、特定风险的检查
• **综合排查** - 全面系统的安全大检查

**隐患分级标准：**
• **重大隐患** - 可能导致重大事故，需立即停产治理
• **一般隐患** - 可能导致一般事故，需限期治理

**排查治理流程：**
1. **排查发现** - 建立排查清单，全面系统排查
2. **登记建档** - 隐患信息记录、分类分级
3. **治理整改** - 制定方案，落实措施，消除隐患
4. **验收销号** - 治理完成后验收，确认消除
5. **信息报送** - 按规定报送隐患信息

**双重预防机制：**
• **风险分级管控** - 超前防范，从源头预防
• **隐患排查治理** - 精准治理，有效化解风险

**检查要点：**
• 人的不安全行为：违章作业、不当操作
• 物的不安全状态：设备缺陷、防护失效
• 环境不安全因素：作业环境、气象条件
• 管理缺陷：制度不完善、培训不到位`
  },
  {
    id: 5,
    category: "安全培训",
    keywords: [
      "安全培训", "安全教育", "三级教育", "特种作业", "安全意识",
      "培训制度", "教育制度", "培训计划", "教育计划", "培训管理",
      "岗前培训", "在岗培训", "转岗培训", "安全学习", "技能培训"
    ],
    content: `安全培训教育是提高从业人员安全素质，防范事故发生的重要手段。

**三级安全教育：**
• **厂级教育** - 安全法规、企业安全制度、基本安全知识(不少于24学时)
• **车间级教育** - 车间安全制度、作业环境、危险因素(不少于16学时)  
• **班组级教育** - 岗位操作规程、安全技能、个体防护(不少于8学时)

**特种作业人员要求：**
• **范围**：电工、焊工、高处作业、危险化学品等
• **证书**：必须持证上岗，定期复审
• **培训**：初训不少于140学时，复训不少于20学时
• **考核**：理论考试+实际操作，80分以上合格

**主要负责人和安全管理人员：**
• **初次培训**：不少于32学时
• **继续教育**：每年不少于12学时
• **内容**：安全法规、管理知识、应急处置等

**一般从业人员：**
• **初次培训**：不少于20学时
• **继续教育**：每年不少于8学时
• **换岗培训**：不少于20学时

**培训档案管理：**
• 培训计划、教材、课件
• 参训人员名册、成绩记录
• 培训证书、合格证明
• 培训效果评估记录

**新工艺、新技术、新设备培训：**
• 采用新工艺前必须进行专门培训
• 培训内容包括技术要求、操作要点、安全注意事项
• 经考核合格后方可上岗操作`
  },
  {
    id: 6,
    category: "重大危险源",
    keywords: [
      "重大危险源", "危险源辨识", "重大危险源监控", "临界量", "危险化学品",
      "危险源识别", "危险源管理", "重大危险源管理", "危险源评估", "危险源分级"
    ],
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
3. **制定应急预案** - 专项应急预案和现场处置方案
4. **定期检测评估** - 每三年进行一次安全评价
5. **备案登记** - 向安监部门备案，获得登记证明

**监控措施：**
• **实时监控** - 温度、压力、液位、浓度等关键参数
• **报警系统** - 超限自动报警，及时预警
• **视频监控** - 重点部位全天候监控
• **巡回检查** - 定期人工巡检，记录异常情况

**常见危险物品临界量：**
• 汽油：5000吨
• 柴油：5000吨  
• 液氨：10吨
• 液氯：5吨
• 丙烷：50吨
• 氢气：5吨

**应急处置要点：**
• 迅速切断泄漏源，控制泄漏扩散
• 立即启动应急预案，疏散相关人员
• 及时报告应急管理部门
• 采取有效措施，防止事故扩大`
  }
];
// 智能匹配算法
function findBestMatch(question) {
  let bestMatches = [];
  const questionLower = question.toLowerCase();
  
  for (const knowledge of safetyKnowledge) {
    let score = 0;
    
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
    
    // 模糊匹配
    const questionChars = questionLower.split('');
    for (const char of questionChars) {
      if (char.length > 0) {
        for (const keyword of knowledge.keywords) {
          if (keyword.includes(char)) {
            score += 0.5;
          }
        }
      }
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
  const questionLower = question.toLowerCase();
  
  // 如果有匹配项，返回最佳匹配
  if (matches.length > 0 && matches[0].score >= 2) {
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
  
  // 智能兜底回答
  let smartAnswer = `感谢您的提问："${question}"。\n\n`;
  
  if (questionLower.includes('如何') || questionLower.includes('怎么') || questionLower.includes('怎样')) {
    smartAnswer += `我理解您想了解具体的操作方法。基于安全生产最佳实践，我建议您：\n\n`;
    smartAnswer += `**基本原则：**\n`;
    smartAnswer += `• 遵循"安全第一、预防为主、综合治理"方针\n`;
    smartAnswer += `• 建立健全安全生产责任制\n`;
    smartAnswer += `• 定期开展安全检查和隐患排查\n`;
    smartAnswer += `• 加强安全教育培训\n\n`;
  } else if (questionLower.includes('是什么') || questionLower.includes('什么是')) {
    smartAnswer += `这是一个很好的基础概念问题。在安全生产领域：\n\n`;
    smartAnswer += `**核心要点：**\n`;
    smartAnswer += `• 安全生产是保护人民生命财产安全的重要工作\n`;
    smartAnswer += `• 需要遵循相关法律法规和标准规范\n`;
    smartAnswer += `• 企业承担安全生产主体责任\n`;
    smartAnswer += `• 持续改进和风险管控是关键\n\n`;
  } else {
    smartAnswer += `基于安全生产专业知识，为您提供相关指导：\n\n`;
    smartAnswer += `**通用安全原则：**\n`;
    smartAnswer += `• 预防为主，防患于未然\n`;
    smartAnswer += `• 全员参与，共同维护安全\n`;
    smartAnswer += `• 持续改进，不断提升安全水平\n`;
    smartAnswer += `• 依法合规，严格执行标准\n\n`;
  }
  
  smartAnswer += `**我的专业知识库涵盖：**\n`;
  smartAnswer += `• 安全生产法律法规  • 风险评估与管控\n• 应急管理  • 隐患排查治理\n• 安全教育培训  • 重大危险源管理\n\n`;
  
  smartAnswer += `💡 **建议：** 您可以尝试询问上述具体领域的相关内容，我将为您提供更准确的专业指导。`;
  smartAnswer += `\n\n（当前为增强演示模式，持续学习优化中）`;
  
  return {
    answer: smartAnswer,
    relatedTopics: ["安全生产法", "风险评估", "应急管理", "安全培训"],
    matchScore: 1
  };
}

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

    // 智能匹配和回答
    const matches = findBestMatch(question);
    console.log(`找到 ${matches.length} 个匹配项:`, matches.map(m => m.matchInfo));

    // 模拟思考时间
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const result = generateAnswer(question, matches);
    
    console.log(`生成回答，长度: ${result.answer.length}, 匹配分数: ${result.matchScore}`);

    return NextResponse.json({
      success: true,
      answer: result.answer,
      relatedTopics: result.relatedTopics,
      timestamp: new Date().toISOString(),
      tokensUsed: Math.floor(result.answer.length / 4),
      mode: "enhanced_demo",
      matchScore: result.matchScore
    });

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
