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

interface LogsListProps {
  logs: Log[];
}

// Track renders for debugging
let listRenderCount = 0;

function LogsList({ logs }: LogsListProps) {
  // Debug render count
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      listRenderCount++;
      console.log(`LogsList rendered: ${listRenderCount} times with ${logs.length} logs`);
    }
  });

  return (
    <div className="space-y-4">
      {logs.map(log => (
        <Card key={log.id} className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            {/* Top row with equipment name and action icons */}
            <div className="flex justify-between items-center mb-3 w-full">
              <Link 
                href={`/logs/${log.id}`} 
                className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                {log.equipmentName} - {log.equipmentId} {log.equipmentName} #{log.equipmentId.slice(-1)}
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
            
            {/* Location Info */}
            <div className="text-sm text-gray-600 mb-3">
              <p>{log.location}</p>
              <p>{log.city}, {log.state}</p>
            </div>
            
            {/* Bottom section with ID, technician, efficiency, status */}
            <div className="flex flex-col md:flex-row justify-between items-center border-t pt-3">
              {/* ID and Date */}
              <div className="text-gray-700 font-medium">
                {log.id}
                <div className="text-xs text-gray-500">{log.date}</div>
              </div>
              
              {/* Technician */}
              <div className="flex items-center mt-2 md:mt-0">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white mr-3">
                  {log.technician.initial}
                </div>
                <span className="text-sm text-gray-600 uppercase">{log.technician.name}</span>
              </div>
              
              {/* Efficiency */}
              <div className="mt-2 md:mt-0 px-3 py-1 rounded-md text-white font-medium" 
                style={{ 
                  backgroundColor: 
                    log.efficiency > 100 ? '#fd7e14' : 
                    log.efficiency > 0 ? '#6c757d' : 
                    '#dc3545'
                }}>
                {log.efficiency.toFixed(2)}%
              </div>
              
              {/* Status */}
              <div className="mt-2 md:mt-0 bg-orange-500 text-white px-3 py-1 rounded-md">
                {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
              </div>
              
              {/* Alert Indicator */}
              {log.alerts && (
                <div className="mt-2 md:mt-0">
                  <AlertTriangle 
                    size={24} 
                    className={log.efficiency < 0 ? "text-red-500" : "text-blue-400"}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Use memo to prevent unnecessary re-renders
export default memo(LogsList); 