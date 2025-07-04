// src/app/api/ai-chat/route.js
import { NextResponse } from 'next/server';

// 临时模拟模式，解决网络超时问题
const MOCK_MODE = true; // 改为false时使用真实OpenAI API

// Safety knowledge base
const safetyKnowledge = [
  {
    id: 1,
    category: "安全生产法",
    keywords: ["安全生产法", "法律", "法规", "主体责任"],
    content: "《安全生产法》是我国安全生产领域的基本法律，确立了'安全第一、预防为主、综合治理'的方针，明确了生产经营单位的主体责任。"
  },
  {
    id: 2,
    category: "风险评估",
    keywords: ["风险评估", "风险分析", "危险源", "评价"],
    content: "风险评估包括危险源识别、风险分析、风险评价和制定控制措施四个步骤。常用方法有LEC法、LS法、风险矩阵法等。"
  },
  {
    id: 3,
    category: "应急管理",
    keywords: ["应急预案", "应急响应", "事故处理", "演练"],
    content: "应急预案应包括组织机构、预警预报、应急响应、处置措施、后期处置等内容，并定期组织演练和修订。"
  },
  {
    id: 4,
    category: "隐患排查",
    keywords: ["隐患排查", "安全检查", "整改", "治理"],
    content: "隐患排查治理要建立分级管控体系，做到责任、措施、资金、时限、预案'五到位'，形成闭环管理。"
  },
  {
    id: 5,
    category: "安全培训",
    keywords: ["安全培训", "安全教育", "培训考核", "持证上岗"],
    content: "企业应建立安全培训制度，对从业人员进行岗前培训、在岗培训和转岗培训，特种作业人员必须持证上岗。"
  }
];

// 模拟回答库
const mockAnswers = {
  "安全生产法": "《安全生产法》是我国安全生产领域的基本法律，于2002年首次发布，2021年进行了最新修订。该法确立了'安全第一、预防为主、综合治理'的安全生产方针，明确了生产经营单位的主体责任、从业人员的权利义务、政府及其部门的监管职责等核心内容。法律规定企业主要负责人对本单位安全生产工作全面负责，必须建立健全安全生产责任制和规章制度。",
  
  "风险评估": "风险评估是安全管理的基础工作，包括四个基本步骤：一是危险源识别，全面识别生产过程中可能导致事故的危险有害因素；二是风险分析，分析危险源可能导致事故的可能性和严重程度；三是风险评价，采用定性或定量方法确定风险等级；四是制定控制措施，针对不同风险等级制定相应的管控措施。常用的评估方法包括LEC法、LS法、风险矩阵法等。",
  
  "应急预案": "应急预案是企业应对突发安全事故的行动指南，应包括以下要素：组织机构与职责分工、预警预报机制、应急响应分级、事故处置措施、人员疏散程序、应急资源保障、信息报告与发布、后期恢复重建等。预案编制完成后必须定期组织演练，根据演练情况和实际变化及时修订完善，确保预案的针对性和可操作性。",
  
  "隐患排查": "隐患排查治理是安全生产的重要环节，要建立分级管控体系。企业应制定隐患排查标准和程序，做到责任、措施、资金、时限、预案'五到位'。排查工作要实现全员参与、全过程覆盖、全方位检查，形成自查自改、自查自报的工作机制。对排查发现的隐患要建立台账，实施闭环管理，确保整改措施落实到位。",
  
  "安全培训": "企业应建立完善的安全培训制度，对不同层级人员开展针对性培训。主要负责人和安全管理人员必须具备相应安全知识和能力，特种作业人员必须持证上岗。新员工必须进行三级安全教育（厂级、车间级、班组级），在岗人员要定期接受安全培训，转岗人员需要重新培训。培训内容应包括安全法规、操作规程、应急处置等。"
};

// 搜索相关知识
function searchRelatedKnowledge(question) {
  const questionLower = question.toLowerCase();
  
  const related = safetyKnowledge.filter(item => {
    const keywordMatch = item.keywords.some(keyword => 
      questionLower.includes(keyword.toLowerCase())
    );
    
    const contentMatch = item.content.toLowerCase().includes(questionLower.slice(0, 5));
    
    return keywordMatch || contentMatch;
  });
  
  return related.slice(0, 3);
}

// 生成模拟回答
function generateMockAnswer(question) {
  const questionLower = question.toLowerCase();
  
  // 根据关键词匹配预设回答
  for (const [keyword, answer] of Object.entries(mockAnswers)) {
    if (questionLower.includes(keyword.toLowerCase())) {
      return answer;
    }
  }
  
  // 通用回答
  return `关于"${question}"这个问题，从安全生产的角度来看，需要综合考虑法规要求、技术标准和实际操作等多个方面。建议您参考相关的安全生产法规和标准，结合企业实际情况制定具体的管理措施。如需更详细的专业指导，建议咨询安全生产专家或相关部门。（当前为演示模式，实际部署时将连接AI服务提供更智能的回答）`;
}

export async function POST(request) {
  try {
    const { question } = await request.json();

    if (!question || question.trim().length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: '问题不能为空' 
      }, { status: 400 });
    }

    if (question.length > 500) {
      return NextResponse.json({ 
        success: false, 
        error: '问题长度不能超过500字符' 
      }, { status: 400 });
    }

    console.log('收到问题:', question);

    const relatedKnowledge = searchRelatedKnowledge(question);
    console.log('找到相关知识:', relatedKnowledge.length, '条');

    if (MOCK_MODE) {
      // 模拟思考时间
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const answer = generateMockAnswer(question);
      
      console.log('生成模拟回答，长度:', answer.length);

      return NextResponse.json({
        success: true,
        answer: answer,
        relatedTopics: relatedKnowledge.map(item => item.category),
        timestamp: new Date().toISOString(),
        tokensUsed: Math.floor(answer.length / 4), // 模拟token使用量
        mode: "demo" // 标识当前为演示模式
      });
    } else {
      // 真实OpenAI API模式（网络问题解决后使用）
      const OpenAI = require('openai');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const systemPrompt = `你是安全技术研究院的专业AI助手，专门回答安全生产相关问题。

你的知识基础：
${relatedKnowledge.map(item => `【${item.category}】${item.content}`).join('\n')}

回答要求：
1. 基于提供的知识基础回答问题
2. 回答要专业、准确、实用
3. 如果知识基础中没有相关信息，请诚实说明
4. 回答长度控制在150-300字
5. 使用简洁明了的中文
6. 可以适当提供具体的操作建议

用户问题：${question}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        max_tokens: 400,
        temperature: 0.3,
      });

      const answer = completion.choices[0].message.content;

      return NextResponse.json({
        success: true,
        answer: answer,
        relatedTopics: relatedKnowledge.map(item => item.category),
        timestamp: new Date().toISOString(),
        tokensUsed: completion.usage?.total_tokens || 0
      });
    }

  } catch (error) {
    console.error('AI Chat API错误:', error);

    return NextResponse.json({
      success: false,
      error: '抱歉，AI助手暂时无法回答，请稍后再试'
    }, { status: 500 });
  }
}

export async function GET() {
  const mode = MOCK_MODE ? "演示模式" : "AI模式";
  return NextResponse.json({
    message: `AI聊天API - 当前运行在${mode}`,
    usage: "POST /api/ai-chat with { question: 'your question' }",
    example: {
      question: "什么是安全生产法？"
    },
    mode: MOCK_MODE ? "demo" : "ai"
  });
}