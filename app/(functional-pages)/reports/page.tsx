'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Plus, 
  BarChartBig, 
  FilePlus2, 
  Info, 
  Trash2,
  AlertCircle
} from 'lucide-react';

// Report interface
interface Report {
  id: string;
  name: string;
  description: string;
  isPreset: boolean;
  equipmentType: string;
  createdOn: string;
  lastUpdated: string;
}

export default function ReportsPage() {
  // Mock data for reports
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      name: 'MRI Chiller Overview Report',
      description: 'Created by MechDX',
      isPreset: true,
      equipmentType: 'MRI Chiller',
      createdOn: '3/21/2023',
      lastUpdated: '8/3/2023',
    },
    {
      id: '2',
      name: 'Siemens MRI Report',
      description: 'No Description',
      isPreset: false,
      equipmentType: 'MRI Chiller',
      createdOn: '2/28/2023',
      lastUpdated: '8/14/2023',
    },
    {
      id: '3',
      name: 'KKT PM Checklist',
      description: 'Preventative Maintenance Checklist for KKT MRI Chillers',
      isPreset: false,
      equipmentType: 'MRI Chiller',
      createdOn: '5/22/2023',
      lastUpdated: '9/4/2024',
    },
    {
      id: '4',
      name: 'Hot Water Boiler Overview Report',
      description: 'Created by MechDX',
      isPreset: true,
      equipmentType: 'Hot Water Boiler',
      createdOn: '6/14/2023',
      lastUpdated: '9/27/2023',
    },
    {
      id: '5',
      name: 'Water-Cooled Chiller Overview Report',
      description: 'Created by MechDX',
      isPreset: true,
      equipmentType: 'Water-Cooled Chiller',
      createdOn: '6/21/2023',
      lastUpdated: '8/3/2023',
    },
    {
      id: '6',
      name: 'Air-Cooled Chiller Overview Report',
      description: 'Created by MechDX',
      isPreset: true,
      equipmentType: 'Air-Cooled Chiller',
      createdOn: '6/21/2023',
      lastUpdated: '8/3/2023',
    },
    {
      id: '7',
      name: 'CT Tower Inspection Checklist',
      description: 'Created by MechDX',
      isPreset: true,
      equipmentType: 'Cooling Tower',
      createdOn: '7/14/2023',
      lastUpdated: '8/22/2023',
    },
    {
      id: '8',
      name: 'Haskris PM Checklist',
      description: 'PM Checklist for MRI Chillers',
      isPreset: true,
      equipmentType: 'MRI Chiller',
      createdOn: '9/25/2024',
      lastUpdated: '9/25/2024',
    },
  ]);

  return (
    <div className="container mx-auto p-2">
      {/* Top Create New button section */}
      <div className="flex justify-end mb-1">
        <div className="flex gap-2">
         
          <Button className="bg-purple-700 hover:bg-purple-800 text-white">
            <Plus size={16} className="mr-1" /> Create New
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-indigo-800 text-white p-6">
        <h1 className="text-3xl font-bold mb-2">Reports</h1>
        <p className="text-gray-200 mb-8">Easily customize templates to create tailored reports in minutes.</p>
        <h2 className="text-xl font-semibold">My Reports</h2>
      </div>

      {/* Action Buttons */}
      <div className="bg-white py-3 px-4 border-b border-gray-200 flex gap-3">
        <Button 
          variant="outline" 
          size="sm"
          className="text-indigo-600 border-indigo-600 bg-white hover:bg-indigo-50"
        >
          <Plus size={14} className="mr-1" /> New Report Template
        </Button>
        <Button 
          variant="outline"
          size="sm" 
          className="text-indigo-600 border-indigo-600 bg-white hover:bg-indigo-50"
        >
          <FileText size={14} className="mr-1" /> Generate Report
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="text-indigo-600 border-indigo-600 bg-white hover:bg-indigo-50"
        >
          <BarChartBig size={14} className="mr-1" /> New Aggregate Report
        </Button>
      </div>

      {/* Reports Table */}
      <div className="bg-white">
        <table className="w-full">
          <tbody className="divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{report.name}</div>
                    <div className="text-sm text-gray-500">{report.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {report.isPreset && (
                    <div className="flex items-center">
                      <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded mr-1">Preset</span>
                      <Info size={16} className="text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {report.equipmentType}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div>
                    <div>Created On: {report.createdOn}</div>
                    <div>Last Updated: {report.lastUpdated}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="w-5 h-5 bg-red-500 flex items-center justify-center rounded-sm">
                    <Trash2 size={14} className="text-white" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 