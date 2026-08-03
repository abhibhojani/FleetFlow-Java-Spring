import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useFleetStore } from '@/app/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Download } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';

// Mock Chart Data
const FUEL_EFFICIENCY_DATA = [
  { name: 'Jan', efficiency: 8.2 },
  { name: 'Feb', efficiency: 8.5 },
  { name: 'Mar', efficiency: 8.1 },
  { name: 'Apr', efficiency: 8.8 },
  { name: 'May', efficiency: 9.0 },
  { name: 'Jun', efficiency: 8.9 },
];

const COST_DATA = [
  { name: 'Jan', maintenance: 1200, fuel: 4500 },
  { name: 'Feb', maintenance: 800, fuel: 4200 },
  { name: 'Mar', maintenance: 2000, fuel: 4800 },
  { name: 'Apr', maintenance: 500, fuel: 4600 },
  { name: 'May', maintenance: 1500, fuel: 5000 },
  { name: 'Jun', maintenance: 300, fuel: 4900 },
];

export default function Analytics() {
  const { vehicles, expenseLogs } = useFleetStore();

  // ROI Calculation Mock
  // Formula: (Revenue - (Maintenance + Fuel)) / Acquisition Cost
  // We'll mock Revenue and Acquisition for now since they aren't in the store
  const roiData = vehicles.map(v => {
    const maintenanceCost = expenseLogs
      .filter(l => l.vehicleId === v.id && l.type === 'Maintenance')
      .reduce((sum, l) => sum + l.amount, 0);
    const fuelCost = expenseLogs
      .filter(l => l.vehicleId === v.id && l.type === 'Fuel')
      .reduce((sum, l) => sum + l.amount, 0);

    // Mock values
    const revenue = 150000 + (Math.random() * 50000);
    const acquisitionCost = 80000;
    const roi = ((revenue - (maintenanceCost + fuelCost)) / acquisitionCost) * 100;

    return {
      vehicle: v.name,
      revenue,
      maintenanceCost,
      fuelCost,
      acquisitionCost,
      roi
    };
  });

  const handleExport = () => {
    // Generate CSV Header
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Vehicle,Revenue (Est.),Total Op. Cost,Net Profit,ROI %\n";

    // Add Rows
    roiData.forEach(data => {
      const totalOpCost = data.maintenanceCost + data.fuelCost;
      const netProfit = data.revenue - totalOpCost;
      const row = `"${data.vehicle}",${data.revenue.toFixed(2)},${totalOpCost.toFixed(2)},${netProfit.toFixed(2)},${data.roi.toFixed(2)}%`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `operational_analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);

    toast.success("Report downloaded successfully.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Operational Analytics</h1>
          <p className="text-slate-500">Insights and performance metrics.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fuel Efficiency Trends (km/L)</CardTitle>
            <CardDescription>Average fleet performance over last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FUEL_EFFICIENCY_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="efficiency" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operational Costs</CardTitle>
            <CardDescription>Maintenance vs Fuel expenses.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COST_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="maintenance" fill="#f59e0b" name="Maintenance" />
                <Bar dataKey="fuel" fill="#3b82f6" name="Fuel" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle ROI Analysis</CardTitle>
          <CardDescription>Return on Investment per vehicle.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead className="text-right">Revenue (Est.)</TableHead>
                <TableHead className="text-right">Total Op. Cost</TableHead>
                <TableHead className="text-right">Net Profit</TableHead>
                <TableHead className="text-right">ROI %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roiData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{data.vehicle}</TableCell>
                  <TableCell className="text-right">${data.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                  <TableCell className="text-right text-red-600">
                    -${(data.maintenanceCost + data.fuelCost).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </TableCell>
                  <TableCell className="text-right text-emerald-600 font-bold">
                    ${(data.revenue - (data.maintenanceCost + data.fuelCost)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {data.roi.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
