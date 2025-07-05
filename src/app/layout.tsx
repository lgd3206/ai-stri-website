import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '安全技术研究院 - 专业的安全生产技术知识平台',
  description: '专业的安全生产技术知识平台，为您提供最新的标准规范、事故分析和专家见解',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* 导航栏样式 */
            .header {
              background-color: #2563eb;
              color: white;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .nav-container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 12px 16px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .logo {
              font-size: 20px;
              font-weight: bold;
            }
            .logo a {
              color: white;
              text-decoration: none;
              transition: color 0.2s;
            }
            .logo a:hover {
              color: #bfdbfe;
            }
            .nav-menu {
              display: flex;
              align-items: center;
              gap: 4px;
            }
            .nav-link {
              color: white;
              text-decoration: none;
              padding: 8px 12px;
              border-radius: 6px;
              transition: background-color 0.2s;
            }
            .nav-link:hover {
              background-color: #1d4ed8;
            }
            .ai-button {
              margin-left: 24px;
              background: linear-gradient(to right, #10b981, #059669);
              color: white;
              padding: 10px 24px;
              border-radius: 25px;
              font-weight: bold;
              text-decoration: none;
              box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
              display: flex;
              align-items: center;
              transition: all 0.2s;
              position: relative;
            }
            .ai-button:hover {
              background: linear-gradient(to right, #059669, #047857);
              transform: scale(1.05);
            }
            .hot-badge {
              margin-left: 8px;
              background-color: #ef4444;
              font-size: 10px;
              padding: 2px 6px;
              border-radius: 10px;
              font-weight: normal;
              animation: pulse 2s infinite;
            }
            
            /* 浮动按钮样式 */
            .floating-ai-button {
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
              text-decoration: none;
              color: white;
              font-size: 24px;
              transition: all 0.3s ease;
            }
            .floating-ai-button:hover {
              transform: scale(1.1);
            }
            .floating-badge {
              position: absolute;
              top: -5px;
              right: -5px;
              background: #ef4444;
              color: white;
              font-size: 10px;
              padding: 2px 6px;
              border-radius: 10px;
              font-weight: bold;
            }
            
            /* 动画 */
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
          `
        }} />
      </head>
      <body>
        {/* 导航栏 */}
        <header className="header">
          <nav className="nav-container">
            {/* 左侧Logo */}
            <div className="logo">
              <a href="/">安全技术研究院</a>
            </div>
            
            {/* 右侧导航菜单 */}
            <div className="nav-menu">
              <a href="/" className="nav-link">首页</a>
              <a href="/standards" className="nav-link">标准规范</a>
              <a href="/incidents" className="nav-link">事故警示</a>
              <a href="/expert-talks" className="nav-link">专家讲堂</a>
              <a href="/knowledge-base" className="nav-link">知识库</a>
              
              {/* AI助手按钮 */}
              <a href="/ai-assistant" className="ai-button">
                <span style={{ marginRight: '8px', fontSize: '18px' }}>🤖</span>
                AI安全助手
                <span className="hot-badge">HOT</span>
              </a>
            </div>
          </nav>
        </header>

        {/* 页面内容 */}
        <main>{children}</main>

        {/* 浮动AI助手按钮 */}
        <a href="/ai-assistant" className="floating-ai-button">
          🤖
          <div className="floating-badge">AI</div>
        </a>
      </body>
    </html>
  )
}
