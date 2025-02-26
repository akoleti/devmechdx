import { 
  Building, 
  Wrench, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  ThermometerSnowflake,
  Droplets,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const DashboardPreview = () => {
  return (
    <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="font-semibold text-lg text-blue-600">MechDX Dashboard</div>
            <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Live</div>
          </div>
          <div className="flex space-x-3">
            <div className="text-xs text-gray-500">Last updated: Just now</div>
            <div className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">Refresh</div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-500 text-sm">Total Equipment</div>
              <div className="p-2 rounded-full bg-blue-100">
                <Wrench size={16} className="text-blue-500" />
              </div>
            </div>
            <div className="text-2xl font-bold">147</div>
            <div className="text-xs flex items-center text-green-600 mt-1">
              <ArrowUpRight size={12} />
              <span className="ml-1">5% from last month</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-500 text-sm">Active Locations</div>
              <div className="p-2 rounded-full bg-purple-100">
                <Building size={16} className="text-purple-500" />
              </div>
            </div>
            <div className="text-2xl font-bold">32</div>
            <div className="text-xs flex items-center text-gray-500 mt-1">
              <span>No change</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-500 text-sm">Pending Logs</div>
              <div className="p-2 rounded-full bg-orange-100">
                <Clock size={16} className="text-orange-500" />
              </div>
            </div>
            <div className="text-2xl font-bold">18</div>
            <div className="text-xs flex items-center text-red-600 mt-1">
              <ArrowUpRight size={12} />
              <span className="ml-1">12% from last week</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-500 text-sm">Active Alerts</div>
              <div className="p-2 rounded-full bg-red-100">
                <AlertTriangle size={16} className="text-red-500" />
              </div>
            </div>
            <div className="text-2xl font-bold">7</div>
            <div className="text-xs flex items-center text-red-600 mt-1">
              <ArrowUpRight size={12} />
              <span className="ml-1">3 new today</span>
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Equipment Efficiency Trends</h3>
            <div className="flex space-x-2">
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">Daily</span>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">Weekly</span>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">Monthly</span>
            </div>
          </div>
          <div className="relative h-48 w-full">
            {/* Chart mockup with colored lines */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200 w-full"></div>
            <div className="absolute left-0 bottom-0 top-0 w-px bg-gray-200 h-full"></div>
            
            {/* Blue line - Chillers */}
            <div className="absolute left-0 right-0 bottom-12 h-px bg-blue-400 w-full" style={{ height: '2px' }}></div>
            <div className="absolute left-1/4 bottom-16 h-1 w-1 rounded-full bg-blue-400"></div>
            <div className="absolute left-2/4 bottom-20 h-1 w-1 rounded-full bg-blue-400"></div>
            <div className="absolute left-3/4 bottom-24 h-1 w-1 rounded-full bg-blue-400"></div>
            <div className="absolute left-[90%] bottom-28 h-1 w-1 rounded-full bg-blue-400"></div>
            
            {/* Green line - HVAC */}
            <div className="absolute left-0 right-0 bottom-24 h-px bg-green-400 w-full" style={{ height: '2px' }}></div>
            <div className="absolute left-1/4 bottom-28 h-1 w-1 rounded-full bg-green-400"></div>
            <div className="absolute left-2/4 bottom-24 h-1 w-1 rounded-full bg-green-400"></div>
            <div className="absolute left-3/4 bottom-20 h-1 w-1 rounded-full bg-green-400"></div>
            <div className="absolute left-[90%] bottom-16 h-1 w-1 rounded-full bg-green-400"></div>
            
            {/* Red line - Boilers */}
            <div className="absolute left-0 right-0 bottom-6 h-px bg-red-400 w-full" style={{ height: '2px' }}></div>
            <div className="absolute left-1/4 bottom-8 h-1 w-1 rounded-full bg-red-400"></div>
            <div className="absolute left-2/4 bottom-4 h-1 w-1 rounded-full bg-red-400"></div>
            <div className="absolute left-3/4 bottom-10 h-1 w-1 rounded-full bg-red-400"></div>
            <div className="absolute left-[90%] bottom-6 h-1 w-1 rounded-full bg-red-400"></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <div>Jan 21</div>
            <div>Jan 22</div>
            <div>Jan 23</div>
            <div>Jan 24</div>
            <div>Jan 25</div>
            <div>Jan 26</div>
            <div>Today</div>
          </div>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-1"></div>
              <span className="text-xs text-gray-500">Chillers</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-1"></div>
              <span className="text-xs text-gray-500">HVAC</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div>
              <span className="text-xs text-gray-500">Boilers</span>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Equipment Status */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Equipment Status</h3>
              <div className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">View All</div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center">
                  <ThermometerSnowflake size={16} className="text-blue-500 mr-2" />
                  <div>
                    <div className="font-medium text-sm">Air-Cooled Chiller</div>
                    <div className="text-xs text-gray-500">Navy Air Station</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">Operational</div>
                  <span className="text-sm font-medium">95.6%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center">
                  <Droplets size={16} className="text-red-500 mr-2" />
                  <div>
                    <div className="font-medium text-sm">Hot Water Boiler</div>
                    <div className="text-xs text-gray-500">Portland Medical Center</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">Alert</div>
                  <span className="text-sm font-medium">-30.6%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center">
                  <Activity size={16} className="text-purple-500 mr-2" />
                  <div>
                    <div className="font-medium text-sm">MRI Chiller</div>
                    <div className="text-xs text-gray-500">Spohn Hospital</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full">Maintenance</div>
                  <span className="text-sm font-medium">136.6%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Logs */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Recent Logs</h3>
              <div className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">View All</div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white mr-3">
                  C
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="font-medium text-sm">Cliff Blair</div>
                    <div className="text-xs text-gray-500">FEB 25</div>
                  </div>
                  <div className="text-xs text-gray-500">Hot Water Boiler - Corpus Christi</div>
                </div>
                <div className="ml-2">
                  <div className="px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded">Pending</div>
                </div>
              </div>
              
              <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white mr-3">
                  E
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="font-medium text-sm">Eryk Mozejko</div>
                    <div className="text-xs text-gray-500">FEB 12</div>
                  </div>
                  <div className="text-xs text-gray-500">MRI Chiller - Wood Dale</div>
                </div>
                <div className="ml-2">
                  <div className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">Completed</div>
                </div>
              </div>
              
              <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white mr-3">
                  J
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="font-medium text-sm">Joe Castillo</div>
                    <div className="text-xs text-gray-500">FEB 11</div>
                  </div>
                  <div className="text-xs text-gray-500">MRI Chiller - Kingsville</div>
                </div>
                <div className="ml-2">
                  <div className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded">Failed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview; 