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

interface CustomerStats {
  locations: number;
  equipments: number;
  logs: number;
}

interface CustomerContact {
  name: string;
  initial: string;
}

export interface Customer {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  contact: CustomerContact;
  stats: CustomerStats;
  visible: boolean;
}

interface CustomersListProps {
  customers: Customer[];
}

// Track renders for debugging
let listRenderCount = 0;

function CustomersList({ customers }: CustomersListProps) {
  // Debug render count
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      listRenderCount++;
      console.log(`CustomersList rendered: ${listRenderCount} times with ${customers.length} customers`);
    }
  });

  return (
    <div className="space-y-4">
      {customers.map(customer => (
        <Card key={customer.id} className="border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            {/* Top row with name and action icons */}
            <div className="flex justify-between items-center mb-3 w-full">
              <h3 className="text-lg font-semibold text-blue-600">{customer.name}</h3>
              
              {/* Action Icons at the absolute far right */}
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-gray-700" aria-label="Settings">
                  <Settings size={16} />
                </button>
                <button className="text-gray-500 hover:text-gray-700" aria-label="Toggle visibility">
                  {customer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>
            
            {/* Rest of the content */}
            <div className="flex flex-col md:flex-row justify-between">
              {/* Customer Info */}
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  {customer.address}
                </p>
                <p className="text-sm text-gray-600">
                  {customer.city}, {customer.state}, {customer.zip}
                </p>
              </div>
              
              {/* Contact Info */}
              <div className="mt-4 md:mt-0 flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-3">
                  {customer.contact.initial}
                </div>
                <span className="text-sm text-gray-600">{customer.contact.name}</span>
              </div>
              
              {/* Stats */}
              <div className="mt-4 md:mt-0 flex items-center space-x-4 md:ml-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 mr-2">
                    <Building size={16} className="text-green-500" />
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-semibold">{customer.stats.locations}</span>
                    <span className="block text-xs text-gray-500">Locations</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-2">
                    <HardDrive size={16} className="text-blue-500" />
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-semibold">{customer.stats.equipments}</span>
                    <span className="block text-xs text-gray-500">Equipments</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-red-100 mr-2">
                    <FileText size={16} className="text-red-500" />
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-semibold">{customer.stats.logs}</span>
                    <span className="block text-xs text-gray-500">Logs</span>
                  </div>
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
export default memo(CustomersList); 