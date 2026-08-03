import React, { useState } from 'react';
import { useFleetStore, Vehicle } from '@/app/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Wrench, Plus, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function MaintenanceLogs() {
  const { vehicles, maintenanceLogs, addMaintenanceLog, editMaintenanceLog, updateVehicleStatus } = useFleetStore();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedVehicleId && description && cost) {
      addMaintenanceLog({
        vehicleId: selectedVehicleId,
        date: new Date().toISOString(),
        description,
        cost: Number(cost),
        status: 'Pending'
      });
      toast.success("Maintenance log added. Vehicle set to 'In Shop'.");
      setDescription('');
      setCost('');
      setSelectedVehicleId('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Maintenance Logs</h1>
          <p className="text-slate-500">Track vehicle health and service history.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Add Log Form */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Log Service</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddLog} className="space-y-4">
              <div className="space-y-2">
                <Label>Vehicle</Label>
                <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v: Vehicle) => (
                      <SelectItem key={v.id} value={v.id}>{v.name} ({v.licensePlate})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="e.g. Oil Change"
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Cost ($)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={cost}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCost(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Log
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Logs List */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-slate-500">
                      No maintenance logs recorded.
                    </TableCell>
                  </TableRow>
                ) : (
                  maintenanceLogs.map((log: any) => {
                    const vehicle = vehicles.find((v: Vehicle) => v.id === log.vehicleId);
                    return (
                      <TableRow key={log.id}>
                        <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{vehicle?.name || 'Unknown'}</TableCell>
                        <TableCell>{log.description}</TableCell>
                        <TableCell>${log.cost.toFixed(2)}</TableCell>
                        <TableCell>
                          {log.status === 'Completed' ? (
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                              Completed
                            </Badge>
                          ) : (
                            <div className="flex gap-2 items-center">
                              <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                                Pending
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                onClick={async () => {
                                  await editMaintenanceLog(log.id, { status: 'Completed' });
                                  if (log.vehicleId) {
                                    updateVehicleStatus(log.vehicleId, 'Available');
                                  }
                                  toast.success("Maintenance marked as Complete!");
                                }}
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Finish
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
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
