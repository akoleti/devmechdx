'use client';

import { useState, use } from 'react';
import { Customer } from '../../components/CustomersList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock customer data - in a real app this would come from an API
const customers: Customer[] = [
  {
    id: 1,
    name: 'Alice ISD',
    address: '1 COYOTE TRL',
    city: 'Alice',
    state: 'Texas',
    zip: '78332',
    contact: {
      name: 'Michael Hinojosa',
      initial: 'M',
    },
    stats: {
      locations: 1,
      equipments: 5,
      logs: 6,
    },
    visible: true,
  },
  {
    id: 2,
    name: 'Aransas County ISD',
    address: 'P.O. Box 907',
    city: 'Rockport',
    state: 'Texas',
    zip: '78382',
    contact: {
      name: 'Thomas Lawing',
      initial: 'T',
    },
    stats: {
      locations: 2,
      equipments: 3,
      logs: 0,
    },
    visible: true,
  },
  // Additional customers here...
];

// Tabs for the settings page
const settingsTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'locations', label: 'Locations' },
  { id: 'access', label: 'Access Management' },
  { id: 'advanced', label: 'Advanced' },
];

export default function CustomerSettings({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Unwrap params with React.use() to handle both current and future Next.js behavior
  const unwrappedParams = params instanceof Promise ? use(params) : params;
  const customerId = parseInt(unwrappedParams.id);
  
  const [customer, setCustomer] = useState<Customer | null>(
    customers.find(c => c.id === customerId) || null
  );
  
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    organizationName: customer?.name || '',
    address: customer?.address || '',
    city: customer?.city || '',
    state: customer?.state || '',
    zip: customer?.zip || '',
    hoursPerDay: '24',
    daysPerYear: '365',
    costPerKwh: '0.12',
    costPer1000Btu: '5',
    costPer1000Gallons: '9.3'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!customer) {
    return <div className="container mx-auto p-4">Customer not found</div>;
  }

  return (
    <div className="bg-white container mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 px-4 md:px-6 pt-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Customer Settings</h1>
          <p className="text-gray-600">{customer.name}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="bg-indigo-700 hover:bg-indigo-800 text-white"
            onClick={() => window.history.back()}
          >
            CLOSE <X className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Left sidebar */}
        <div className="w-full md:w-64 md:flex-shrink-0">
          <div className="px-6 py-4">
            {settingsTabs.map(tab => (
              <button
                key={tab.id}
                className={cn(
                  "w-full text-left py-3 px-4 rounded mb-2 font-medium",
                  activeTab === tab.id 
                    ? "bg-red-600 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 px-6 py-4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">General Information</h2>
                <p className="text-gray-600 text-sm mb-4">
                  This information will appear to Vendors when sharing or viewing equipment and logs, and will be provided as the top-level information for reports.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Organization Name</label>
                    <Input 
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Address</label>
                    <Input 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">City</label>
                    <Input 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">State</label>
                    <Input 
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">ZIP</label>
                    <Input 
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Analysis Metadata Defaults</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Analysis Metadata is used for calculating Inefficiency Costs on the customer dashboard. This information is used as the defaults for the organization, but can be overridden by individual locations.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Hours Per Day Running Equipment</label>
                    <Input 
                      name="hoursPerDay"
                      value={formData.hoursPerDay}
                      onChange={handleInputChange}
                      className="w-full"
                      type="number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Days Per Year Running Equipment</label>
                    <Input 
                      name="daysPerYear"
                      value={formData.daysPerYear}
                      onChange={handleInputChange}
                      className="w-full"
                      type="number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Cost per Kilowatt Hour</label>
                    <Input 
                      name="costPerKwh"
                      value={formData.costPerKwh}
                      onChange={handleInputChange}
                      className="w-full"
                      type="number"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Cost Per 1,000 BTU of Gas</label>
                    <Input 
                      name="costPer1000Btu"
                      value={formData.costPer1000Btu}
                      onChange={handleInputChange}
                      className="w-full"
                      type="number"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Cost Per 1,000 Gallons of Water</label>
                    <Input 
                      name="costPer1000Gallons"
                      value={formData.costPer1000Gallons}
                      onChange={handleInputChange}
                      className="w-full"
                      type="number"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Contacts</h2>
              <p className="text-gray-600 mb-4">Manage contacts associated with this customer.</p>
              
              <Card className="p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{customer.contact.name}</h3>
                    <p className="text-sm text-gray-500">Primary Contact</p>
                  </div>
                  <Button variant="outline">Edit</Button>
                </div>
              </Card>
              
              <Button className="mt-4">+ Add New Contact</Button>
            </div>
          )}

          {/* Locations Tab */}
          {activeTab === 'locations' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Locations</h2>
              <p className="text-gray-600 mb-4">Manage locations associated with this customer.</p>
              
              <div className="space-y-4">
                {Array.from({ length: customer.stats.locations }).map((_, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{customer.name} - Location {index + 1}</h3>
                        <p className="text-sm text-gray-500">{customer.address}, {customer.city}, {customer.state} {customer.zip}</p>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline">View</Button>
                        <Button variant="outline">Edit</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <Button className="mt-4">+ Add New Location</Button>
            </div>
          )}

          {/* Access Management Tab */}
          {activeTab === 'access' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Access Management</h2>
              <p className="text-gray-600 mb-4">Manage who can access this customer's information.</p>
              
              <Card className="p-4 mb-4">
                <h3 className="font-medium mb-4">Current Users with Access</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">Admin User</p>
                      <p className="text-sm text-gray-500">admin@example.com</p>
                    </div>
                    <div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Administrator</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">Technician User</p>
                      <p className="text-sm text-gray-500">tech@example.com</p>
                    </div>
                    <div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Technician</span>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Button className="mt-4">+ Add User Access</Button>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Advanced Settings</h2>
              <p className="text-gray-600 mb-4">Manage advanced settings and dangerous operations.</p>
              
              <Card className="p-6 bg-red-50 border border-red-200">
                <h3 className="text-lg font-semibold text-red-700 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-600 mb-4">
                  The following actions are destructive and cannot be undone. Please proceed with caution.
                </p>
                
                <div className="flex justify-between items-center p-4 bg-white rounded border border-red-300 mb-4">
                  <div>
                    <h4 className="font-medium">Delete this customer</h4>
                    <p className="text-sm text-gray-500">
                      Permanently delete this customer and all associated data.
                    </p>
                  </div>
                  <Button variant="destructive">Delete Customer</Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 