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
import { Input } from '@/components/ui/input';

interface StateFilter {
  id: string;
  label: string;
}

interface FilterSidebarProps {
  states: StateFilter[];
  selectedStates: string[];
  toggleState: (id: string) => void;
  equipmentTypes: { value: string, label: string }[];
  selectedEquipmentType: string;
  setSelectedEquipmentType: (value: string) => void;
  statusOptions: { value: string, label: string }[];
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  dateRange: {
    start: string;
    end: string;
  };
  onDateRangeChange: (type: 'start' | 'end', value: string) => void;
  onResetFilters: () => void;
}

// Track renders for debugging
let sidebarRenderCount = 0;

function FilterSidebar({
  states,
  selectedStates,
  toggleState,
  equipmentTypes,
  selectedEquipmentType,
  setSelectedEquipmentType,
  statusOptions,
  selectedStatus,
  setSelectedStatus,
  dateRange,
  onDateRangeChange,
  onResetFilters
}: FilterSidebarProps) {
  // Debug render count
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      sidebarRenderCount++;
      console.log(`LogsFilterSidebar rendered: ${sidebarRenderCount} times`);
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
          <Select value={selectedEquipmentType} onValueChange={setSelectedEquipmentType}>
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
        
        {/* Date Range */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Date Range</h3>
          <div className="space-y-2">
            <div>
              <label htmlFor="min-date" className="text-xs text-gray-500 block mb-1">Min Date</label>
              <Input
                id="min-date"
                type="date"
                value={dateRange.start}
                onChange={(e) => onDateRangeChange('start', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="max-date" className="text-xs text-gray-500 block mb-1">Max Date</label>
              <Input
                id="max-date"
                type="date"
                value={dateRange.end}
                onChange={(e) => onDateRangeChange('end', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        {/* Alert Status */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Alert Status</h3>
          <div className="flex items-center">
            <Checkbox 
              id="has-alerts" 
            />
            <label htmlFor="has-alerts" className="ml-2 text-sm">
              Has Alerts
            </label>
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