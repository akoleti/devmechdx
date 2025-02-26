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
import { AlertTriangle } from 'lucide-react';

interface StateFilter {
  id: string;
  label: string;
}

interface FilterSidebarProps {
  states: StateFilter[];
  selectedStates: string[];
  toggleState: (id: string) => void;
  equipmentTypes: { value: string, label: string }[];
  selectedType: string;
  setSelectedType: (value: string) => void;
  statusOptions: { value: string, label: string }[];
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  showAlerts: boolean;
  toggleAlerts: () => void;
  onResetFilters: () => void;
}

// Track renders for debugging
let sidebarRenderCount = 0;

function FilterSidebar({
  states,
  selectedStates,
  toggleState,
  equipmentTypes,
  selectedType,
  setSelectedType,
  statusOptions,
  selectedStatus,
  setSelectedStatus,
  showAlerts,
  toggleAlerts,
  onResetFilters
}: FilterSidebarProps) {
  // Debug render count
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      sidebarRenderCount++;
      console.log(`EquipmentFilterSidebar rendered: ${sidebarRenderCount} times`);
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
        
        {/* Equipment Type Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Equipment Type</h3>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select equipment type" />
            </SelectTrigger>
            <SelectContent>
              {equipmentTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
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
        
        {/* Alerts Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Alerts</h3>
          <div className="flex items-center">
            <Checkbox 
              id="show-alerts" 
              checked={showAlerts}
              onCheckedChange={toggleAlerts}
            />
            <label htmlFor="show-alerts" className="ml-2 text-sm flex items-center">
              Show only with alerts
              <AlertTriangle size={14} className="ml-1 text-yellow-500" />
            </label>
          </div>
        </div>
        
        {/* Efficiency Range - Could be expanded with a slider */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Efficiency</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox id="efficiency-critical" />
              <label htmlFor="efficiency-critical" className="ml-2 text-sm text-red-500">
                Critical (&lt;0%)
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox id="efficiency-normal" />
              <label htmlFor="efficiency-normal" className="ml-2 text-sm text-gray-700">
                Normal (0-100%)
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox id="efficiency-high" />
              <label htmlFor="efficiency-high" className="ml-2 text-sm text-orange-500">
                High (&gt;100%)
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