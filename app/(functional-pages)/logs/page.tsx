'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList } from 'lucide-react';
import LogsList from './components/LogsList';
import LogsGrid from './components/LogsGrid';
import FilterSidebar from './components/FilterSidebar';

// Log status types
export type LogStatus = 'pending' | 'completed' | 'failed' | 'in-progress';

// Log interface
export interface Log {
  id: number;
  equipmentId: string;
  equipmentName: string;
  location: string;
  city: string;
  state: string;
  technician: {
    name: string;
    initial: string;
  };
  date: string;
  status: LogStatus;
  efficiency: number;
  alerts: boolean;
}

// Mock data for logs - placed outside component to avoid recreating on each render
const logs: Log[] = [
  {
    id: 47683,
    equipmentId: 'FE12151',
    equipmentName: 'Hot Water Boiler',
    location: 'Navy Air Station Corpus Christi, Bldg 1828',
    city: 'Corpus Christi',
    state: 'Texas',
    technician: {
      name: 'Cliff Blair',
      initial: 'C',
    },
    date: 'FEB 25',
    status: 'pending',
    efficiency: 95.59,
    alerts: true,
  },
  {
    id: 47643,
    equipmentId: 'KCC215',
    equipmentName: 'MRI Chiller',
    location: 'KKT Chillers Inc, Radiology and Associates - Portland',
    city: 'Wood Dale',
    state: 'Illinois',
    technician: {
      name: 'Eryk Mozejko',
      initial: 'E',
    },
    date: 'FEB 12',
    status: 'pending',
    efficiency: 136.60,
    alerts: false,
  },
  {
    id: 45477,
    equipmentId: 'KKT Kraus',
    equipmentName: 'MRI Chiller',
    location: 'KKT Chillers Inc, Spohn Hospital Kleberg',
    city: 'Wood Dale',
    state: 'Illinois',
    technician: {
      name: 'Joe Castillo',
      initial: 'J',
    },
    date: 'FEB 11',
    status: 'pending',
    efficiency: -30.64,
    alerts: true,
  },
  {
    id: 47584,
    equipmentId: '30RBF080',
    equipmentName: 'Air-Cooled Chiller',
    location: 'Simmons Bank, Simmons Bank - Beeville',
    city: 'Conroe',
    state: 'Texas',
    technician: {
      name: 'Eryk Mozejko',
      initial: 'E',
    },
    date: 'FEB 3',
    status: 'pending',
    efficiency: 72.59,
    alerts: true,
  },
  {
    id: 47303,
    equipmentId: 'CGAM North',
    equipmentName: 'Air-Cooled Chiller',
    location: 'Landlord Resources, Office Park South',
    city: 'Corpus Christi',
    state: 'Texas',
    technician: {
      name: 'Eryk Mozejko',
      initial: 'E',
    },
    date: 'JAN 31',
    status: 'pending',
    efficiency: 147.60,
    alerts: true,
  },
];

// States for filter options - placed outside component to avoid recreating on each render
const states = [
  { id: 'texas', label: 'Texas' },
  { id: 'wisconsin', label: 'Wisconsin' },
  { id: 'illinois', label: 'Illinois' },
  { id: 'district-of-columbia', label: 'District of Columbia' },
  { id: 'virginia', label: 'Virginia' },
];

// Equipment types for filter options
const equipmentTypes = [
  { value: 'chiller', label: 'Chiller' },
  { value: 'boiler', label: 'Boiler' },
  { value: 'mri', label: 'MRI Equipment' },
  { value: 'hvac', label: 'HVAC System' },
  { value: 'cooling-tower', label: 'Cooling Tower' },
];

// Status options for filter
const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'in-progress', label: 'In Progress' },
];

// Track render count in development
let renderCount = 0;

export default function Logs() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<{start: string; end: string}>({
    start: '',
    end: ''
  });
  
  // Log renders in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      renderCount++;
      console.log(`Logs component rendered: ${renderCount} times`);
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
  const handleEquipmentTypeChange = useCallback((value: string) => {
    setSelectedEquipmentType(value);
  }, []);

  // Set status - memoized
  const handleStatusChange = useCallback((value: string) => {
    setSelectedStatus(value);
  }, []);

  // Update date range
  const handleDateRangeChange = useCallback((type: 'start' | 'end', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [type]: value
    }));
  }, []);

  // Reset all filters - memoized
  const resetFilters = useCallback(() => {
    setSelectedStates([]);
    setSelectedEquipmentType('');
    setSelectedStatus('');
    setDateRange({ start: '', end: '' });
  }, []);

  // Toggle view mode - memoized
  const toggleViewMode = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  // Filter logs based on selected filters - memoized to prevent recalculation on every render
  const filteredLogs = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Filtering logs...');
    }
    
    return logs.filter(log => {
      // If no state is selected, show all
      const stateMatch = selectedStates.length === 0 || 
                        selectedStates.includes(log.state.toLowerCase());
      
      // If no equipment type is selected, show all
      const equipmentMatch = !selectedEquipmentType || 
                        log.equipmentName.toLowerCase().includes(selectedEquipmentType.replace(/-/g, ' '));
      
      // If no status is selected, show all
      const statusMatch = !selectedStatus || 
                        log.status === selectedStatus;
                        
      // Date range filtering logic could be added here
      
      return stateMatch && equipmentMatch && statusMatch;
    });
  }, [selectedStates, selectedEquipmentType, selectedStatus]);

  return (
    <div className="container mx-auto p-4">
      {/* Header with Create New button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Logs</h1>
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
            selectedEquipmentType={selectedEquipmentType}
            setSelectedEquipmentType={handleEquipmentTypeChange}
            statusOptions={statusOptions}
            selectedStatus={selectedStatus}
            setSelectedStatus={handleStatusChange}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            onResetFilters={resetFilters}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* View Toggle */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">
              Showing {filteredLogs.length} Logs
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
            <LogsList logs={filteredLogs} />
          ) : (
            <LogsGrid logs={filteredLogs} />
          )}
        </div>
      </div>
    </div>
  );
} 