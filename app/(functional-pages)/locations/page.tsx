'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList } from 'lucide-react';
import LocationsList from './components/LocationsList';
import LocationsGrid from './components/LocationsGrid';
import FilterSidebar from './components/FilterSidebar';

// Location status types
export type LocationStatus = 'active' | 'inactive' | 'maintenance';

// Location interface
export interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  customer: {
    name: string;
    id: number;
  };
  equipmentCount: number;
  technicians: number;
  status: LocationStatus;
  lastService: string;
}

// Mock data for locations - placed outside component to avoid recreating on each render
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
    name: 'Portland Medical Center',
    address: '1601 Wildcat Drive',
    city: 'Portland',
    state: 'Texas',
    zip: '78374',
    customer: {
      name: 'KKT Chillers Inc',
      id: 203
    },
    equipmentCount: 2,
    technicians: 1,
    status: 'active',
    lastService: '2023-02-12',
  },
  {
    id: 1003,
    name: 'Spohn Hospital Kleberg',
    address: '1311 East General Cavazos Blvd',
    city: 'Kingsville',
    state: 'Texas',
    zip: '78363',
    customer: {
      name: 'Christus Spohn Health',
      id: 157
    },
    equipmentCount: 3,
    technicians: 1,
    status: 'maintenance',
    lastService: '2023-02-11',
  },
  {
    id: 1004,
    name: 'Simmons Bank - Beeville Branch',
    address: '1400 East Houston',
    city: 'Beeville',
    state: 'Texas',
    zip: '78102',
    customer: {
      name: 'Simmons Bank',
      id: 342
    },
    equipmentCount: 1,
    technicians: 1,
    status: 'active',
    lastService: '2023-02-03',
  },
  {
    id: 1005,
    name: 'Office Park South',
    address: '5959 South Staples Street',
    city: 'Corpus Christi',
    state: 'Texas',
    zip: '78413',
    customer: {
      name: 'Landlord Resources',
      id: 276
    },
    equipmentCount: 4,
    technicians: 2,
    status: 'inactive',
    lastService: '2023-01-31',
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

// Cities for filter options
const cities = [
  { value: 'corpus-christi', label: 'Corpus Christi' },
  { value: 'portland', label: 'Portland' },
  { value: 'kingsville', label: 'Kingsville' },
  { value: 'beeville', label: 'Beeville' },
];

// Status options for filter
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'maintenance', label: 'Maintenance' },
];

// Track render count in development
let renderCount = 0;

export default function Locations() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  
  // Log renders in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      renderCount++;
      console.log(`Locations component rendered: ${renderCount} times`);
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

  // Set city value - memoized
  const handleCityChange = useCallback((value: string) => {
    setSelectedCity(value);
  }, []);

  // Set status value - memoized
  const handleStatusChange = useCallback((value: string) => {
    setSelectedStatus(value);
  }, []);

  // Reset all filters - memoized
  const resetFilters = useCallback(() => {
    setSelectedStates([]);
    setSelectedCity('');
    setSelectedStatus('');
  }, []);

  // Toggle view mode - memoized
  const toggleViewMode = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  // Filter locations based on selected filters - memoized to prevent recalculation on every render
  const filteredLocations = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Filtering locations...');
    }
    
    return locations.filter(location => {
      // If no state is selected, show all
      const stateMatch = selectedStates.length === 0 || 
                        selectedStates.includes(location.state.toLowerCase());
      
      // If no city is selected, show all
      const cityMatch = !selectedCity || 
                        location.city.toLowerCase() === selectedCity.replace(/-/g, ' ');
      
      // If no status is selected, show all
      const statusMatch = !selectedStatus || 
                        location.status === selectedStatus;
      
      return stateMatch && cityMatch && statusMatch;
    });
  }, [selectedStates, selectedCity, selectedStatus]);

  return (
    <div className="container mx-auto p-4">
      {/* Header with Create New button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Locations</h1>
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
            cities={cities}
            selectedCity={selectedCity}
            setSelectedCity={handleCityChange}
            statusOptions={statusOptions}
            selectedStatus={selectedStatus}
            setSelectedStatus={handleStatusChange}
            onResetFilters={resetFilters}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* View Toggle */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">
              Showing {filteredLocations.length} Locations
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
            <LocationsList locations={filteredLocations} />
          ) : (
            <LocationsGrid locations={filteredLocations} />
          )}
        </div>
      </div>
    </div>
  );
} 