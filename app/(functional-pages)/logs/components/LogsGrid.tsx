'use client';

import { memo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  FileText,
  AlertTriangle,
  Settings,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Log } from '../page';
import Link from 'next/link';

interface LogsGridProps {
  logs: Log[];
}

// Track renders for debugging
let gridRenderCount = 0;

function LogsGrid({ logs }: LogsGridProps) {
  // Debug render count
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      gridRenderCount++;
      console.log(`LogsGrid rendered: ${gridRenderCount} times with ${logs.length} logs`);
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {logs.map(log => (
        <Card key={log.id} className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            {/* Top row with equipment name and action icons */}
            <div className="flex justify-between items-center mb-3">
              <Link 
                href={`/logs/${log.id}`} 
                className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline truncate"
              >
                {log.equipmentName} - {log.equipmentId}
              </Link>
              
              {/* Action Icons */}
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-gray-700" aria-label="Settings">
                  <Settings size={16} />
                </button>
                <button className="text-gray-500 hover:text-gray-700" aria-label="Toggle visibility">
                  <Eye size={16} />
                </button>
              </div>
            </div>
            
            {/* Location Info */}
            <div className="text-sm text-gray-600 mb-4">
              <p className="truncate">{log.location}</p>
              <p>{log.city}, {log.state}</p>
            </div>
            
            {/* ID and Date */}
            <div className="flex justify-between items-center mb-3">
              <div className="text-gray-700 font-medium">
                {log.id}
                <div className="text-xs text-gray-500">{log.date}</div>
              </div>
              
              {/* Status */}
              <div className="bg-orange-500 text-white px-3 py-1 text-sm rounded-md">
                {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
              </div>
            </div>
            
            {/* Bottom section with technician and efficiency */}
            <div className="flex justify-between items-center border-t pt-3">
              {/* Technician */}
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white mr-2">
                  {log.technician.initial}
                </div>
                <span className="text-sm text-gray-600">{log.technician.name}</span>
              </div>
              
              {/* Right section with efficiency and alert */}
              <div className="flex items-center">
                <div className="px-3 py-1 rounded-md text-white text-sm font-medium mr-2" 
                  style={{ 
                    backgroundColor: 
                      log.efficiency > 100 ? '#fd7e14' : 
                      log.efficiency > 0 ? '#6c757d' : 
                      '#dc3545'
                  }}>
                  {log.efficiency.toFixed(2)}%
                </div>
                
                {/* Alert Indicator */}
                {log.alerts && (
                  <AlertTriangle 
                    size={20} 
                    className={log.efficiency < 0 ? "text-red-500" : "text-blue-400"}
                  />
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
export default memo(LogsGrid); 