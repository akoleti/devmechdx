'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, Info, Settings, Upload, Users, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReactNode } from 'react';
import { Equipment, equipments } from '../data';

export default function EquipmentDetail({ params }: { params: Promise<{ id: string }> }) {
  // Properly unwrap params using React.use()
  const unwrappedParams = use(params);
  const equipmentId = unwrappedParams.id;
  
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real application, this would be an API call
    const foundEquipment = equipments.find(eq => eq.id === equipmentId);
    setEquipment(foundEquipment || null);
    setLoading(false);
  }, [equipmentId]); // Use equipmentId instead of params.id

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Equipment Not Found</h1>
          <p className="mb-4">The equipment you are looking for does not exist or has been removed.</p>
          <Link href="/equipments">
            <Button>Back to Equipments</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Link href={`/locations/${equipment.location.id}`} className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
            <ArrowLeft size={16} />
            <span>Back to {equipment.location.name}</span>
          </Link>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{equipment.name}</h1>
            <p className="text-gray-600">Serial Number: {equipment.serialNumber}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Upload size={16} />
              <span>Upload Files</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Settings size={16} />
              <span>Settings</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card className="border border-gray-200 mb-6">
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Equipment Overview</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Model</p>
                      <p className="font-medium">{equipment.model}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Manufacturer</p>
                      <p className="font-medium">{equipment.manufacturer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Installed Date</p>
                      <p className="font-medium">{new Date(equipment.installedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Service</p>
                      <p className="font-medium">{new Date(equipment.lastService).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`font-medium ${equipment.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                        {equipment.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Inefficiency Cost</p>
                      <p className="font-medium text-red-600">
                        ${equipment.inefficiencyCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 mb-6">
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Inefficiency Cost</h2>
                  <div className="bg-gray-100 h-64 rounded flex items-center justify-center">
                    {/* Placeholder for chart */}
                    <p className="text-gray-500">Inefficiency cost chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specs">
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Technical Specifications</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(equipment.specifications).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm text-gray-500">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}</p>
                        <p className="font-medium">{value as ReactNode}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="maintenance">
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Maintenance History</h2>
                  <div className="space-y-4">
                    <div className="border-b pb-3">
                      <div className="flex items-center gap-2">
                        <Wrench size={16} className="text-blue-600" />
                        <p className="font-medium">Preventive Maintenance</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <CalendarDays size={14} />
                        <span>November 8, 2023</span>
                      </div>
                      <p className="text-sm mt-2">Conducted full inspection and cleaning of condenser coils and tubes. Replaced filters and performed oil analysis.</p>
                    </div>
                    <div className="border-b pb-3">
                      <div className="flex items-center gap-2">
                        <Wrench size={16} className="text-blue-600" />
                        <p className="font-medium">Refrigerant Leak Repair</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <CalendarDays size={14} />
                        <span>August 15, 2023</span>
                      </div>
                      <p className="text-sm mt-2">Detected and repaired refrigerant leak in the system. Recharged with R-134a refrigerant and tested operation.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="logs">
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Equipment Logs</h2>
                  <div className="space-y-4">
                    <div className="border-b pb-3">
                      <div className="flex items-center gap-2">
                        <Info size={16} className="text-blue-600" />
                        <p className="font-medium">Performance Log</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <CalendarDays size={14} />
                        <span>December 10, 2023</span>
                        <Users size={14} />
                        <span>John Smith</span>
                      </div>
                      <p className="text-sm mt-2">Measured COP at 4.2, below expected performance. Chilled water temperature at 44°F, condenser water temperature at 85°F.</p>
                    </div>
                    <div className="border-b pb-3">
                      <div className="flex items-center gap-2">
                        <Info size={16} className="text-blue-600" />
                        <p className="font-medium">Operational Log</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <CalendarDays size={14} />
                        <span>November 20, 2023</span>
                        <Users size={14} />
                        <span>Sarah Johnson</span>
                      </div>
                      <p className="text-sm mt-2">Operating at 75% capacity during peak hours. No abnormal vibrations or noise detected.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column */}
        <div>
          <Card className="border border-gray-200 mb-6">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Next Service Due</h2>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Preventive Maintenance</span>
                <span className="font-medium">May 8, 2024</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">75 days remaining</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 mb-6">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Efficiency</span>
                    <span className="text-sm font-medium">82%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-4/5"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Reliability</span>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-11/12"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Cost Effectiveness</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full w-2/3"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Related Documentation</h2>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start text-left text-blue-600">
                  Equipment Manual.pdf
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-left text-blue-600">
                  Maintenance Schedule.xlsx
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-left text-blue-600">
                  Warranty Information.pdf
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 