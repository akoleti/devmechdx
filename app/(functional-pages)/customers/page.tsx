'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList } from 'lucide-react';
import CustomersList, { Customer } from './components/CustomersList';
import CustomersGrid from './components/CustomersGrid';
import FilterSidebar, { StateFilter } from './components/FilterSidebar';

// Mock data for customers - placed outside component to avoid recreating on each render
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

// States for filter options - placed outside component to avoid recreating on each render
const states: StateFilter[] = [
  { id: 'texas', label: 'Texas' },
  { id: 'wisconsin', label: 'Wisconsin' },
  { id: 'illinois', label: 'Illinois' },
  { id: 'district-of-columbia', label: 'District of Columbia' },
  { id: 'virginia', label: 'Virginia' },
];

// Cities for filter options - placed outside component to avoid recreating on each render
const cities = [
  { value: 'corpus-christi', label: 'Corpus Christi' },
  { value: 'alice', label: 'Alice' },
  { value: 'rockport', label: 'Rockport' },
];

// Names for filter options - placed outside component to avoid recreating on each render
const names = [
  { value: 'alice-isd', label: 'Alice ISD' },
  { value: 'aransas-county-isd', label: 'Aransas County ISD' },
  { value: 'bay-area-medical', label: 'Bay Area Medical Center' },
  { value: 'bel-furniture', label: 'Bel Furniture' },
  { value: 'best-western-marina-hotel', label: 'Best Western Marina Hotel' },
];

// Track render count in development
let renderCount = 0;

export default function Customers() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedName, setSelectedName] = useState<string>('');
  
  // Log renders in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      renderCount++;
      console.log(`Customers component rendered: ${renderCount} times`);
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

  // Set name value - memoized
  const handleNameChange = useCallback((value: string) => {
    setSelectedName(value);
  }, []);

  // Reset all filters - memoized
  const resetFilters = useCallback(() => {
    setSelectedStates([]);
    setSelectedCity('');
    setSelectedName('');
  }, []);

  // Toggle view mode - memoized
  const toggleViewMode = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  // Filter customers based on selected filters - memoized to prevent recalculation on every render
  const filteredCustomers = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Filtering customers...');
    }
    
    return customers.filter(customer => {
      // If no state is selected, show all
      const stateMatch = selectedStates.length === 0 || 
                        selectedStates.includes(customer.state.toLowerCase());
      
      // If no city is selected, show all
      const cityMatch = !selectedCity || 
                        customer.city.toLowerCase() === selectedCity.replace(/-/g, ' ');
      
      // If no name is selected, show all
      const nameMatch = !selectedName || 
                        customer.name.toLowerCase().includes(selectedName.replace(/-/g, ' '));
      
      return stateMatch && cityMatch && nameMatch;
    });
  }, [selectedStates, selectedCity, selectedName]);

  return (
    <div className="container mx-auto p-4">
      {/* Header with Create New button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
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
            selectedCity={selectedCity}
            setSelectedCity={handleCityChange}
            selectedName={selectedName}
            setSelectedName={handleNameChange}
            cities={cities}
            names={names}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* View Toggle */}
          <div className="flex justify-end mb-4">
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
          
          {/* Customer Cards */}
          {viewMode === 'list' ? (
            <CustomersList customers={filteredCustomers} />
          ) : (
            <CustomersGrid customers={filteredCustomers} />
          )}
          
          {/* Show message if no customers match filters */}
          {filteredCustomers.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No customers match your filter criteria.</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={resetFilters}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 