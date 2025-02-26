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

interface EquipmentGridProps {
  equipment: Equipment[];
}

// Track renders for debugging
let gridRenderCount = 0;

function EquipmentGrid({ equipment }: EquipmentGridProps) {
  // Debug render count
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      gridRenderCount++;
      console.log(`EquipmentGrid rendered: ${gridRenderCount} times with ${equipment.length} equipment items`);
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {equipment.map(item => (
        <Card key={item.id} className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            {/* Top row with equipment name and action icons */}
            <div className="flex justify-between items-center mb-3">
              <Link 
                href={`/equipments/${item.id}`} 
                className="text-lg font-semibold text-blue-600 truncate pr-2 hover:text-blue-800 hover:underline"
              >
                {item.name}
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
            
            {/* Equipment Info */}
            <div className="text-sm text-gray-600 mb-3">
              <div className="flex items-center mb-1">
                <HardDrive size={14} className="mr-1 text-gray-400 shrink-0" />
                <span className="truncate">{item.manufacturer} {item.model}</span>
              </div>
              <div className="flex items-center">
                <Building size={14} className="mr-1 text-gray-400 shrink-0" />
                <span className="truncate">{item.location.name}</span>
              </div>
            </div>
            
            {/* ID, status and alert */}
            <div className="flex justify-between items-center mb-3">
              <div className="text-sm text-gray-700">
                #{item.id}
                <div className="text-xs text-gray-500">SN: {item.serialNumber}</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-md text-white text-xs ${getStatusColor(item.status)}`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </div>
                {item.hasAlerts && (
                  <AlertTriangle 
                    size={16} 
                    className={item.efficiency < 0 ? "text-red-500" : "text-yellow-500"}
                  />
                )}
              </div>
            </div>
            
            {/* Dates */}
            <div className="flex justify-between text-xs text-gray-500 mb-3">
              <div className="flex items-center">
                <Calendar size={12} className="mr-1" />
                <span>Installed: {new Date(item.installDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={12} className="mr-1" />
                <span>Service: {new Date(item.lastService).toLocaleDateString()}</span>
              </div>
            </div>
            
            {/* Bottom section with stats */}
            <div className="flex justify-between items-center border-t pt-3">
              {/* Logs count */}
              <div className="flex items-center">
                <FileText size={14} className="text-blue-500 mr-1" />
                <span className="text-xs font-medium">{item.logs} Logs</span>
              </div>
              
              {/* Efficiency */}
              <div className="flex items-center">
                <Percent size={14} className={getEfficiencyColor(item.efficiency)} />
                <span className={`text-xs font-medium ${getEfficiencyColor(item.efficiency)}`}>
                  {item.efficiency.toFixed(2)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Use memo to prevent unnecessary re-renders
export default memo(EquipmentGrid); 