'use client';

import { memo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface StateFilter {
  id: string;
  label: string;
}

interface FilterSidebarProps {
  states: StateFilter[];
  selectedStates: string[];
  toggleState: (id: string) => void;
  cities: { value: string, label: string }[];
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  statusOptions: { value: string, label: string }[];
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  onResetFilters: () => void;
}

// Track renders for debugging
let sidebarRenderCount = 0;

function FilterSidebar({
  states,
  selectedStates,
  toggleState,
  cities,
  selectedCity,
  setSelectedCity,
  statusOptions,
  selectedStatus,
  setSelectedStatus,
  onResetFilters
}: FilterSidebarProps) {
  // Debug render count
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      sidebarRenderCount++;
      console.log(`LocationsFilterSidebar rendered: ${sidebarRenderCount} times`);
    }
  });

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        
        {/* State Filters */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">State</h3>
          <div className="space-y-2">
            {states.map(state => (
              <div key={state.id} className="flex items-center">
                <Checkbox 
                  id={state.id} 
                  checked={selectedStates.includes(state.id)}
                  onCheckedChange={() => toggleState(state.id)}
                />
                <label htmlFor={state.id} className="ml-2 text-sm">
                  {state.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* City Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">City</h3>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city.value} value={city.value}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Status Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Status</h3>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Equipment Count Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Equipment Count</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox id="has-equipment" />
              <label htmlFor="has-equipment" className="ml-2 text-sm">
                Has Equipment
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox id="multiple-equipment" />
              <label htmlFor="multiple-equipment" className="ml-2 text-sm">
                Multiple Equipment (2+)
              </label>
            </div>
          </div>
        </div>
        
        {/* Reset Button */}
        <Button 
          variant="outline" 
          onClick={onResetFilters}
          className="w-full"
        >
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
}

// Use memo to prevent unnecessary re-renders
export default memo(FilterSidebar); 