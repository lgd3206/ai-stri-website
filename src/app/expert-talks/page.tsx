export default function ExpertTalks() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">专家讲堂</h1>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">安全生产管理创新思路</h3>
          <p className="text-gray-600 mb-4">资深安全专家分享现代安全管理理念</p>
          <div className="flex items-center text-sm text-gray-500">
            <span>主讲：张教授</span>
            <span className="mx-2">|</span>
            <span>2024-12-20</span>
          </div>
        </div>
      </div>
    </div>
  )
}