import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 头部轮播区域 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">欢迎来到安全技术研究院</h1>
        <p className="text-xl mb-6">专业的安全生产技术知识平台，为您提供最新的标准规范、事故分析和专家见解</p>
        <Link href="/standards" className="bg-white text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
          探索标准规范
        </Link>
      </div>

      {/* 内容板块 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-blue-800">标准规范</h3>
          <p className="text-gray-600 mb-4">最新的国家标准、行业标准和企业标准</p>
          <Link href="/standards" className="text-blue-600 hover:text-blue-800">查看更多 →</Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-red-600">事故警示</h3>
          <p className="text-gray-600 mb-4">典型案例分析和预防措施</p>
          <Link href="/incidents" className="text-red-600 hover:text-red-800">查看更多 →</Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-green-600">专家讲堂</h3>
          <p className="text-gray-600 mb-4">行业专家的深度解读和分享</p>
          <Link href="/expert-talks" className="text-green-600 hover:text-green-800">查看更多 →</Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-purple-600">知识库</h3>
          <p className="text-gray-600 mb-4">实用的安全知识和工具</p>
          <Link href="/knowledge-base" className="text-purple-600 hover:text-purple-800">查看更多 →</Link>
        </div>
      </div>

      {/* 最新内容 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">最新内容</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold">2025年安全生产月活动解读</h3>
            <p className="text-gray-600 text-sm">今年的主题是&quot;人人讲安全、个个会应急&quot;...</p>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-semibold">典型火灾事故案例分析</h3>
            <p className="text-gray-600 text-sm">深度分析近期发生的重大火灾事故...</p>
          </div>
        </div>
      </div>
    </div>
  )
}