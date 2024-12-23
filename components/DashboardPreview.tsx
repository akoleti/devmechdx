const DashboardPreview = () => {
  return (
    <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex space-x-2">
            <div className="w-24 h-2 bg-gray-200 rounded" />
            <div className="w-24 h-2 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-6">
        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg">
              <div className="w-16 h-2 bg-blue-200 rounded mb-2" />
              <div className="w-24 h-4 bg-gray-300 rounded" />
            </div>
          ))}
        </div>

        {/* Main Chart */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="w-full h-48 bg-gradient-to-b from-blue-100 to-blue-50 rounded" />
          <div className="flex justify-between mt-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="w-8 h-2 bg-gray-300 rounded" />
            ))}
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* HVAC Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="w-32 h-3 bg-gray-300 rounded" />
              <div className="w-8 h-8 bg-green-100 rounded-full" />
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="w-24 h-2 bg-gray-300 rounded" />
                  <div className="w-16 h-2 bg-blue-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Temperature Map */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="w-full h-40 bg-gradient-to-br from-red-100 via-blue-100 to-green-100 rounded" />
            <div className="flex justify-between mt-2">
              <div className="w-16 h-2 bg-gray-300 rounded" />
              <div className="w-16 h-2 bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview; 