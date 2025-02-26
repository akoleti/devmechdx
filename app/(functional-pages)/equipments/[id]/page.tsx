'use client';

import { useEffect, useState, useRef } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, Info, Settings, Upload, Users, Wrench, Building, Mail, Phone, ChevronUp, ChevronDown } from 'lucide-react';
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
  
  // State to track which accordions are open
  const [accordionStates, setAccordionStates] = useState({
    evaporator: false,
    condenser: false,
    electrical: false,
    other: false
  });
  
  // Function to update individual accordion state
  const setAccordionState = (name: string, isOpen: boolean) => {
    setAccordionStates(prev => ({
      ...prev,
      [name]: isOpen
    }));
  };
  
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
          <Link href={`/equipments/`} className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
            <ArrowLeft size={16} />
            <span>Back to Equipments</span>
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
              
              {/* Customer Information Card */}
              <Card className="border border-gray-200 mb-6">
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <Link 
                        href={`/customers/${equipment.customer.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {equipment.customer.name}
                      </Link>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <Link 
                        href={`/locations/${equipment.location.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                      >
                        <span>{equipment.location.name}</span>
                        {equipment.location.city && equipment.location.state && (
                          <span className="ml-1 text-gray-500 text-sm">
                            ({equipment.location.city}, {equipment.location.state})
                          </span>
                        )}
                      </Link>
                    </div>
                    
                    {equipment.customer.contactName && (
                      <div>
                        <p className="text-sm text-gray-500">Contact Name</p>
                        <div className="font-medium flex items-center">
                          <Users size={16} className="mr-1 text-gray-400" />
                          <span>{equipment.customer.contactName}</span>
                        </div>
                      </div>
                    )}
                    
                    {equipment.customer.contactEmail && (
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <div className="font-medium flex items-center">
                          <Mail size={16} className="mr-1 text-gray-400" />
                          <a 
                            href={`mailto:${equipment.customer.contactEmail}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {equipment.customer.contactEmail}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {equipment.customer.contactPhone && (
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <div className="font-medium flex items-center">
                          <Phone size={16} className="mr-1 text-gray-400" />
                          <a 
                            href={`tel:${equipment.customer.contactPhone}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {equipment.customer.contactPhone}
                          </a>
                        </div>
                      </div>
                    )}
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
              
              {/* Design Specifications */}
              <Card className="border border-gray-200 mb-6">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Design Specifications</h2>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="text-xs rounded-md flex items-center gap-1 py-1 px-3 bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        // Collapse all accordions
                        setAccordionStates({
                          evaporator: false,
                          condenser: false,
                          electrical: false,
                          other: false
                        });
                      }}
                    >
                      <ChevronUp size={14} />
                      Click to Collapse
                      <ChevronUp size={14} />
                    </Button>
                  </div>
                  
                  {/* Accordion item - can be collapsed */}
                  <DesignAccordion 
                    title="Evaporator" 
                    isOpen={accordionStates.evaporator}
                    setIsOpen={(open) => setAccordionState('evaporator', open)}
                  >
                    <div className="space-y-2">
                      <SpecificationRow label="Tons" value="60" />
                      <SpecificationRow 
                        label="Design Press. drop across the Strainer" 
                        value="0 ft/hd" 
                        note="(greater than 5-10 PSI needs cleaning)" 
                      />
                      <SpecificationRow label="Evaporator Only Pressure Drop (Ft/Hd)" value="7 ft/hd" />
                      <SpecificationRow 
                        label="Entering Water Temperature" 
                        value="54 F°" 
                        note="| 12.22 C°" 
                      />
                      <SpecificationRow 
                        label="Leaving Water Temperature" 
                        value="44 F°" 
                        note="| 6.67 C°" 
                      />
                      <SpecificationRow 
                        label="Delta Temperature" 
                        value="10 F°" 
                        note="| 12.22 C°" 
                      />
                      <SpecificationRow label="Suction Pressure" value="71.3" />
                      <SpecificationRow 
                        label="Evaporator Refrigerant Saturation Temp." 
                        value="42 F°" 
                        note="| 5.56 C°" 
                      />
                      <SpecificationRow 
                        label="Suction Line Temperature" 
                        value="54 F°" 
                        note="| 12.22 C°" 
                      />
                      <SpecificationRow label="Suction Superheat" value="12" />
                      <SpecificationRow 
                        label="Approach" 
                        value="2 ΔF°" 
                        note="| 1.11 ΔC°" 
                      />
                      <SpecificationRow label="GPM" value="144" />
                    </div>
                  </DesignAccordion>
                  
                  <DesignAccordion 
                    title="Condenser"
                    isOpen={accordionStates.condenser}
                    setIsOpen={(open) => setAccordionState('condenser', open)}
                  >
                    <div className="space-y-2">
                      <SpecificationRow label="Condenser Design Press" value="15 ft/hd" />
                      <SpecificationRow label="Condenser Only Press Drop" value="12 ft/hd" />
                      <SpecificationRow 
                        label="Entering Water Temperature" 
                        value="85 F°" 
                        note="| 29.44 C°" 
                      />
                      <SpecificationRow 
                        label="Leaving Water Temperature" 
                        value="95 F°" 
                        note="| 35 C°" 
                      />
                      <SpecificationRow label="Discharge Pressure" value="180.5" />
                      <SpecificationRow 
                        label="Condenser Refrigerant Saturation Temp." 
                        value="97 F°" 
                        note="| 36.11 C°" 
                      />
                      <SpecificationRow 
                        label="Discharge Line Temperature" 
                        value="150 F°" 
                        note="| 65.56 C°" 
                      />
                      <SpecificationRow label="Discharge Superheat" value="53" />
                      <SpecificationRow 
                        label="Approach" 
                        value="2 ΔF°" 
                        note="| 1.11 ΔC°" 
                      />
                      <SpecificationRow label="GPM" value="180" />
                    </div>
                  </DesignAccordion>
                  
                  <DesignAccordion 
                    title="Electrical"
                    isOpen={accordionStates.electrical}
                    setIsOpen={(open) => setAccordionState('electrical', open)}
                  >
                    <div className="space-y-2">
                      <SpecificationRow label="Compressor RLA" value="180 A" />
                      <SpecificationRow label="Compressor Power" value="140 kW" />
                      <SpecificationRow label="MCA" value="225 A" />
                      <SpecificationRow label="MOP" value="250 A" />
                      <SpecificationRow label="Control Voltage" value="120 V" />
                    </div>
                  </DesignAccordion>
                  
                  <DesignAccordion 
                    title="Other"
                    isOpen={accordionStates.other}
                    setIsOpen={(open) => setAccordionState('other', open)}
                  >
                    <div className="space-y-2">
                      <SpecificationRow label="Oil Type" value="POE" />
                      <SpecificationRow label="Oil Charge" value="6 gal" />
                      <SpecificationRow label="Refrigerant Charge" value="450 lbs" />
                      <SpecificationRow label="Compressor Type" value="Centrifugal" />
                      <SpecificationRow label="Starter Type" value="Solid State" />
                    </div>
                  </DesignAccordion>
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

interface DesignAccordionProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function DesignAccordion({ title, children, isOpen, setIsOpen }: DesignAccordionProps) {
  return (
    <div className="border border-gray-200 rounded-md mb-3 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors border-b border-gray-200"
        aria-expanded={isOpen}
      >
        <h3 className="font-medium text-left">{title}</h3>
        <ChevronUp 
          size={18} 
          className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-0' : 'transform rotate-180'}`} 
        />
      </button>
      
      {isOpen && (
        <div className="p-4 bg-white">{children}</div>
      )}
    </div>
  );
}

interface SpecificationRowProps {
  label: string;
  value: string;
  note?: string;
}

function SpecificationRow({ label, value, note }: SpecificationRowProps) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="text-right font-medium">
        <span className="font-medium text-gray-900 text-base">{value}</span>
        {note && <span className="text-xs text-gray-500 ml-1">{note}</span>}
      </div>
    </div>
  );
} 