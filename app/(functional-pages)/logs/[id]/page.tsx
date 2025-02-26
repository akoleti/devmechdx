'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronUp, ChevronDown, Info, Edit, Check, X, File, Upload, CheckCircle, Lock, Bell, Calculator, FileText, Trash, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Log } from '../page';
import GaugeComponent from 'react-gauge-component';

// Mock data for detailed log view
const logDetails = [
  {
    id: '1',
    title: 'Performance Log',
    date: 'December 10, 2023',
    technician: 'John Smith',
    description: 'Measured COP at 4.2, below expected performance. Chilled water temperature at 44°F, condenser water temperature at 85°F.',
    workOrderNo: '47683',
    conclusion: 'Boiler has low water flow but multiple boiler valves are open due to forcing boiler #1 to run.',
    actionToTake: 'The control valves for all boilers were open during operational test. Typically the control valves should be closed when the boiler is not operating. Need to check the BAS system for valve overrides.',
    inspectedBy: 'Cliff Blair',
    attachedDocuments: [
      { name: 'Inspection Report.pdf', size: '2.3 MB', date: 'Dec 10, 2023' },
      { name: 'Test Results.xlsx', size: '1.1 MB', date: 'Dec 10, 2023' }
    ],
    equipment: {
      id: 'FE12151',
      name: 'Fulton Boiler #1',
      model: 'VTG-6000',
      serialNumber: '9352',
      nickname: 'FE12151 Fulton Boiler #1',
      texasBoilerNumber: 'Need Number',
      nationalBoardNumber: 'Need Number',
      boilerNumber: '1',
      location: '1828 Boiler Room',
      dateCreated: '9 hours ago',
      type: 'Hot Water Boiler',
      checklist: [
        { label: 'Boiler has a current Certificate of Operation', status: 'completed' },
        { label: 'BFP/Reliance Header/Tank Safety Exists', status: 'completed' },
        { label: 'Verify Building Contractor POC of Work to be Performed', status: 'completed' },
        { label: 'Check Operating Controls', status: 'completed' },
        { label: 'Check Safety Controls', status: 'completed' },
        { label: 'All Thermostatics & Gauges are Functional', status: 'completed' },
        { label: 'Water Relief Valves are installed and Functional', status: 'completed' },
        { label: 'Check & Log Assess', status: 'completed' },
        { label: 'Check Gas Pipe for Leaks', status: 'completed' },
        { label: 'Check Flame/Flue Safety Device', status: 'completed' },
        { label: 'Vaporizer is installed and functional', status: 'completed' },
        { label: 'Check Linkages/Piping for Leaks', status: 'completed' },
        { label: 'Inspect Burner and ignitor', status: 'completed' },
        { label: 'Install Flue and Gas Cleaner (if applicable)', status: 'completed' },
        { label: 'Check True Earth', status: 'completed' },
        { label: 'Check Flame Operation', status: 'completed' },
        { label: 'Pilot Spring is connected properly', status: 'completed' },
        { label: 'Combustion Analysis Performed', status: 'completed' },
        { label: 'Boiler has a Dedicated Pump', status: 'na' },
        { label: 'Gas Inlet Valve can easily operate', status: 'completed' },
        { label: 'Components Tube Fire proper pressure & is Functional', status: 'completed' }
      ],
      comparisons: {
        'System Pressure': {
          'Heat Gas Pressure': {
            design: 100,
            log: 100,
            diff: 0,
            unit: '%'
          },
          'Inlet Gas Pressure': {
            design: 6.0,
            log: 6.0,
            diff: 0,
            unit: 'in w.c.'
          },
          'Manifold Pressure': {
            design: 18.4,
            log: 17.0,
            diff: -1.4,
            unit: 'in w.c.'
          }
        },
        'Electrical': {
          'Volts': {
            design: 460,
            log: 479,
            diff: 19.0,
            unit: 'V'
          },
          'Amps': {
            design: 13.0,
            log: 8.1,
            diff: -4.9,
            unit: 'A'
          }
        },
        'Water Flow': {
          'GPM': {
            design: 120,
            log: 115,
            diff: -5,
            unit: 'GPM'
          },
          'Pressure': {
            design: 45,
            log: 42,
            diff: -3,
            unit: 'PSI'
          },
          'Water Pressure Drop (Ft of Hd)': {
            design: 28.0,
            log: 26.0,
            diff: -2.0,
            unit: 'ft'
          }
        },
        'Temperature': {
          'Entering Temperature': {
            design: 140.0,
            log: 140.0,
            diff: 0.0,
            unit: '°F'
          },
          'Leaving Temperature': {
            design: 160.0,
            log: 154.0,
            diff: -6.0,
            unit: '°F'
          },
          'Delta Temperature': {
            design: 20.0,
            log: 14.0,
            diff: -6.0,
            unit: '°F'
          }
        },
        'BTUs': {
          'Input BTUs': {
            design: 6000000,
            log: 6000000,
            diff: 0,
            unit: 'BTU/h'
          },
          'Output BTUs': {
            design: 5628000,
            log: 5436000,
            diff: -192000,
            unit: 'BTU/h'
          },
          'Boiler Efficiency': {
            design: 94.0,
            log: 90.6,
            diff: -3.4,
            unit: '%'
          },
          'Cubic Ft of Gas per Hour': {
            design: 5700,
            log: 5708.6,
            diff: 8.6,
            unit: 'CFH'
          },
          'CFM': {
            design: 564.0,
            log: 564.0,
            diff: 0.0,
            unit: 'CFM'
          }
        }
      }
    },
    contacts: [
      {
        name: 'Michael Vorderkunz',
        role: 'Customer Primary',
        id: '101'
      },
      {
        name: 'Michael Vorderkunz',
        role: 'Location Primary',
        id: '101'
      },
      {
        name: 'Geronimo Rodriguez III',
        role: 'Additional Contact',
        id: '102'
      },
      {
        name: 'Will Potwin',
        role: 'Additional Contact',
        id: '103'
      }
    ]
  },
  {
    id: '2',
    title: 'Operational Log',
    date: 'November 20, 2023',
    technician: 'Sarah Johnson',
    description: 'Operating at 75% capacity during peak hours. No abnormal vibrations or noise detected.',
    workOrderNo: '47522',
    conclusion: 'Equipment operating within normal parameters. No issues detected.',
    actionToTake: 'Continue with regular maintenance schedule. Next inspection due in 3 months.',
    inspectedBy: 'Sarah Johnson',
    attachedDocuments: [],
    equipment: {
      id: 'FE12152',
      name: 'Fulton Boiler #2',
      model: 'VTG-5000',
      serialNumber: '9353',
      nickname: 'FE12152 Fulton Boiler #2',
      texasBoilerNumber: 'Need Number',
      nationalBoardNumber: 'Need Number',
      boilerNumber: '2',
      location: '1828 Boiler Room',
      dateCreated: '2 days ago',
      type: 'Hot Water Boiler',
      checklist: [
        { label: 'Boiler has a current Certificate of Operation', status: 'completed' },
        { label: 'BFP/Reliance Header/Tank Safety Exists', status: 'completed' },
        { label: 'Verify Building Contractor POC of Work to be Performed', status: 'completed' },
        { label: 'Check Operating Controls', status: 'completed' },
        { label: 'Check Safety Controls', status: 'completed' },
        { label: 'All Thermostatics & Gauges are Functional', status: 'completed' },
        { label: 'Water Relief Valves are installed and Functional', status: 'completed' },
        { label: 'Check & Log Assess', status: 'completed' },
        { label: 'Check Gas Pipe for Leaks', status: 'completed' },
        { label: 'Check Flame/Flue Safety Device', status: 'completed' },
        { label: 'Vaporizer is installed and functional', status: 'completed' },
        { label: 'Check Linkages/Piping for Leaks', status: 'completed' },
        { label: 'Inspect Burner and ignitor', status: 'completed' },
        { label: 'Install Flue and Gas Cleaner (if applicable)', status: 'completed' },
        { label: 'Check True Earth', status: 'completed' },
        { label: 'Check Flame Operation', status: 'completed' },
        { label: 'Pilot Spring is connected properly', status: 'completed' },
        { label: 'Combustion Analysis Performed', status: 'completed' },
        { label: 'Boiler has a Dedicated Pump', status: 'completed' },
        { label: 'Gas Inlet Valve can easily operate', status: 'completed' },
        { label: 'Components Tube Fire proper pressure & is Functional', status: 'completed' }
      ],
      comparisons: {
        'System Pressure': {
          'Heat Gas Pressure': {
            design: 100,
            log: 100,
            diff: 0,
            unit: '%'
          },
          'Inlet Gas Pressure': {
            design: 6.0,
            log: 6.0,
            diff: 0,
            unit: 'in w.c.'
          },
          'Manifold Pressure': {
            design: 18.4,
            log: 17.0,
            diff: -1.4,
            unit: 'in w.c.'
          }
        },
        'Electrical': {
          'Volts': {
            design: 460,
            log: 458,
            diff: -2.0,
            unit: 'V'
          },
          'Amps': {
            design: 13.0,
            log: 12.8,
            diff: -0.2,
            unit: 'A'
          }
        },
        'Water Flow': {
          'GPM': {
            design: 120,
            log: 118,
            diff: -2,
            unit: 'GPM'
          },
          'Pressure': {
            design: 45,
            log: 44,
            diff: -1,
            unit: 'PSI'
          },
          'Water Pressure Drop (Ft of Hd)': {
            design: 28.0,
            log: 28.0,
            diff: 0.0,
            unit: 'ft'
          }
        },
        'Temperature': {
          'Entering Temperature': {
            design: 140.0,
            log: 140.0,
            diff: 0.0,
            unit: '°F'
          },
          'Leaving Temperature': {
            design: 160.0,
            log: 160.0,
            diff: 0.0,
            unit: '°F'
          },
          'Delta Temperature': {
            design: 20.0,
            log: 20.0,
            diff: 0.0,
            unit: '°F'
          }
        },
        'BTUs': {
          'Input BTUs': {
            design: 5000000,
            log: 5000000,
            diff: 0,
            unit: 'BTU/h'
          },
          'Output BTUs': {
            design: 4700000,
            log: 4680000,
            diff: -20000,
            unit: 'BTU/h'
          },
          'Boiler Efficiency': {
            design: 94.0,
            log: 93.6,
            diff: -0.4,
            unit: '%'
          },
          'Cubic Ft of Gas per Hour': {
            design: 4750,
            log: 4750,
            diff: 0,
            unit: 'CFH'
          },
          'CFM': {
            design: 530.0,
            log: 528.8,
            diff: -1.2,
            unit: 'CFM'
          }
        }
      }
    },
    contacts: [
      {
        name: 'Michael Vorderkunz',
        role: 'Customer Primary',
        id: '101'
      },
      {
        name: 'Michael Vorderkunz',
        role: 'Location Primary',
        id: '101'
      },
      {
        name: 'Will Potwin',
        role: 'Additional Contact',
        id: '103'
      }
    ]
  }
];

// Add EfficiencyGauge component
const EfficiencyGauge = ({ efficiency = 0 }) => {
  // Format efficiency for display
  const formattedEfficiency = efficiency.toFixed(2);
  
  // Calculate yearly cost estimate (in this case it's $0.00 as shown in the image)
  const costEstimate = 0.00;

  // Workaround for TypeScript errors
  const gaugeProps: any = {
    id: "efficiency-gauge",
    type: "semicircle",
    arc: {
      width: 0.2,
      padding: 0.02,
      colorArray: ['#5BE12C'],
      subArcs: [
        { limit: 120 }
      ]
    },
    labels: {
      valueLabel: {
        formatTextValue: () => `${formattedEfficiency}%`,
        style: { fontSize: 24, fontWeight: 'bold', fill: '#212121' }
      },
      markLabel: {
        marks: [
          { value: 0 },
          { value: 10 },
          { value: 20 },
          { value: 30 },
          { value: 40 },
          { value: 50 },
          { value: 60 },
          { value: 70 },
          { value: 80 },
          { value: 90 },
          { value: 100 },
          { value: 110 },
          { value: 120 }
        ],
        type: 'outer',
        style: () => ({
          fontSize: '10px',
          fontWeight: 'normal',
          fill: '#8E8E8E'
        })
      }
    },
    pointer: {
      elastic: true,
      animationDuration: 1000,
      color: '#000000',
      length: 0.85,
      width: 6
    },
    value: efficiency,
    minValue: 0,
    maxValue: 120
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <GaugeComponent {...gaugeProps} />
        <div className="text-center mt-[-20px]">
          <div className="text-sm text-gray-600 font-medium">Efficiency Percentage</div>
        </div>
      </div>
      
      {/* Cost estimate display */}
      <div className="text-center mt-6">
        <div className="text-2xl font-bold">${costEstimate.toFixed(2)}</div>
        <div className="text-xs text-gray-500 max-w-48 text-center">
          Inefficiency Cost Per Year Estimate based on this log's Efficiency Percentage
        </div>
      </div>
    </div>
  );
};

export default function LogDetail({ params }: { params: Promise<{ id: string }> }) {
  // Properly unwrap params using React.use()
  const unwrappedParams = use(params);
  const logId = unwrappedParams.id;
  
  const [log, setLog] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State for main comparison panel
  const [comparisonCollapsed, setComparisonCollapsed] = useState(false);
  
  // State for checklist
  const [checklistCollapsed, setChecklistCollapsed] = useState(true);

  // State for log lock status
  const [isLocked, setIsLocked] = useState(true);
  
  // States for accordion sections
  const [equipmentTypeOpen, setEquipmentTypeOpen] = useState(true);
  const [categoryOpenStates, setCategoryOpenStates] = useState<{[key: string]: boolean}>({});
  
  // State for editable log details
  const [isEditing, setIsEditing] = useState(false);
  const [editedLogDetails, setEditedLogDetails] = useState({
    workOrderNo: '',
    conclusion: '',
    actionToTake: '',
    inspectedBy: ''
  });
  
  useEffect(() => {
    // In a real application, this would be an API call
    const foundLog = logDetails.find(l => l.id === logId);
    
    if (foundLog) {
      setLog(foundLog);
      setEditedLogDetails({
        workOrderNo: foundLog.workOrderNo,
        conclusion: foundLog.conclusion,
        actionToTake: foundLog.actionToTake,
        inspectedBy: foundLog.inspectedBy
      });
      
      // Initialize category states to open for first category, closed for others
      const categories = Object.keys(foundLog.equipment.comparisons);
      const initialCategoryStates: {[key: string]: boolean} = {};
      
      categories.forEach((category, index) => {
        initialCategoryStates[category] = index === 0; // Open first category by default
      });
      
      setCategoryOpenStates(initialCategoryStates);
    }
    
    setLoading(false);
  }, [logId]);
  
  const toggleCategory = (category: string) => {
    setCategoryOpenStates(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  const handleEditChange = (field: string, value: string) => {
    setEditedLogDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const saveChanges = () => {
    // In a real application, this would be an API call to update the log
    setLog((prev: any) => ({
      ...prev,
      workOrderNo: editedLogDetails.workOrderNo,
      conclusion: editedLogDetails.conclusion,
      actionToTake: editedLogDetails.actionToTake,
      inspectedBy: editedLogDetails.inspectedBy
    }));
    setIsEditing(false);
  };
  
  const cancelEdit = () => {
    // Reset edited values to original
    if (log) {
      setEditedLogDetails({
        workOrderNo: log.workOrderNo,
        conclusion: log.conclusion,
        actionToTake: log.actionToTake,
        inspectedBy: log.inspectedBy
      });
    }
    setIsEditing(false);
  };

  const toggleLockStatus = () => {
    setIsLocked(!isLocked);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Log Not Found</h1>
          <p className="mb-4">The log you are looking for does not exist or has been removed.</p>
          <Link href="/logs">
            <Button>Back to Logs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top Action Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
          >
            <Calculator size={16} className="text-purple-600" />
            <span className="text-xs">Recalculate</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
          >
            <Edit size={16} className="text-green-600" />
            <span className="text-xs">Edit</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
          >
            <FileText size={16} className="text-blue-600" />
            <span className="text-xs">Generate Report</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
          >
            <Check size={16} className="text-amber-600" />
            <span className="text-xs">Verify</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
          >
            <Trash size={16} className="text-red-600" />
            <span className="text-xs">Delete</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
          >
            <Plus size={16} />
            <span className="text-xs">Create New</span>
          </Button>
        </div>
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            className={`${isLocked ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-amber-50 text-amber-800 hover:bg-amber-100"}`}
            onClick={toggleLockStatus}
          >
            {isLocked ? "UNLOCK" : "LOCK"}
          </Button>
        </div>
      </div>
      
      {/* Log Status Bar */}
      <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <Lock size={16} />
          <span>This Log Was Completed and Locked on 2/25/2025 by Cliff Blair</span>
        </div>
        <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">
          <span className="text-xs">UNLOCK</span>
        </Button>
      </div>

      {/* Alert Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm">No Alert for this Log</span>
        </div>
        <div className="flex items-center">
          <Button variant="outline" size="sm" className="ml-2 flex items-center gap-1 text-blue-600">
            <Bell size={16} />
            <span className="text-xs">Create Alert</span>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/logs" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <ArrowLeft size={16} />
              <span>Back to Logs</span>
            </Link>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{log.title} - {log.equipment.name}</h1>
              <p className="text-gray-600">Date: {log.date} • Technician: {log.technician}</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2">
            {/* Log Details Section - Editable */}
            <Card className="border border-gray-200 mb-6">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Log Details</h2>
                  {!isEditing ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </Button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={cancelEdit}
                      >
                        <X size={14} />
                        <span>Cancel</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50"
                        onClick={saveChanges}
                      >
                        <Check size={14} />
                        <span>Save</span>
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {/* Work Order Number */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Work Order No:</p>
                    {isEditing ? (
                      <Input 
                        value={editedLogDetails.workOrderNo} 
                        onChange={(e) => handleEditChange('workOrderNo', e.target.value)}
                        className="max-w-md"
                      />
                    ) : (
                      <p className="font-medium">{log.workOrderNo}</p>
                    )}
                  </div>
                  
                  {/* Conclusion */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Conclusion:</p>
                    {isEditing ? (
                      <Textarea 
                        value={editedLogDetails.conclusion} 
                        onChange={(e) => handleEditChange('conclusion', e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <p className="text-gray-700">{log.conclusion}</p>
                    )}
                  </div>
                  
                  {/* Action to be Taken */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Action to be Taken:</p>
                    {isEditing ? (
                      <Textarea 
                        value={editedLogDetails.actionToTake} 
                        onChange={(e) => handleEditChange('actionToTake', e.target.value)}
                        rows={4}
                      />
                    ) : (
                      <p className="text-gray-700">{log.actionToTake}</p>
                    )}
                  </div>
                  
                  {/* Inspection Performed By */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Inspection performed by a Pro Tech Mechanical, LLC Technician:</p>
                    {isEditing ? (
                      <Input 
                        value={editedLogDetails.inspectedBy} 
                        onChange={(e) => handleEditChange('inspectedBy', e.target.value)}
                        className="max-w-md"
                      />
                    ) : (
                      <p className="font-medium">{log.inspectedBy}</p>
                    )}
                  </div>
                  
                  {/* Attached Documents */}
                  <div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500 mb-2">Attached Documents:</p>
                      <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs">
                        <Upload size={12} />
                        <span>Upload Document</span>
                      </Button>
                    </div>
                    
                    {log.attachedDocuments && log.attachedDocuments.length > 0 ? (
                      <div className="space-y-2">
                        {log.attachedDocuments.map((doc: any, index: number) => (
                          <div key={index} className="flex items-center p-2 border rounded-md">
                            <File size={16} className="text-blue-500 mr-2" />
                            <div className="flex-1">
                              <p className="font-medium text-blue-600 hover:underline cursor-pointer">{doc.name}</p>
                              <p className="text-xs text-gray-500">{doc.size} • {doc.date}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                              <X size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-md text-center">
                        No documents attached
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Equipment Design and Log Comparison Section */}
            <div className="border border-gray-200 rounded-md mb-6 overflow-hidden">
              {/* Main header */}
              <div className="bg-white border-b">
                <div className="px-4 py-3 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Equipment Design and Log Comparison</h2>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="flex items-center gap-1 text-white rounded-md bg-red-600 hover:bg-red-700"
                    onClick={() => setComparisonCollapsed(!comparisonCollapsed)}
                  >
                    <ChevronUp size={14} />
                    <span>Click to {comparisonCollapsed ? 'Expand' : 'Collapse'}</span>
                    <ChevronUp size={14} />
                  </Button>
                </div>
              </div>
              
              {/* Comparison Content */}
              {!comparisonCollapsed && (
                <div className="divide-y divide-gray-200">
                  {/* Equipment Type Section */}
                  <div className="border-b">
                    <button
                      onClick={() => setEquipmentTypeOpen(!equipmentTypeOpen)}
                      className="w-full p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-left">{log.equipment.type}</span>
                      <ChevronUp 
                        size={18} 
                        className={`transition-transform duration-200 ${equipmentTypeOpen ? '' : 'transform rotate-180'}`} 
                      />
                    </button>
                    
                    {/* Categories */}
                    {equipmentTypeOpen && Object.entries(log.equipment.comparisons).map(([category, specs]: [string, any]) => (
                      <div key={category} className="border-t">
                        <button
                          onClick={() => toggleCategory(category)}
                          className="w-full p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-left">{category}</span>
                          <ChevronUp 
                            size={18} 
                            className={`transition-transform duration-200 ${categoryOpenStates[category] ? '' : 'transform rotate-180'}`} 
                          />
                        </button>
                        
                        {/* Specifications */}
                        {categoryOpenStates[category] && (
                          <div className="p-4 bg-white">
                            <div className="space-y-3">
                              {Object.entries(specs).map(([spec, values]: [string, any]) => (
                                <div key={spec} className="pb-3 last:pb-0">
                                  <div className="mb-1 font-medium">{spec}</div>
                                  <div className="flex border-b py-1">
                                    <div className="w-1/4 text-sm text-gray-500">Design</div>
                                    <div className="w-3/4 text-right font-medium">{values.design}{values.unit ? ` ${values.unit}` : ''}</div>
                                  </div>
                                  <div className="flex border-b py-1">
                                    <div className="w-1/4 text-sm text-gray-500">Log</div>
                                    <div className="w-3/4 text-right font-medium">{values.log}{values.unit ? ` ${values.unit}` : ''}</div>
                                  </div>
                                  <div className="flex py-1">
                                    <div className="w-1/4 text-sm text-gray-500">
                                      {spec} Diff.
                                    </div>
                                    <div className={`w-3/4 text-right font-medium ${values.diff < 0 ? 'text-red-600' : values.diff > 0 ? 'text-amber-600' : 'text-gray-600'}`}>
                                      {values.diff > 0 ? `+${values.diff}` : values.diff}{values.unit ? ` ${values.unit}` : ''}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* Efficiency Gauge Card - NEW */}
            <Card className="border border-gray-200 mb-6">
              <CardContent className="p-4">
                <EfficiencyGauge efficiency={log.equipment.comparisons?.BTUs?.['Boiler Efficiency']?.log || 95.59} />
              </CardContent>
            </Card>
            
            {/* Equipment Information Card */}
            <Card className="border border-gray-200 mb-6">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Info size={20} className="mr-2 text-blue-500" />
                  Equipment Information
                </h2>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Equipment Name</p>
                    <p className="font-medium">{log.equipment.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium">{log.equipment.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Serial Number</p>
                    <p className="font-medium">{log.equipment.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Model Number</p>
                    <p className="font-medium">{log.equipment.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{log.equipment.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Boiler Number</p>
                    <p className="font-medium">{log.equipment.boilerNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Texas Boiler Number</p>
                    <p className="font-medium">{log.equipment.texasBoilerNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">National Board Number</p>
                    <p className="font-medium">{log.equipment.nationalBoardNumber}</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-700">{log.description}</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Checklist Card */}
            <Card className="border border-gray-200 mb-6 overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="bg-gray-100 px-4 py-3 flex justify-between items-center">
                  <h3 className="font-medium">Checklist</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1 text-gray-600 hover:bg-gray-200"
                    onClick={() => setChecklistCollapsed(!checklistCollapsed)}
                  >
                    {checklistCollapsed ? (
                      <>
                        <span>Click to Expand</span>
                        <ChevronDown size={14} />
                      </>
                    ) : (
                      <>
                        <span>Click to Collapse</span>
                        <ChevronUp size={14} />
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {!checklistCollapsed && (
                <div className="px-4 py-2">
                  <div className="divide-y">
                    {log.equipment.checklist && log.equipment.checklist.map((item: any, index: number) => (
                      <div key={index} className="py-2 flex justify-between items-center">
                        <span className="text-sm">{item.label}</span>
                        <span>
                          {item.status === 'completed' ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : item.status === 'na' ? (
                            <span className="text-xs text-gray-500">N/A</span>
                          ) : (
                            <span className="text-xs text-red-500">✕</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
            
            {/* Photos Card */}
            <Card className="border border-gray-200 mb-6">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">Photos</h3>
                <div className="bg-gray-100 rounded h-40 flex items-center justify-center text-gray-500">
                  No photos attached to this log
                </div>
              </CardContent>
            </Card>
            
            {/* Attachments Card */}
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">Attachments</h3>
                <div className="bg-gray-100 rounded h-20 flex items-center justify-center text-gray-500">
                  No documents attached
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 