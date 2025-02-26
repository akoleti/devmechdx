'use client';

import { memo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Building,
  MapPin,
  Users,
  Wrench,
  Settings,
  Eye,
  EyeOff,
  Calendar,
} from 'lucide-react';
import { Location } from '../page';
import Link from 'next/link';

interface LocationsGridProps {
  locations: Location[];
}

// Track renders for debugging
let gridRenderCount = 0;

function LocationsGrid({ locations }: LocationsGridProps) {
  // Debug render count
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      gridRenderCount++;
      console.log(`LocationsGrid rendered: ${gridRenderCount} times with ${locations.length} locations`);
    }
  });

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'maintenance':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {locations.map(location => (
        <Card key={location.id} className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            {/* Top row with location name and action icons */}
            <div className="flex justify-between items-center mb-3">
              <Link href={`/locations/${location.id}`} className="text-lg font-semibold text-blue-600 truncate pr-2 hover:text-blue-800 hover:underline">
                {location.name}
              </Link>
              
              {/* Action Icons */}
              <div className="flex space-x-2 shrink-0">
                <button className="text-gray-500 hover:text-gray-700" aria-label="Settings">
                  <Settings size={16} />
                </button>
                <button className="text-gray-500 hover:text-gray-700" aria-label="Toggle visibility">
                  <Eye size={16} />
                </button>
              </div>
            </div>
            
            {/* Address Info */}
            <div className="text-sm text-gray-600 mb-3">
              <div className="flex items-center mb-1">
                <MapPin size={14} className="mr-1 text-gray-400 shrink-0" />
                <span className="truncate">{location.address}</span>
              </div>
              <p>{location.city}, {location.state}, {location.zip}</p>
            </div>
            
            {/* Customer Info */}
            <div className="text-sm text-gray-600 mb-3">
              <div className="flex items-center">
                <Building size={14} className="mr-1 text-gray-400 shrink-0" />
                <span className="truncate">Customer: {location.customer.name}</span>
              </div>
            </div>
            
            {/* Status and Last Service */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <Calendar size={14} className="text-gray-500 mr-1" />
                <span className="text-xs text-gray-600">
                  {new Date(location.lastService).toLocaleDateString()}
                </span>
              </div>
              
              <div className={`px-3 py-1 rounded-md text-white text-xs ${getStatusColor(location.status)}`}>
                {location.status.charAt(0).toUpperCase() + location.status.slice(1)}
              </div>
            </div>
            
            {/* Bottom section with stats */}
            <div className="flex justify-between items-center border-t pt-3">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 mr-2">
                  <Wrench size={14} className="text-blue-500" />
                </div>
                <div className="text-center">
                  <span className="block text-sm font-semibold">{location.equipmentCount}</span>
                  <span className="block text-xs text-gray-500">Equipments</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-100 mr-2">
                  <Users size={14} className="text-purple-500" />
                </div>
                <div className="text-center">
                  <span className="block text-sm font-semibold">{location.technicians}</span>
                  <span className="block text-xs text-gray-500">Technicians</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Use memo to prevent unnecessary re-renders
export default memo(LocationsGrid); 