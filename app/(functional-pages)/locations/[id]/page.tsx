'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MapPin, Building, Users, Wrench, Calendar, ArrowLeft, BarChart, Upload } from 'lucide-react';
import Link from 'next/link';
import DonutChart from '../../dashboard/components/DonutChart';

// Import types
import { Location, LocationStatus } from '../page';

// Mock data for locations (copied directly to avoid import issues)
const locations: Location[] = [
  {
    id: 1001,
    name: 'Navy Air Station - Building 1828',
    address: '385 South Third St.',
    city: 'Corpus Christi',
    state: 'Texas',
    zip: '78415',
    customer: {
      name: 'U.S. Navy',
      id: 105
    },
    equipmentCount: 5,
    technicians: 2,
    status: 'active',
    lastService: '2023-02-25',
  },
  {
    id: 1002,
    name: 'Veterans High School',
    address: '3750 Cimarron Blvd',
    city: 'Corpus Christi',
    state: 'Texas',
    zip: '78414',
    customer: {
      name: 'Corpus Christi ISD',
      id: 108
    },
    equipmentCount: 12,
    technicians: 3,
    status: 'active',
    lastService: '2023-02-20',
  },
  {
    id: 1003,
    name: 'City Hall - HVAC Control Room',
    address: '1201 Leopard St',
    city: 'Corpus Christi',
    state: 'Texas',
    zip: '78401',
    customer: {
      name: 'City of Corpus Christi',
      id: 112
    },
    equipmentCount: 8,
    technicians: 2,
    status: 'maintenance',
    lastService: '2023-01-15',
  }
];

export default function LocationDetail() {
  const params = useParams();
  const locationId = typeof params.id === 'string' ? parseInt(params.id) : -1;
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState<string>('Month');

  useEffect(() => {
    // In a real application, you would fetch the location data from an API
    // For this example, we'll use mock data
    const fetchLocation = async () => {
      try {
        // Simulating API call with timeout
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Using the imported locations data
        const foundLocation = locations.find((loc: Location) => loc.id === locationId);
        setLocation(foundLocation || null);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching location:', error);
        setLoading(false);
      }
    };

    fetchLocation();
  }, [locationId]);

  // Helper function to get status color
  const getStatusColor = (status: LocationStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'maintenance':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Mock equipment data for the equipment breakdown section
  const equipments = [
    {
      id: 'YKF4507-1',
      name: 'York YKF4507 Chiller #1',
      cost: 11385.39,
      chart: '/path/to/chart1.png',
    },
    {
      id: 'YKF4507-2',
      name: 'York YKF4507 Chiller #2',
      cost: 43690.81,
      chart: '/path/to/chart2.png',
    },
    {
      id: 'YKF4507-3',
      name: 'York YKF4507 Chiller #3',
      cost: 6661.03,
      chart: '/path/to/chart3.png',
    },
  ];

  // Data for the Logged/Unlogged Equipment donut chart
  const donutData = {
    data: [2, 1],
    labels: ['Logged', 'Unlogged'],
    colors: ['#4F46E5', '#EF4444'],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/locations">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ArrowLeft size={16} />
              Back to Locations
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Location Not Found</h2>
            <p className="text-gray-600 mb-6">The location you're looking for doesn't exist or has been removed.</p>
            <Link href="/locations">
              <Button>View All Locations</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/locations">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowLeft size={16} />
            Back to Locations
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main info card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{location.name}</h2>
              <div className={`${getStatusColor(location.status)} px-3 py-1 rounded-full text-white text-xs font-medium`}>
                {location.status.charAt(0).toUpperCase() + location.status.slice(1)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-gray-700">{location.address}</p>
                  <p className="text-gray-700">{location.city}, {location.state} {location.zip}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-gray-400" />
                <p className="text-gray-700">Customer: {location.customer.name}</p>
              </div>
              
              <div className="flex items-center">
                <Wrench className="mr-2 h-5 w-5 text-gray-400" />
                <p className="text-gray-700">{location.equipmentCount} Equipment Units</p>
              </div>
              
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-gray-400" />
                <p className="text-gray-700">{location.technicians} Technicians Assigned</p>
              </div>
              
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                <p className="text-gray-700">Last Service: {new Date(location.lastService).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional information card */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold text-gray-800">Quick Stats</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Equipment Status</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active</span>
                  <span className="font-medium">{Math.floor(location.equipmentCount * 0.8)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Maintenance</span>
                  <span className="font-medium">{Math.floor(location.equipmentCount * 0.2)}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Recent Activity</h4>
                <p className="text-sm text-gray-600">Last visit: {new Date(location.lastService).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Next scheduled: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inefficiency Cost Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Inefficiency Cost</h2>
                <div className="flex gap-1">
                  {['Month', 'Quarter', 'YTD', 'Year', 'Max'].map((timeframe) => (
                    <button 
                      key={timeframe} 
                      className={`px-2 py-1 text-xs rounded ${activeTimeframe === timeframe ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                      onClick={() => setActiveTimeframe(timeframe)}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">Depicts the estimated unnecessary energy cost of an equipment based on the efficiency of the equipment and cost variables set by the customer.</p>
              
              {/* Inefficiency Cost Chart */}
              <div className="bg-gray-100 h-80 rounded flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Red shaded area */}
                  <div className="absolute inset-x-0 top-1/4 bottom-0 bg-red-100"></div>
                  
                  {/* Chart line */}
                  <div className="absolute left-0 right-0 top-1/4 h-0.5 bg-red-500 flex items-center justify-between">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-red-500 rounded-full"></div>
                    ))}
                  </div>
                  
                  {/* Y-axis labels */}
                  <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-600">
                    <div>$60,000.00</div>
                    <div>$45,000.00</div>
                    <div>$30,000.00</div>
                    <div>$15,000.00</div>
                    <div>$0.00</div>
                  </div>
                  
                  {/* X-axis labels */}
                  <div className="absolute bottom-2 left-16 right-16 flex justify-between text-xs text-gray-600">
                    <div>Mar 2024</div>
                    <div>Apr 2024</div>
                    <div>May 2024</div>
                    <div>Jun 2024</div>
                    <div>Jul 2024</div>
                    <div>Aug 2024</div>
                    <div>Sep 2024</div>
                    <div>Oct 2024</div>
                    <div>Nov 2024</div>
                    <div>Dec 2024</div>
                    <div>Jan 2025</div>
                    <div>Feb 2025</div>
                  </div>
                  
                  {/* Chart info */}
                  <div className="absolute top-2 right-2 text-xs">
                    <div className="text-gray-600">High: $61,737.24</div>
                    <div className="text-gray-600">Low: $20,196.07</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logged/Unlogged Equipment */}
        <div className="lg:col-span-1">
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Logged/Unlogged Equipment</h2>
              <p className="text-sm text-gray-600 mb-4">There are 1 unlogged equipment out of a total of 3</p>
              
              {/* Donut Chart with Chart.js */}
              <div className="flex justify-center items-center">
                <div className="w-48 h-48 relative">
                  <DonutChart
                    data={donutData.data}
                    labels={donutData.labels}
                    colors={donutData.colors}
                    centerText={{
                      value: '3',
                      label: 'Total'
                    }}
                  />
                </div>
              </div>
              
              <div className="flex justify-center gap-4 text-sm mt-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full mr-1"></div>
                  <span>Logged</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <span>Unlogged</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-400 text-center mt-2">Click on the Chart to interact</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Log Activity Chart */}
      <div className="mb-6">
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">Log Activity Over the Last Year</h2>
            <p className="text-sm text-gray-600 mb-4">Out of a Total of 14 Verified Logs</p>
            
            {/* Log Activity Chart */}
            <div className="bg-gray-100 h-48 rounded mb-2">
              <div className="relative w-full h-full">
                {/* Chart bars */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-between items-end px-8">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const height = i === 5 ? 'h-32' : i === 4 || i === 6 ? 'h-4' : 'h-2';
                    return (
                      <div key={i} className={`w-4 ${height} bg-cyan-400 rounded-t`}></div>
                    );
                  })}
                </div>
                
                {/* Month markers */}
                <div className="absolute bottom-2 left-8 right-8 flex justify-between">
                  {['M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D', 'J', 'F'].map((month, i) => (
                    <div key={i} className="text-xs text-gray-500">{month}</div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button variant="outline" size="sm" className="flex items-center gap-1 text-blue-600">
                <span>Click to Expand</span>
                <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
                  <path d="M6 8.825L10.2 4.625L9.375 3.8L6 7.175L2.625 3.8L1.8 4.625L6 8.825Z" fill="currentColor" />
                </svg>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Breakdown */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Equipment Breakdown</h2>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <span>Click to Collapse</span>
            <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 3.175L1.8 7.375L2.625 8.2L6 4.825L9.375 8.2L10.2 7.375L6 3.175Z" fill="currentColor" />
            </svg>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {equipments.map((equipment, index) => (
            <Card key={equipment.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{equipment.name}</h3>
                    <p className="text-red-600 font-medium">${equipment.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{index + 4}</span>
                    <button className="p-1 rounded border border-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                        <line x1="9" x2="15" y1="9" y2="15"></line>
                        <line x1="15" x2="9" y1="9" y2="15"></line>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full h-20 bg-red-100 rounded-md overflow-hidden">
                    <div className="h-full w-full relative">
                      <div className="absolute left-0 bottom-0 h-1/3 w-full bg-red-200"></div>
                      <div className="absolute left-0 bottom-0 h-1/6 w-full bg-red-300"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Files Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Files</h2>
        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 flex items-center justify-center gap-2">
          <Upload size={16} />
          <span>Upload File</span>
        </Button>
      </div>
    </div>
  );
} 