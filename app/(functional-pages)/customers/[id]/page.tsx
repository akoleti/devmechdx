'use client';

import { useEffect, useState, use } from 'react';
import { Customer } from '../components/CustomersList';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload, 
  Bell, 
  Calendar, 
  BarChart,
  FileText,
  PlusCircle,
  Plus,
  QrCode
} from 'lucide-react';

// Mock customer data - in a real app this would come from an API
const customers: Customer[] = [
  {
    id: 1,
    name: 'Alice ISD',
    address: '1 COYOTE TRL',
    city: 'Alice',
    state: 'Texas',
    zip: '78332',
    contact: {
      name: 'Michael Hinojosa',
      initial: 'M',
    },
    stats: {
      locations: 1,
      equipments: 5,
      logs: 6,
    },
    visible: true,
  },
  {
    id: 2,
    name: 'Aransas County ISD',
    address: 'P.O. Box 907',
    city: 'Rockport',
    state: 'Texas',
    zip: '78382',
    contact: {
      name: 'Thomas Lawing',
      initial: 'T',
    },
    stats: {
      locations: 2,
      equipments: 3,
      logs: 0,
    },
    visible: true,
  },
  {
    id: 3,
    name: 'Bay Area Medical Center',
    address: '7100 South Padre Island Drive',
    city: 'Corpus Christi',
    state: 'Texas',
    zip: '78412',
    contact: {
      name: 'Keith Addison',
      initial: 'K',
    },
    stats: {
      locations: 1,
      equipments: 5,
      logs: 7,
    },
    visible: true,
  },
  {
    id: 4,
    name: 'Bel Furniture',
    address: '5858 S Padre Island Dr',
    city: 'Corpus Christi',
    state: 'Texas',
    zip: '78412',
    contact: {
      name: 'Need Info',
      initial: 'N',
    },
    stats: {
      locations: 1,
      equipments: 2,
      logs: 2,
    },
    visible: true,
  },
  {
    id: 5,
    name: 'Best Western Marina Hotel',
    address: '300 N. Shoreline',
    city: 'Corpus Christi',
    state: 'Texas',
    zip: '78401',
    contact: {
      name: 'Gabe Pena',
      initial: 'G',
    },
    stats: {
      locations: 1,
      equipments: 3,
      logs: 6,
    },
    visible: true,
  },
];

export default function CustomerDetail({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  // Unwrap params with React.use() to handle both current and future Next.js behavior
  const unwrappedParams = params instanceof Promise ? use(params) : params;
  const customerId = parseInt(unwrappedParams.id);

  useEffect(() => {
    // Simulating API call to get customer data
    const foundCustomer = customers.find(c => c.id === customerId);
    
    if (foundCustomer) {
      setCustomer(foundCustomer);
    }
    
    setLoading(false);
  }, [customerId]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!customer) {
    return <div className="container mx-auto p-4">Customer not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header with customer info and action buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{customer.name}</h1>
          <div className="text-gray-600">
            <p>{customer.address}</p>
            <p>{customer.city}, {customer.state} {customer.zip}</p>
          </div>
        </div>
        
        {/* Action buttons aligned to the right */}
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus size={16} className="mr-2" /> Create Log
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <QrCode size={16} className="mr-2" /> Generate QR Codes
          </Button>
          <Button className="bg-purple-700 hover:bg-purple-800 text-white">
            <PlusCircle size={16} className="mr-2" /> Create New
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-2 mb-4">
        <Button className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50">
          <Bell size={16} className="mr-2" /> Subscribe to Alerts
        </Button>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inefficiency Cost Chart - Takes up 2/3 of the width on large screens */}
        <div className="lg:col-span-2">
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Inefficiency Cost</h2>
                <div className="flex gap-1">
                  <button className="px-2 py-1 text-xs bg-indigo-600 text-white rounded">Month</button>
                  <button className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">Quarter</button>
                  <button className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">YTD</button>
                  <button className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">1 Year</button>
                  <button className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">3 Years</button>
                  <button className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">5 Years</button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">Depicts the estimated unnecessary energy cost of an equipment based on the efficiency of the equipment and cost variables set by the customer.</p>
              
              {/* Placeholder for Inefficiency Cost Chart */}
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
                    <div>$22,000.00</div>
                    <div>$16,000.00</div>
                    <div>$10,000.00</div>
                    <div>$4,000.00</div>
                    <div>$0.00</div>
                  </div>
                  
                  {/* X-axis labels */}
                  <div className="absolute bottom-2 left-16 right-16 flex justify-between text-xs text-gray-600">
                    <div>2020</div>
                    <div>2021</div>
                    <div>2022</div>
                    <div>2023</div>
                    <div>2024</div>
                    <div>2025</div>
                  </div>
                  
                  {/* Chart info */}
                  <div className="absolute top-2 right-2 text-xs">
                    <div className="text-gray-600">High: $23,238.40</div>
                    <div className="text-gray-600">Low: $0.00</div>
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
              <p className="text-sm text-gray-600 mb-4">There is 1 unlogged equipment out of a total of 5</p>
              
              {/* Donut Chart Placeholder */}
              <div className="flex justify-center mb-4">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full border-8 border-indigo-500"></div>
                  <div className="absolute inset-0 rounded-full border-t-8 border-r-8 border-red-500" style={{transform: 'rotate(80deg)'}}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <div className="text-red-500 text-center font-bold">1</div>
                      <div className="text-indigo-500 text-center font-bold">4</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <span>Unlogged</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full mr-1"></div>
                  <span>Logged</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-400 text-center mt-2">Click on the Chart to interact</p>
            </CardContent>
          </Card>
        </div>

        {/* Log Activity Chart */}
        <div className="lg:col-span-3">
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Log Activity Over the Last Year</h2>
              <p className="text-sm text-gray-600 mb-4">Out of a Total of 7 Total Logs</p>
              
              {/* Placeholder for Log Activity Chart */}
              <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Chart bars */}
                  <div className="absolute bottom-8 left-0 right-0 flex justify-between items-end px-8">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const height = i === 6 || i === 9 ? 'h-16' : i === 3 ? 'h-28' : i === 11 ? 'h-20' : 'h-2';
                      return (
                        <div key={i} className={`w-4 ${height} bg-teal-400 rounded-t`}></div>
                      );
                    })}
                  </div>
                  
                  {/* X-axis */}
                  <div className="absolute bottom-4 left-8 right-8 h-px bg-gray-300"></div>
                  
                  {/* Y-axis */}
                  <div className="absolute left-4 top-8 bottom-8 w-px bg-gray-300"></div>
                </div>
              </div>
              
              <div className="flex justify-center mt-2">
                <Button variant="outline" size="sm">
                  Click to Expand
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Breakdown */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Location Breakdown</h2>
            <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
              <option>Name (A-Z)</option>
              <option>Name (Z-A)</option>
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
          </div>
          
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center text-red-500 mr-3">
                    <BarChart size={18} />
                  </div>
                  <span className="font-medium">{customer.name}</span>
                </div>
                <div className="text-red-500 font-semibold">$8,778.10</div>
                <div className="flex space-x-2">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">5</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">7</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Files Section */}
        <div className="lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4">Files</h2>
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 flex items-center justify-center">
            <Upload size={18} className="mr-2" /> Upload File
          </Button>
        </div>
      </div>
    </div>
  );
} 