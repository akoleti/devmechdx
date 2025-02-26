'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Building,
  CheckCircle,
  Clock,
  FileText,
  HardDrive,
  Users,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DonutChart from './components/DonutChart';

// Mock data for demonstration
const stats = [
  { title: "TOTAL CUSTOMERS", value: "76", icon: Users, color: "bg-purple-500" },
  { title: "TOTAL LOCATIONS", value: "210", icon: Building, color: "bg-green-500" },
  { title: "TOTAL EQUIPMENTS", value: "429", icon: HardDrive, color: "bg-blue-500" },
  { title: "TOTAL LOGS", value: "971", icon: FileText, color: "bg-red-500" },
];

const alertsData = {
  unresolved: 114,
  pending: 21,
  resolved: 137,
  total: 272,
  subscriptions: 71,
};

const logsData = [
  { location: "Laredo Medical Center > Laredo Medical Center > Chiller #4", date: "Jan 30, 2025", status: "Unresolved" },
  { location: "Corpus Christi ISD > Calk / Wilson Elementary > York YVAA Chiller #2", date: "Nov 12, 2024", status: "Resolved" },
  { location: "Donna ISD > Donna ISD Veterans Middle School > Carrier 30RAP060 Chiller #1", date: "Nov 8, 2024", status: "Unresolved" },
  { location: "Texas A&M Corpus-Southeast Service Solution > Dining Hall > Daikin AGZ Chiller #1", date: "Nov 4, 2024", status: "Unresolved" },
  { location: "Navy Air Station Corpus Christi > Bldg 1700-2 > FET3347 WCC-2 York YMC2", date: "Nov 4, 2024", status: "Resolved" },
  { location: "Landlord Resources > Office Park South > Trane CGAM North Bldg. Chiller #2", date: "Oct 22, 2024", status: "Unresolved" },
  { location: "Kleberg Bank > Kleberg Kingsville Bank > Daikin AGZ Chiller #1", date: "Oct 21, 2024", status: "Unresolved" },
  { location: "Navy Air Station Corpus Christi > Bldg B - MR-1 > FET1441 Chill #4 WME Daikin Chiller", date: "Oct 2, 2024", status: "Resolved" },
  { location: "Santa Rosa ISD > Joe Nelson > Trane CGAM Chiller #1", date: "Sep 30, 2024", status: "Unresolved" },
  { location: "Corpus Christi ISD > Webb Elementary > York YVAA Chiller #1", date: "Sep 17, 2024", status: "Unresolved" },
];

// Chart data
const logSummaryData = {
  data: [303, 126],
  labels: ['Logged Equipment', 'Unlogged Equipment'],
  colors: ['#1e40af', '#ef4444'],
  centerText: {
    value: '303',
    label: 'Logged',
  }
};

const efficiencyData = {
  data: [124, 107, 24, 75, 46, 26],
  labels: ['Baseline', '<65%', '<80%', '<95%', '<120%', '>120%'],
  colors: ['#1e40af', '#7f1d1d', '#ea580c', '#65a30d', '#0284c7', '#7e22ce'],
  type: 'efficiency' as const
};

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header with Create New button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button variant="default" className="bg-purple-700 hover:bg-purple-800">
          + Create New
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <span className="text-3xl font-bold">{stat.value}</span>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2 border-b">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-md font-semibold">Alerts Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-full bg-red-100">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <span className="font-bold text-red-500">{alertsData.unresolved}</span>
                  <span className="ml-2 text-sm text-gray-600">Unresolved</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-full bg-blue-100">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <span className="font-bold text-blue-500">{alertsData.pending}</span>
                  <span className="ml-2 text-sm text-gray-600">Pending</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-full bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <span className="font-bold text-green-500">{alertsData.resolved}</span>
                  <span className="ml-2 text-sm text-gray-600">Resolved</span>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-4">
              <p className="font-semibold">{alertsData.total} Total Alerts for {alertsData.subscriptions} Subscriptions</p>
              <p className="text-xs text-blue-600 cursor-pointer">Click to Show Subscriptions</p>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Log</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logsData.map((log, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-sm">{log.location}</TableCell>
                      <TableCell className="text-right">{log.date}</TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant={log.status === "Resolved" ? "outline" : "default"}
                          className={log.status === "Resolved" 
                            ? "bg-green-100 text-green-700 border-green-200" 
                            : "bg-orange-500 text-white"}
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Rows per page:</span>
                <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(parseInt(value))}>
                  <SelectTrigger className="w-16 h-8">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-sm text-gray-500">
                1-10 of 272
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="space-y-6">
          {/* Log Summary Chart */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2 border-b">
              <div>
                <CardTitle className="text-md font-semibold">Log Summary</CardTitle>
                <p className="text-xs text-gray-500">Equipment with Logs vs Equipment with No Logs</p>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <DonutChart 
                data={logSummaryData.data}
                labels={logSummaryData.labels}
                colors={logSummaryData.colors}
                centerText={logSummaryData.centerText}
              />
              <p className="text-center text-xs text-blue-600 mt-4 cursor-pointer">Click on the Chart to Interact</p>
            </CardContent>
          </Card>

          {/* Efficiency Chart */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2 border-b">
              <div>
                <CardTitle className="text-md font-semibold">Summary of Efficiency</CardTitle>
                <p className="text-xs text-gray-500">Across all Equipment, based on Efficiency Percentage score from individual logs.</p>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <DonutChart 
                data={efficiencyData.data}
                labels={efficiencyData.labels}
                colors={efficiencyData.colors}
                type={efficiencyData.type}
              />
              <p className="text-center text-xs text-blue-600 mt-4 cursor-pointer">Click on the Chart to Interact</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 