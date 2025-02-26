'use client';

import { memo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Building,
  FileText,
  HardDrive,
  Settings,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Customer } from './CustomersList';
import Link from 'next/link';

interface CustomersGridProps {
  customers: Customer[];
}

// Track renders for debugging
let gridRenderCount = 0;

function CustomersGrid({ customers }: CustomersGridProps) {
  // Debug render count
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      gridRenderCount++;
      console.log(`CustomersGrid rendered: ${gridRenderCount} times with ${customers.length} customers`);
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {customers.map(customer => (
        <Card key={customer.id} className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <Link href={`/customers/${customer.id}`} className="text-lg font-semibold text-blue-600 hover:underline">
                {customer.name}
              </Link>
              
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-gray-700" aria-label="Settings">
                  <Settings size={16} />
                </button>
                <button className="text-gray-500 hover:text-gray-700" aria-label="Toggle visibility">
                  {customer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              <p>{customer.address}</p>
              <p>{customer.city}, {customer.state}, {customer.zip}</p>
            </div>
            
            <div className="flex justify-between items-center border-t pt-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-2">
                  {customer.contact.initial}
                </div>
                <span className="text-sm text-gray-600">{customer.contact.name}</span>
              </div>
              
              <div className="flex space-x-3">
                <div className="flex items-center">
                  <Building size={14} className="text-green-500 mr-1" />
                  <span className="text-xs font-medium">{customer.stats.locations}</span>
                </div>
                
                <div className="flex items-center">
                  <HardDrive size={14} className="text-blue-500 mr-1" />
                  <span className="text-xs font-medium">{customer.stats.equipments}</span>
                </div>
                
                <div className="flex items-center">
                  <FileText size={14} className="text-red-500 mr-1" />
                  <span className="text-xs font-medium">{customer.stats.logs}</span>
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
export default memo(CustomersGrid); 