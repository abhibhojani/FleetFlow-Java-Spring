import React, { useState } from 'react';
import {
  Plus,
  Search,
  MoreHorizontal,
  Filter,
  Edit,
  Trash2,
  PowerOff
} from 'lucide-react';
import { useFleetStore, Vehicle, VehicleStatus } from '@/app/lib/store';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Switch } from '@/app/components/ui/switch';

const STATUS_COLORS: Record<VehicleStatus, string> = {
  'Available': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'On Trip': 'bg-blue-100 text-blue-800 border-blue-200',
  'In Shop': 'bg-amber-100 text-amber-800 border-amber-200',
  'Out of Service': 'bg-slate-200 text-slate-500 border-slate-300',
};

export default function VehicleRegistry() {
  const { vehicles, addVehicle, updateVehicleStatus, editVehicle, deleteVehicle } = useFleetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const role = localStorage.getItem('fleet_role') || 'manager';
  const isDispatcher = role === 'dispatcher';

  // New Vehicle Form State
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    name: '',
    model: '',
    licensePlate: '',
    maxLoadCapacity: 0,
    odometer: 0,
    status: 'Available',
    type: 'Truck',
    region: 'North'
  });

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVehicle.name && newVehicle.licensePlate && newVehicle.maxLoadCapacity) {
      addVehicle({
        name: newVehicle.name,
        model: newVehicle.model || '',
        licensePlate: newVehicle.licensePlate,
        maxLoadCapacity: Number(newVehicle.maxLoadCapacity),
        odometer: Number(newVehicle.odometer) || 0,
        status: 'Available',
        type: newVehicle.type as any || 'Truck',
        region: newVehicle.region || 'North',
      });
      setIsAddDialogOpen(false);
      setNewVehicle({ name: '', model: '', licensePlate: '', maxLoadCapacity: 0, odometer: 0, status: 'Available', type: 'Truck', region: 'North' });
    }
  };

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  const handleEditOpen = (vehicle: Vehicle) => {
    setNewVehicle({ ...vehicle });
    setEditingVehicleId(vehicle.id);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicleId) {
      editVehicle(editingVehicleId, newVehicle);
      setIsEditDialogOpen(false);
      setEditingVehicleId(null);
    }
  };

  const handleDelete = (id: string) => {
    deleteVehicle(id);
  };

  const toggleOutOfService = (vehicle: Vehicle) => {
    const newStatus = vehicle.status === 'Out of Service' ? 'Available' : 'Out of Service';
    updateVehicleStatus(vehicle.id, newStatus);
  };

  const filteredVehicles = vehicles.filter((v: Vehicle) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Vehicle Registry</h1>
          <p className="text-slate-500">Manage your fleet assets and status.</p>
        </div>

        {!isDispatcher && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add New Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Vehicle</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddVehicle} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    value={newVehicle.name || ''}
                    onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g. Volvo FH16"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="model" className="text-right">Model</Label>
                  <Input
                    id="model"
                    value={newVehicle.model || ''}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g. FH16 750"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="license" className="text-right">License</Label>
                  <Input
                    id="license"
                    value={newVehicle.licensePlate || ''}
                    onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g. KX-55-99"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">Capacity (kg)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={newVehicle.maxLoadCapacity || ''}
                    onChange={(e) => setNewVehicle({ ...newVehicle, maxLoadCapacity: Number(e.target.value) })}
                    className="col-span-3"
                    placeholder="e.g. 25000"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="odometer" className="text-right">Odometer</Label>
                  <Input
                    id="odometer"
                    type="number"
                    value={newVehicle.odometer || ''}
                    onChange={(e) => setNewVehicle({ ...newVehicle, odometer: Number(e.target.value) })}
                    className="col-span-3"
                    placeholder="e.g. 0"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Type</Label>
                  <Select
                    value={newVehicle.type}
                    onValueChange={(val) => setNewVehicle({ ...newVehicle, type: val as any })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Truck">Truck</SelectItem>
                      <SelectItem value="Van">Van</SelectItem>
                      <SelectItem value="Car">Car</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="region" className="text-right">Region</Label>
                  <Select
                    value={newVehicle.region}
                    onValueChange={(val) => setNewVehicle({ ...newVehicle, region: val })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="North">North</SelectItem>
                      <SelectItem value="South">South</SelectItem>
                      <SelectItem value="East">East</SelectItem>
                      <SelectItem value="West">West</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Vehicle</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by License Plate, Name, or Model..."
            className="pl-9 bg-white border-slate-200 focus-visible:ring-blue-600 transition-shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 border-slate-200 text-slate-700 hover:bg-slate-50">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-900 border-b-0">
            <TableRow className="hover:bg-slate-900">
              <TableHead className="text-slate-100 font-medium py-3">Vehicle Details</TableHead>
              <TableHead className="text-slate-100 font-medium py-3">License Plate (ID)</TableHead>
              <TableHead className="text-slate-100 font-medium py-3">Region</TableHead>
              <TableHead className="text-slate-100 font-medium py-3 text-right">Odometer</TableHead>
              <TableHead className="text-slate-100 font-medium py-3 text-right">Max Load</TableHead>
              <TableHead className="text-slate-100 font-medium py-3 text-center">Status</TableHead>
              <TableHead className="text-slate-100 font-medium py-3 text-center">Service Toggle</TableHead>
              <TableHead className="text-slate-100 font-medium py-3 text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-slate-500">
                  No vehicles found.
                </TableCell>
              </TableRow>
            ) : (
              filteredVehicles.map((vehicle: Vehicle) => {
                const isOutOfService = vehicle.status === 'Out of Service';
                return (
                  <TableRow
                    key={vehicle.id}
                    className={`transition-colors ${isOutOfService ? 'bg-slate-50/80 opacity-60 grayscale-[0.2]' : 'hover:bg-slate-50'}`}
                  >
                    <TableCell className="py-3">
                      <div className={`font-semibold ${isOutOfService ? 'text-slate-500' : 'text-slate-900'}`}>{vehicle.name}</div>
                      <div className="text-xs text-slate-500">{vehicle.model} • {vehicle.type}</div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 font-mono text-sm font-medium text-slate-800 border border-slate-200">
                        {vehicle.licensePlate}
                      </div>
                    </TableCell>
                    <TableCell className={`py-3 ${isOutOfService ? 'text-slate-400' : 'text-slate-600'}`}>{vehicle.region}</TableCell>
                    <TableCell className={`py-3 text-right font-medium ${isOutOfService ? 'text-slate-400' : 'text-slate-700'}`}>
                      {vehicle.odometer?.toLocaleString() || '0'} <span className="text-xs text-slate-400 font-normal">km</span>
                    </TableCell>
                    <TableCell className={`py-3 text-right font-medium ${isOutOfService ? 'text-slate-400' : 'text-slate-700'}`}>
                      {vehicle.maxLoadCapacity?.toLocaleString() || '0'} <span className="text-xs text-slate-400 font-normal">kg</span>
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <Badge
                        variant="outline"
                        className={`font-medium border shadow-sm ${STATUS_COLORS[vehicle.status]}`}
                      >
                        {vehicle.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <div className="flex items-center justify-center space-x-2" title="Toggle Out of Service">
                        <Switch
                          checked={!isOutOfService}
                          onCheckedChange={() => toggleOutOfService(vehicle)}
                          disabled={isDispatcher}
                          className={isOutOfService ? 'bg-slate-300' : 'bg-blue-600'}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-right pr-4">
                      {!isDispatcher && (
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => handleEditOpen(vehicle)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(vehicle.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
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
      </div>
    </div>
  );
}
