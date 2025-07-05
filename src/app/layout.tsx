import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '安全技术研究院',
  description: '专业的安全生产技术知识平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
      </body>
    </html>
  )
}
