export default function Incidents() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">事故警示</h1>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h3 className="text-xl font-semibold mb-2">典型火灾事故案例</h3>
          <p className="text-gray-600 mb-4">分析近期发生的重大火灾事故原因和预防措施</p>
          <span className="text-sm text-gray-500">2024-12-15</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <h3 className="text-xl font-semibold mb-2">化工厂爆炸事故分析</h3>
          <p className="text-gray-600 mb-4">深入分析化工安全管理中的关键问题</p>
          <span className="text-sm text-gray-500">2024-12-10</span>
        </div>
      </div>
    </div>
  )
}