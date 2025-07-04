export default function KnowledgeBase() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">知识库</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">应急手册</h3>
          <p className="text-gray-600">各类突发事件应急处置指南</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">安全检查清单</h3>
          <p className="text-gray-600">标准化的安全检查表格</p>
        </div>
      </div>
    </div>
  )
}