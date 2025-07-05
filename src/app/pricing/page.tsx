import React, { useState } from 'react';
import { CreditCard, Check, Star, Shield, Users, ArrowRight, Gift } from 'lucide-react';

const PaymentSystem = () => {
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [showPayment, setShowPayment] = useState(false);

  // 用户套餐配置
  const plans = [
    {
      id: 'free',
      name: '免费体验',
      price: 0,
      period: '永久免费',
      description: '体验AI安全助手基础功能',
      features: [
        '每日5次AI问答',
        '每月50次问答',
        '基础安全咨询',
        '技术参数查询',
        '标准回答长度'
      ],
      popular: false,
      color: 'gray'
    },
    {
      id: 'basic',
      name: '基础版',
      price: 19.9,
      period: '元/月',
      description: '适合个人安全管理人员',
      features: [
        '每日20次AI问答',
        '每月300次问答',
        '深度安全分析',
        '专业建议指导',
        '优先响应速度',
        '详细解答内容'
      ],
      popular: true,
      color: 'blue',
      savings: '比免费版多15次/天'
    },
    {
      id: 'pro',
      name: '专业版',
      price: 99,
      period: '元/月',
      description: '适合企业安全负责人',
      features: [
        '每日100次AI问答',
        '每月1500次问答',
        '复杂问题深度分析',
        '专家级专业回答',
        'API接口访问',
        '定制化建议',
        '专属客服支持'
      ],
      popular: false,
      color: 'purple',
      savings: '比基础版多80次/天'
    },
    {
      id: 'enterprise',
      name: '企业版',
      price: 499,
      period: '元/月',
      description: '适合大型企业和机构',
      features: [
        '无限AI问答次数',
        '企业定制功能',
        '批量问题处理',
        '数据导出功能',
        '专属客服团队',
        '定制化培训',
        '技术支持服务',
        '私有化部署选项'
      ],
      popular: false,
      color: 'gold',
      contact: true
    }
  ];

  // 支付方式配置
  const paymentMethods = [
    { id: 'wechat', name: '微信支付', icon: '💚', popular: true },
    { id: 'alipay', name: '支付宝', icon: '💙', popular: true },
    { id: 'bank', name: '银行转账', icon: '🏦', popular: false }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    if (planId !== 'free') {
      setShowPayment(true);
    }
  };

  const handlePayment = (paymentMethod) => {
    const plan = plans.find(p => p.id === selectedPlan);
    alert(`准备使用${paymentMethod.name}支付 ${plan.price}元购买${plan.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* 头部标题 */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <Shield className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">AI安全助手套餐</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            选择适合您的套餐，解锁更强大的AI安全生产咨询能力
          </p>
          <div className="mt-6 inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <Gift className="w-5 h-5 mr-2" />
            <span className="font-medium">新用户注册即送3天专业版体验</span>
          </div>
        </div>

        {/* 套餐对比表 */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-300 hover:shadow-xl ${
                selectedPlan === plan.id
                  ? 'border-blue-500 scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              } ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
            >
              
              {/* 推荐标签 */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    推荐选择
                  </div>
                </div>
              )}

              {/* 套餐头部 */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-gray-900">¥{plan.price}</span>
                  <span className="text-gray-500 ml-2">{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
                {plan.savings && (
                  <div className="mt-2 text-sm text-green-600 font-medium">{plan.savings}</div>
                )}
              </div>

              {/* 功能列表 */}
              <div className="mb-8">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 选择按钮 */}
              <button
                onClick={() => handlePlanSelect(plan.id)}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  plan.contact
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700'
                    : selectedPlan === plan.id
                    ? 'bg-blue-600 text-white'
                    : plan.popular
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.contact ? '联系销售' : plan.id === 'free' ? '免费使用' : '立即选择'}
                {!plan.contact && <ArrowRight className="w-4 h-4 ml-2 inline" />}
              </button>
            </div>
          ))}
        </div>

        {/* 付款流程 */}
        {showPayment && selectedPlan !== 'free' && (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <CreditCard className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">完成支付</h3>
              <p className="text-gray-600">
                您选择了 <span className="font-medium text-blue-600">{plans.find(p => p.id === selectedPlan)?.name}</span>
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  ¥{plans.find(p => p.id === selectedPlan)?.price}
                </div>
                <div className="text-sm text-gray-600">首月付费，随时可取消</div>
              </div>
            </div>

            {/* 支付方式选择 */}
            <div className="space-y-3 mb-6">
              <h4 className="font-medium text-gray-900 mb-3">选择支付方式</h4>
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handlePayment(method)}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{method.icon}</span>
                    <span className="font-medium">{method.name}</span>
                    {method.popular && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        推荐
                      </span>
                    )}
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                </button>
              ))}
            </div>

            {/* 安全提示 */}
            <div className="text-center text-sm text-gray-500">
              <Shield className="w-4 h-4 inline mr-1" />
              支付安全由第三方平台保障
            </div>
          </div>
        )}

        {/* 常见问题 */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">常见问题</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">如何升级或降级套餐？</h4>
                <p className="text-gray-600">您可以随时在用户中心更改套餐，升级立即生效，降级在下个计费周期生效。</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">支持哪些支付方式？</h4>
                <p className="text-gray-600">支持微信支付、支付宝、银行转账等多种支付方式，企业用户支持对公转账。</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">未使用完的问答次数会累积吗？</h4>
                <p className="text-gray-600">免费版和基础版的次数不累积，专业版及以上支持次数累积到下月使用。</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">可以申请退款吗？</h4>
                <p className="text-gray-600">支持7天无理由退款，如对服务不满意可申请全额退款。</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">企业版有什么特殊服务？</h4>
                <p className="text-gray-600">企业版提供专属客服、定制化功能开发、私有化部署等增值服务。</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">数据安全如何保障？</h4>
                <p className="text-gray-600">所有数据传输采用SSL加密，严格遵循数据保护法规，绝不泄露用户隐私。</p>
              </div>
            </div>
          </div>
        </div>

        {/* 联系方式 */}
        <div className="mt-16 text-center bg-gray-900 text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">需要帮助？</h3>
          <p className="text-gray-300 mb-6">我们的客服团队随时为您提供支持</p>
          <div className="flex justify-center space-x-6">
            <div className="text-center">
              <div className="text-lg font-medium">在线客服</div>
              <div className="text-blue-400">工作日 9:00-18:00</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium">技术支持</div>
              <div className="text-blue-400">support@ai-stri.online</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium">销售咨询</div>
              <div className="text-blue-400">sales@ai-stri.online</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentSystem;
