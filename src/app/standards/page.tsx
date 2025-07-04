export default function Standards() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">标准规范</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">国家标准</h3>
          <p className="text-gray-600">最新发布的国家标准文件</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">行业标准</h3>
          <p className="text-gray-600">各行业专业标准规范</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">企业标准</h3>
          <p className="text-gray-600">优秀企业安全管理标准</p>
        </div>
      </div>
    </div>
  )
}