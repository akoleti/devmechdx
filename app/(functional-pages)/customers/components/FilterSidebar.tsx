'use client';

import { memo, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface StateFilter {
  id: string;
  label: string;
}

interface FilterSidebarProps {
  states: StateFilter[];
  selectedStates: string[];
  toggleState: (id: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  selectedName: string;
  setSelectedName: (value: string) => void;
  cities: { value: string, label: string }[];
  names: { value: string, label: string }[];
}

// Track renders for debugging
let sidebarRenderCount = 0;

function FilterSidebar({
  states,
  selectedStates,
  toggleState,
  selectedCity,
  setSelectedCity,
  selectedName,
  setSelectedName,
  cities,
  names
}: FilterSidebarProps) {
  // Debug render count
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      sidebarRenderCount++;
      console.log(`FilterSidebar rendered: ${sidebarRenderCount} times`);
    }
  });

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Filter Component</h2>
        
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
        
        {/* Name Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Name</h3>
          <Select value={selectedName} onValueChange={setSelectedName}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select name" />
            </SelectTrigger>
            <SelectContent>
              {names.map(name => (
                <SelectItem key={name.value} value={name.value}>
                  {name.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

// Use memo to prevent unnecessary re-renders
export default memo(FilterSidebar); 