import React, { useState } from 'react';
import { useFleetStore } from '@/app/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import {
  Fuel,
  DollarSign,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

export default function ExpenseFuel() {
  const { vehicles, expenseLogs, addExpenseLog } = useFleetStore();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [liters, setLiters] = useState('');
  const [type, setType] = useState<'Fuel' | 'Maintenance' | 'Other'>('Fuel');

  const totalCost = expenseLogs.reduce((sum, log) => sum + log.amount, 0);

  // Group logs by vehicle ID
  const groupedExpenses = expenseLogs.reduce((acc, log) => {
    if (!acc[log.vehicleId]) acc[log.vehicleId] = [];
    acc[log.vehicleId].push(log);
    return acc;
  }, {} as Record<string, typeof expenseLogs>);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedVehicleId && amount) {
      addExpenseLog({
        vehicleId: selectedVehicleId,
        date: new Date().toISOString(),
        type,
        amount: Number(amount),
        liters: type === 'Fuel' ? Number(liters) : undefined
      });
      toast.success("Expense recorded successfully.");
      setAmount('');
      setLiters('');
      setSelectedVehicleId('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Expense & Fuel Log</h1>
          <p className="text-slate-500">Monitor fleet operational costs.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Operational Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">${totalCost.toLocaleString()}</div>
            <p className="text-xs text-slate-500">Lifetime expenses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Entry Form */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>New Entry</CardTitle>
            <CardDescription>Record a new expense.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="space-y-2">
                <Label>Vehicle</Label>
                <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={(val: any) => setType(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Expense Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fuel">Fuel</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cost ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="number"
                    className="pl-9"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              {type === 'Fuel' && (
                <div className="space-y-2">
                  <Label>Liters</Label>
                  <div className="relative">
                    <Fuel className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="number"
                      className="pl-9"
                      placeholder="0"
                      value={liters}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLiters(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Save Entry
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Expense History Table */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Expense History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.keys(groupedExpenses).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-slate-500">
                      No expenses recorded.
                    </TableCell>
                  </TableRow>
                ) : (
                  Object.entries(groupedExpenses).map(([vehicleId, logs]) => {
                    const vehicle = vehicles.find(v => v.id === vehicleId);
                    const vehicleTotal = logs.reduce((sum, l) => sum + l.amount, 0);
                    return (
                      <React.Fragment key={vehicleId}>
                        {/* Group Header Row */}
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-t-2">
                          <TableCell colSpan={3} className="font-semibold text-slate-900 border-r border-slate-200/50">
                            {vehicle?.name || 'Unknown Vehicle'} <span className="text-slate-500 font-normal">({vehicle?.licensePlate || 'N/A'})</span>
                          </TableCell>
                          <TableCell colSpan={2} className="font-semibold text-slate-900 text-left">
                            Vehicle Total: ${vehicleTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>

                        {/* Sub-items */}
                        {logs.map((log: any) => (
                          <TableRow key={log.id}>
                            <TableCell className="pl-6 text-slate-500">{new Date(log.date).toLocaleDateString()}</TableCell>
                            <TableCell></TableCell> {/* Left empty for visual hierarchy */}
                            <TableCell>
                              <Badge variant="outline" className={
                                log.type === 'Fuel' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  log.type === 'Maintenance' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                    'bg-slate-50 text-slate-700 border-slate-200'
                              }>
                                {log.type}
                              </Badge>
                            </TableCell>
                            <TableCell>${log.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                            <TableCell>
                              {log.liters ? `${log.liters}L` : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
