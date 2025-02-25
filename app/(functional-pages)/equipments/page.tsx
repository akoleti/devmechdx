'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList } from 'lucide-react';
import EquipmentList from './components/EquipmentList';
import EquipmentGrid from './components/EquipmentGrid';
import FilterSidebar from './components/FilterSidebar';

// Equipment status types
export type EquipmentStatus = 'operational' | 'maintenance' | 'offline' | 'critical';

// Equipment types
export type EquipmentType = 'chiller' | 'boiler' | 'air-handler' | 'cooling-tower' | 'heat-exchanger';

// Equipment interface
export interface Equipment {
  id: number;
  serialNumber: string;
  name: string;
  type: EquipmentType;
  manufacturer: string;
  model: string;
  location: {
    id: number;
    name: string;
    city: string;
    state: string;
  };
  installDate: string;
  lastService: string;
  status: EquipmentStatus;
  efficiency: number;
  logs: number;
  hasAlerts: boolean;
}

// Mock data for equipment - placed outside component to avoid recreating on each render
const equipment: Equipment[] = [
  {
    id: 47683,
    serialNumber: 'FE12151',
    name: 'Hot Water Boiler #1',
    type: 'boiler',
    manufacturer: 'Fulton',
    model: 'FB-A10',
    location: {
      id: 1001,
      name: 'Navy Air Station Building 1828',
      city: 'Corpus Christi',
      state: 'Texas'
    },
    installDate: '2018-06-15',
    lastService: '2023-02-25',
    status: 'operational',
    efficiency: 95.59,
    logs: 6,
    hasAlerts: true
  },
  {
    id: 47643,
    serialNumber: 'KCC215',
    name: 'MRI Chiller',
    type: 'chiller',
    manufacturer: 'KKT',
    model: 'MRI Cooling System A',
    location: {
      id: 1002,
      name: 'Portland Medical Center',
      city: 'Portland',
      state: 'Texas'
    },
    installDate: '2019-03-22',
    lastService: '2023-02-12',
    status: 'operational',
    efficiency: 136.60,
    logs: 4,
    hasAlerts: false
  },
  {
    id: 45477,
    serialNumber: 'KKTK-4500',
    name: 'MRI Chiller - Kraus',
    type: 'chiller',
    manufacturer: 'KKT',
    model: 'CboxX60',
    location: {
      id: 1003,
      name: 'Spohn Hospital Kleberg',
      city: 'Kingsville',
      state: 'Texas'
    },
    installDate: '2017-11-08',
    lastService: '2023-02-11',
    status: 'critical',
    efficiency: -30.64,
    logs: 12,
    hasAlerts: true
  },
  {
    id: 47584,
    serialNumber: '30RBF080',
    name: 'Air-Cooled Chiller #1',
    type: 'chiller',
    manufacturer: 'Carrier',
    model: '30RBF080',
    location: {
      id: 1004,
      name: 'Simmons Bank - Beeville Branch',
      city: 'Beeville',
      state: 'Texas'
    },
    installDate: '2020-01-30',
    lastService: '2023-02-03',
    status: 'maintenance',
    efficiency: 72.59,
    logs: 3,
    hasAlerts: true
  },
  {
    id: 47303,
    serialNumber: 'CGAM-N2',
    name: 'Air-Cooled Chiller #2',
    type: 'chiller',
    manufacturer: 'Trane',
    model: 'CGAM North',
    location: {
      id: 1005,
      name: 'Office Park South',
      city: 'Corpus Christi',
      state: 'Texas'
    },
    installDate: '2019-08-12',
    lastService: '2023-01-31',
    status: 'operational',
    efficiency: 147.60,
    logs: 7,
    hasAlerts: true
  }
];

// States for filter options - placed outside component to avoid recreating on each render
const states = [
  { id: 'texas', label: 'Texas' },
  { id: 'wisconsin', label: 'Wisconsin' },
  { id: 'illinois', label: 'Illinois' },
  { id: 'district-of-columbia', label: 'District of Columbia' },
  { id: 'virginia', label: 'Virginia' },
];

// Equipment type options
const equipmentTypes = [
  { value: 'chiller', label: 'Chiller' },
  { value: 'boiler', label: 'Boiler' },
  { value: 'air-handler', label: 'Air Handler' },
  { value: 'cooling-tower', label: 'Cooling Tower' },
  { value: 'heat-exchanger', label: 'Heat Exchanger' },
];

// Status options
const statusOptions = [
  { value: 'operational', label: 'Operational' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'offline', label: 'Offline' },
  { value: 'critical', label: 'Critical' },
];

// Track render count in development
let renderCount = 0;

export default function Equipment() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [showAlerts, setShowAlerts] = useState<boolean>(false);
  
  // Log renders in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      renderCount++;
      console.log(`Equipment component rendered: ${renderCount} times`);
    }
  });
  
  // Toggle state selection - memoized to prevent recreation on each render
  const toggleState = useCallback((stateId: string) => {
    setSelectedStates(prevStates => {
      if (prevStates.includes(stateId)) {
        return prevStates.filter(id => id !== stateId);
      } else {
        return [...prevStates, stateId];
      }
    });
  }, []);

  // Set equipment type - memoized
  const handleTypeChange = useCallback((value: string) => {
    setSelectedType(value);
  }, []);

  // Set status - memoized
  const handleStatusChange = useCallback((value: string) => {
    setSelectedStatus(value);
  }, []);

  // Toggle alerts filter - memoized
  const toggleAlerts = useCallback(() => {
    setShowAlerts(prev => !prev);
  }, []);

  // Reset all filters - memoized
  const resetFilters = useCallback(() => {
    setSelectedStates([]);
    setSelectedType('');
    setSelectedStatus('');
    setShowAlerts(false);
  }, []);

  // Toggle view mode - memoized
  const toggleViewMode = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  // Filter equipment based on selected filters - memoized to prevent recalculation on every render
  const filteredEquipment = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Filtering equipment...');
    }
    
    return equipment.filter(item => {
      // If no state is selected, show all
      const stateMatch = selectedStates.length === 0 || 
                        selectedStates.includes(item.location.state.toLowerCase());
      
      // If no type is selected, show all
      const typeMatch = !selectedType || 
                        item.type === selectedType;
      
      // If no status is selected, show all
      const statusMatch = !selectedStatus || 
                        item.status === selectedStatus;
      
      // If alerts filter is on, only show equipment with alerts
      const alertsMatch = !showAlerts || item.hasAlerts;
      
      return stateMatch && typeMatch && statusMatch && alertsMatch;
    });
  }, [selectedStates, selectedType, selectedStatus, showAlerts]);

  return (
    <div className="container mx-auto p-4">
      {/* Header with Create New button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Equipment</h1>
        <Button variant="default" className="bg-purple-700 hover:bg-purple-800">
          + Create New
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <FilterSidebar
            states={states}
            selectedStates={selectedStates}
            toggleState={toggleState}
            equipmentTypes={equipmentTypes}
            selectedType={selectedType}
            setSelectedType={handleTypeChange}
            statusOptions={statusOptions}
            selectedStatus={selectedStatus}
            setSelectedStatus={handleStatusChange}
            showAlerts={showAlerts}
            toggleAlerts={toggleAlerts}
            onResetFilters={resetFilters}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* View Toggle */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">
              Showing {filteredEquipment.length} Equipment
            </span>
            <div className="border rounded-md overflow-hidden flex">
              <Button 
                variant={viewMode === 'list' ? "default" : "ghost"}
                size="sm"
                className={viewMode === 'list' ? "rounded-none bg-blue-50 text-blue-600" : "rounded-none"}
                onClick={() => toggleViewMode('list')}
              >
                <LayoutList size={18} />
              </Button>
              <Button 
                variant={viewMode === 'grid' ? "default" : "ghost"}
                size="sm"
                className={viewMode === 'grid' ? "rounded-none bg-blue-50 text-blue-600" : "rounded-none"}
                onClick={() => toggleViewMode('grid')}
              >
                <LayoutGrid size={18} />
              </Button>
            </div>
          </div>
          
          {/* List or Grid View based on selection */}
          {viewMode === 'list' ? (
            <EquipmentList equipment={filteredEquipment} />
          ) : (
            <EquipmentGrid equipment={filteredEquipment} />
          )}
        </div>
      </div>
    </div>
  );
} 