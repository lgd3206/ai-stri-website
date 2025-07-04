import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

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
        <header className="bg-blue-900 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold">
                安全技术研究院
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="hover:text-blue-200">首页</Link>
                <Link href="/standards" className="hover:text-blue-200">标准规范</Link>
                <Link href="/incidents" className="hover:text-blue-200">事故警示</Link>
                <Link href="/expert-talks" className="hover:text-blue-200">专家讲堂</Link>
                <Link href="/knowledge-base" className="hover:text-blue-200">知识库</Link>
              </nav>
            </div>
          </div>
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
      </body>
    </html>
  )
}
