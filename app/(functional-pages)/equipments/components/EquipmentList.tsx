'use client';

import { memo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  HardDrive,
  AlertTriangle,
  Settings,
  Eye,
  EyeOff,
  Calendar,
  FileText,
  Building,
  Percent,
} from 'lucide-react';
import { Equipment } from '../page';
import Link from 'next/link';

interface EquipmentListProps {
  equipment: Equipment[];
}

// Track renders for debugging
let listRenderCount = 0;

function EquipmentList({ equipment }: EquipmentListProps) {
  // Debug render count
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      listRenderCount++;
      console.log(`EquipmentList rendered: ${listRenderCount} times with ${equipment.length} equipment items`);
    }
  });

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Helper function to get efficiency color
  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency < 0) return 'text-red-500';
    if (efficiency > 100) return 'text-orange-500';
    return 'text-gray-700';
  };

  return (
    <div className="space-y-4">
      {equipment.map(item => (
        <Card key={item.id} className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            {/* Top row with equipment name and action icons */}
            <div className="flex justify-between items-center mb-3 w-full">
              <Link 
                href={`/equipments/${item.id}`} 
                className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                {item.name}
              </Link>
              
              {/* Action Icons at the absolute far right */}
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-gray-700" aria-label="Settings">
                  <Settings size={16} />
                </button>
                <button className="text-gray-500 hover:text-gray-700" aria-label="Toggle visibility">
                  <Eye size={16} />
                </button>
              </div>
            </div>
            
            {/* Equipment Info */}
            <div className="text-sm text-gray-600 mb-3">
              <div className="flex items-center mb-1">
                <HardDrive size={14} className="mr-1 text-gray-400" />
                <span>{item.manufacturer} {item.model} (SN: {item.serialNumber})</span>
              </div>
              <div className="flex items-center mb-1">
                <Building size={14} className="mr-1 text-gray-400" />
                <span>{item.location.name}, {item.location.city}, {item.location.state}</span>
              </div>
            </div>
            
            {/* Bottom section with stats and status */}
            <div className="flex flex-col md:flex-row justify-between items-center border-t pt-3">
              {/* ID and dates */}
              <div className="text-gray-700 font-medium">
                #{item.id}
                <div className="flex items-center mt-1">
                  <Calendar size={14} className="text-gray-500 mr-1" />
                  <span className="text-xs text-gray-600">
                    Installed: {new Date(item.installDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center mt-1">
                  <Calendar size={14} className="text-gray-500 mr-1" />
                  <span className="text-xs text-gray-600">
                    Last Service: {new Date(item.lastService).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {/* Logs count */}
              <div className="flex items-center mt-3 md:mt-0">
                <div className="p-2 rounded-full bg-blue-100 mr-2">
                  <FileText size={14} className="text-blue-500" />
                </div>
                <div className="text-center">
                  <span className="block text-sm font-semibold">{item.logs}</span>
                  <span className="block text-xs text-gray-500">Logs</span>
                </div>
              </div>
              
              {/* Efficiency */}
              <div className="mt-3 md:mt-0 flex items-center">
                <Percent size={14} className={`mr-1 ${getEfficiencyColor(item.efficiency)}`} />
                <span className={`text-sm font-semibold ${getEfficiencyColor(item.efficiency)}`}>
                  {item.efficiency.toFixed(2)}%
                </span>
              </div>
              
              {/* Status and Alerts */}
              <div className="flex items-center mt-3 md:mt-0 space-x-3">
                <div className={`px-3 py-1 rounded-md text-white text-sm ${getStatusColor(item.status)}`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </div>
                
                {item.hasAlerts && (
                  <div>
                    <AlertTriangle 
                      size={20} 
                      className={item.efficiency < 0 ? "text-red-500" : "text-yellow-500"}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Use memo to prevent unnecessary re-renders
export default memo(EquipmentList); 