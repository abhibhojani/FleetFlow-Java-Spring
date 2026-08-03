import React, { useState } from 'react';
import { useFleetStore } from '@/app/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { AlertTriangle, User, ShieldCheck, Calendar, UserPlus, Power } from 'lucide-react';
import { toast } from 'sonner';

export default function DriverProfiles() {
  const { drivers, addDriver, updateDriverStatus } = useFleetStore();

  const role = localStorage.getItem('fleet_role') || 'manager';
  const isDispatcher = role === 'dispatcher';

  // Add Driver Form State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [safetyScore, setSafetyScore] = useState('100');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && licenseExpiry) {
      addDriver({
        name,
        licenseExpiry,
        safetyScore: Number(safetyScore) || 100,
        status: 'Active',
        isOnDuty: false
      });
      toast.success('Driver profile created successfully!');
      setIsAddOpen(false);
      setName('');
      setLicenseExpiry('');
      setSafetyScore('100');
    } else {
      toast.error('Name and License Expiry are required.');
    }
  };

  const toggleDuty = (driverId: string, currentDuty: boolean | undefined) => {
    updateDriverStatus(driverId, { isOnDuty: !currentDuty });
    toast.info(`Driver marked as ${!currentDuty ? 'On Duty' : 'Off Duty'}`);
  };

  const handleStatusChange = (driverId: string, newStatus: string) => {
    updateDriverStatus(driverId, { status: newStatus });
    toast.success(`Driver status updated to ${newStatus}`);
  };

  const handleSuspendDate = (driverId: string, date: string) => {
    updateDriverStatus(driverId, { suspendDate: date });
    toast.error('Driver suspension date recorded.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Driver Profiles</h1>
          <p className="text-slate-500">Manage driver credentials, duty status, and safety scores.</p>
        </div>

        {!isDispatcher && (
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
                <UserPlus className="mr-2 h-4 w-4" /> Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label>License Expiration Date</Label>
                  <Input type="date" value={licenseExpiry} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLicenseExpiry(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Initial Safety Score (0-100)</Label>
                  <Input type="number" min="0" max="100" value={safetyScore} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSafetyScore(e.target.value)} />
                </div>
                <Button type="submit" className="w-full bg-blue-600">Create Profile</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {drivers.map((driver: import('@/app/lib/store').Driver) => {
          const isExpired = new Date(driver.licenseExpiry) < new Date();
          const isHighRisk = driver.safetyScore < 80;

          return (
            <Card key={driver.id} className="overflow-hidden transition-shadow hover:shadow-md">
              <div className="h-2 bg-blue-600 w-full" />
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                  <User className="h-6 w-6 text-slate-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">{driver.name}</CardTitle>
                  <CardDescription>ID: {driver.id}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Safety Score
                  </span>
                  <span className={`font-bold ${isHighRisk ? 'text-red-600' : 'text-emerald-600'}`}>
                    {driver.safetyScore}/100
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    License Expiry
                  </span>
                  <div className="text-right">
                    <span className={isExpired ? 'text-red-600 font-bold' : 'text-slate-900'}>
                      {new Date(driver.licenseExpiry).toLocaleDateString()}
                    </span>
                    {isExpired && (
                      <div className="flex items-center gap-1 text-[10px] text-red-600 font-medium">
                        <AlertTriangle className="h-3 w-3" />
                        EXPIRED
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Select disabled={isDispatcher} value={driver.status} onValueChange={(val) => handleStatusChange(driver.id, val)}>
                      <SelectTrigger className="w-[130px] h-8 text-xs font-semibold">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                        <SelectItem value="Suspended" className="text-red-600">Suspend</SelectItem>
                        <SelectItem value="On Trip">On Trip</SelectItem>
                      </SelectContent>
                    </Select>

                    <Badge
                      variant="outline"
                      className={`transition-colors ${isDispatcher ? '' : 'cursor-pointer'} ${driver.isOnDuty ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                      onClick={() => !isDispatcher && toggleDuty(driver.id, driver.isOnDuty)}
                    >
                      <Power className="mr-1 h-3 w-3" />
                      {driver.isOnDuty ? 'On Duty' : 'Off Duty'}
                    </Badge>
                  </div>

                  {/* Suspension Date Input Field (Only visible when Suspended) */}
                  {driver.status === 'Suspended' && (
                    <div className="bg-red-50 p-3 rounded-md space-y-2 border border-red-100">
                      <Label className="text-xs text-red-800 font-bold uppercase tracking-wider">Set Suspension Target</Label>
                      <Input
                        type="date"
                        className="h-8 text-xs border-red-200"
                        disabled={isDispatcher}
                        value={driver.suspendDate ? new Date(driver.suspendDate).toISOString().split('T')[0] : ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSuspendDate(driver.id, e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
