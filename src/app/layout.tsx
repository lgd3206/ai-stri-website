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
      </head>
      <body>
        {/* 导航栏 */}
        <header style={{
          backgroundColor: '#2563eb',
          color: 'white',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <nav style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {/* 左侧Logo */}
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              <a 
                href="/" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.color = '#bfdbfe'}
                onMouseOut={(e) => e.target.style.color = 'white'}
              >
                安全技术研究院
              </a>
            </div>
            
            {/* 右侧导航菜单 */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px' 
            }}>
              {/* 常规导航链接 */}
              <a 
                href="/" 
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                首页
              </a>
              <a 
                href="/standards" 
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                标准规范
              </a>
              <a 
                href="/incidents" 
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                事故警示
              </a>
              <a 
                href="/expert-talks" 
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                专家讲堂
              </a>
              <a 
                href="/knowledge-base" 
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                知识库
              </a>
              
              {/* AI助手按钮 - 突出显示 */}
              <a 
                href="/ai-assistant" 
                style={{
                  marginLeft: '24px',
                  background: 'linear-gradient(to right, #10b981, #059669)',
                  color: 'white',
                  padding: '10px 24px',
                  borderRadius: '25px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'linear-gradient(to right, #059669, #047857)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'linear-gradient(to right, #10b981, #059669)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <span style={{ marginRight: '8px', fontSize: '18px' }}>🤖</span>
                AI安全助手
                <span style={{
                  marginLeft: '8px',
                  backgroundColor: '#ef4444',
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontWeight: 'normal',
                  animation: 'pulse 2s infinite'
                }}>
                  HOT
                </span>
              </a>
            </div>
          </nav>
        </header>

        {/* 页面内容 */}
        <main>{children}</main>

        {/* 浮动AI助手按钮 */}
        <div 
          id="floating-ai-button"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            color: 'white',
            fontSize: '24px'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          onClick={() => window.location.href = '/ai-assistant'}
        >
          🤖
          {/* HOT标识 */}
          <div style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: '#ef4444',
            color: 'white',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '10px',
            fontWeight: 'bold'
          }}>
            AI
          </div>
        </div>

        {/* CSS动画 */}
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}</style>
      </body>
    </html>
  )
}
