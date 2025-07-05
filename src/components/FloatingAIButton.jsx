'use client';
import { useState, useEffect } from 'react';

export default function FloatingAIButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // 页面滚动300px后显示浮动按钮
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    
    // 3秒后自动显示提示
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // 如果不可见就不渲染
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 提示卡片 */}
      {showTooltip && (
        <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-2xl p-4 w-72 border-2 border-green-200 animate-fadeIn">
          <button 
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg"
          >
            ×
          </button>
          
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🤖</span>
            <div className="text-lg font-bold text-gray-800">AI安全助手</div>
          </div>
          
          <div className="text-sm text-gray-600 mb-3">
            有安全生产问题？我来帮您解答！
            <br />
            <span className="text-green-600 font-semibold">✓ 专业知识库  ✓ 秒级响应  ✓ 免费使用</span>
          </div>
          
          <div className="flex space-x-2">
            <a 
              href="/ai-assistant"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex-1 text-center"
            >
              立即咨询 🚀
            </a>
            <button 
              onClick={() => setShowTooltip(false)}
              className="text-gray-500 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors"
            >
              稍后
            </button>
          </div>
        </div>
      )}

      {/* 主浮动按钮 */}
      <div className="relative">
        <a
          href="/ai-assistant"
          className="block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl transform hover:scale-110 transition-all duration-300 relative overflow-hidden"
          title="AI安全助手 - 智能问答"
          onClick={() => setShowTooltip(false)}
        >
          <span className="relative z-10">🤖</span>
          
          {/* 呼吸光效 */}
          <div className="absolute inset-0 bg-green-400 rounded-full opacity-30 animate-ping"></div>
        </a>

        {/* 小红点提示 */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-xs font-bold">AI</span>
        </div>

        {/* 脉冲圆环 */}
        <div className="absolute inset-0 rounded-full border-4 border-green-300 opacity-50 animate-pulse"></div>
      </div>

      {/* 简单提示文字 */}
      {!showTooltip && (
        <div className="absolute bottom-20 right-0 bg-gray-800 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-200">
          点击咨询AI安全助手
        </div>
      )}
    </div>
  );
}

// 添加CSS动画样式
const styles = `
  @keyframes fadeIn {
    from { 
      opacity: 0; 
      transform: translateY(20px) scale(0.8); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
