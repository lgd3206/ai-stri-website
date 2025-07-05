import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import FloatingAIButton from '../components/FloatingAIButton';
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '安全技术研究院 - 专业安全生产技术平台',
  description: '提供最新安全生产标准规范、事故警示案例、专家讲堂等专业内容',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
       <head>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4776426875987574"
        crossOrigin="anonymous"
      ></script>
    </head>
      <body className={inter.className}>
        <header className="bg-blue-600 text-white shadow-lg">
  <nav className="container mx-auto px-4 py-3">
    <div className="flex justify-between items-center">
      {/* 左侧Logo */}
      <div className="text-xl font-bold">
        <a href="/" className="hover:text-blue-200">安全技术研究院</a>
      </div>
      
      {/* 右侧导航菜单 */}
      <div className="flex items-center space-x-1">
        {/* 常规导航链接 */}
        <a href="/" className="px-3 py-2 rounded hover:bg-blue-700 transition-colors">首页</a>
        <a href="/standards" className="px-3 py-2 rounded hover:bg-blue-700 transition-colors">标准规范</a>
        <a href="/incidents" className="px-3 py-2 rounded hover:bg-blue-700 transition-colors">事故警示</a>
        <a href="/expert-talks" className="px-3 py-2 rounded hover:bg-blue-700 transition-colors">专家讲堂</a>
        <a href="/knowledge-base" className="px-3 py-2 rounded hover:bg-blue-700 transition-colors">知识库</a>
        
        {/* AI助手 - 黄金位置突出显示 */}
        <a 
          href="/ai-assistant" 
          className="ml-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-2.5 rounded-full font-bold text-white shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center relative"
        >
          <span className="mr-2 text-lg">🤖</span>
          AI安全助手
          <span className="ml-2 bg-red-500 text-xs px-2 py-0.5 rounded-full font-normal animate-pulse">HOT</span>
          
          {/* 光圈效果 */}
          <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping"></div>
        </a>
      </div>
    </div>
  </nav>
</header>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2025 安全技术研究院. 保留所有权利.</p>
            <p className="mt-2">关注我们的微信公众号：安全技术研究院</p>
          </div>
        </footer>
        <FloatingAIButton />
        <!-- 直接在layout.tsx或页面底部添加这段代码 -->
<div id="floating-ai-button" style="
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  background: linear-gradient(135deg, #10b981, #059669);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: pulse 2s infinite;
  text-decoration: none;
  color: white;
  font-size: 24px;
" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
  🤖
  <!-- HOT标识 -->
  <div style="
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ef4444;
    color: white;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 10px;
    font-weight: bold;
  ">AI</div>
</div>

<style>
@keyframes pulse {
  0% { box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4); }
  50% { box-shadow: 0 4px 30px rgba(16, 185, 129, 0.8); }
  100% { box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4); }
}
</style>

<script>
document.getElementById('floating-ai-button').onclick = function() {
  window.location.href = '/ai-assistant';
};
</script>
      </body>
    </html>
  )
}
