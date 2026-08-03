import React, { useState } from 'react';
import {
  MapPin,
  Package,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Truck,
  User,
  Check
} from 'lucide-react';
import { useFleetStore, Trip, TripStatus, Vehicle, Driver } from '@/app/lib/store';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { toast } from 'sonner';

export default function TripDispatcher() {
  const { vehicles, drivers, trips, addTrip, updateTripStatus, editVehicle } = useFleetStore();

  const role = localStorage.getItem('fleet_role') || 'manager';
  const isManager = role === 'manager';

  // Available Assets: Filter out unavailable
  const availableVehicles = vehicles.filter((v: Vehicle) => v.status === 'Available');
  const availableDrivers = drivers.filter((d: Driver) => {
    if (d.status !== 'Active') return false;
    const expiryDate = new Date(d.licenseExpiry);
    const today = new Date();
    return expiryDate >= today;
  });

  // Form State
  const [vehicleId, setVehicleId] = useState<string>('');
  const [driverId, setDriverId] = useState<string>('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [cargoWeight, setCargoWeight] = useState<number | ''>('');

  // Odometer Completion State
  const [completingTripId, setCompletingTripId] = useState<string | null>(null);
  const [finalOdometer, setFinalOdometer] = useState<number | ''>('');

  // Validation
  const selectedVehicle = vehicles.find((v: Vehicle) => v.id === vehicleId);
  const isOverweight = selectedVehicle && typeof cargoWeight === 'number' && cargoWeight > selectedVehicle.maxLoadCapacity;

  const handleDispatch = () => {
    if (!vehicleId || !driverId || !startLocation || !endLocation || !cargoWeight) {
      toast.error("Please fill in all details before dispatching.");
      return;
    }

    if (isOverweight) {
      toast.error("Cannot dispatch: Cargo weight exceeds vehicle capacity!");
      return;
    }

    addTrip({
      vehicleId,
      driverId,
      startLocation,
      endLocation,
      cargoWeight: Number(cargoWeight),
      status: 'Dispatched',
      startDate: new Date().toISOString()
    });

    toast.success("Trip successfully dispatched!");

    // Reset Form
    setVehicleId('');
    setDriverId('');
    setStartLocation('');
    setEndLocation('');
    setCargoWeight('');
  };

  const handleCompleteTrip = () => {
    if (completingTripId && finalOdometer !== '') {
      const trip = trips.find(t => t.id === completingTripId);
      if (trip && trip.vehicleId) {
        editVehicle(trip.vehicleId, { odometer: Number(finalOdometer) });
        updateTripStatus(completingTripId, 'Completed');
        setCompletingTripId(null);
        setFinalOdometer('');
        toast.success("Trip completed and Odometer updated!");
      }
    } else {
      toast.error("Please enter the final odometer reading.");
    }
  };

  const renderStepper = (status: TripStatus) => {
    const isCancelled = status === 'Cancelled';
    const isCompleted = status === 'Completed';

    let activeLevel = 1; // Dispatched is default for active table
    if (isCompleted) activeLevel = 2;
    if (isCancelled) activeLevel = 2; // For visual sake, cancel is end of line

    const stages = ['Draft', 'Dispatched', isCancelled ? 'Cancelled' : 'Completed'];

    return (
      <div className="flex items-center w-full max-w-[240px] gap-1">
        {stages.map((stage, idx) => {
          let isActive = false;
          let bgColor = 'bg-slate-200';
          let textColor = 'text-slate-400';

          if (idx === 0) {
            isActive = true; // Draft always passed
            bgColor = 'bg-blue-600';
            textColor = 'text-blue-700';
          } else if (idx === 1) {
            isActive = activeLevel >= 1;
            if (isActive) {
              bgColor = 'bg-blue-600';
              textColor = 'text-blue-700';
            }
          } else if (idx === 2) {
            isActive = activeLevel === 2;
            if (isActive) {
              bgColor = isCancelled ? 'bg-red-500' : 'bg-emerald-500';
              textColor = isCancelled ? 'text-red-600' : 'text-emerald-600';
            }
          }

          return (
            <div key={stage} className="flex-1 flex flex-col items-center">
              <div className={`h-1.5 w-full rounded-full transition-colors ${bgColor}`} />
              <span className={`text-[9px] uppercase font-bold mt-1 tracking-wider ${textColor}`}>
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // Group trips by vehicle
  const activeVehicleGroups = vehicles.map(vehicle => {
    const vehicleTrips = trips.filter(t => t.vehicleId === vehicle.id);
    return { vehicle, trips: vehicleTrips };
  }).filter(group => group.trips.length > 0);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top: Creation Form */}
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Trip Dispatcher</h1>

      {!isManager && (
        <>
          <div className="space-y-6">

            {/* Step 1: Select Vehicle */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                <Truck className="h-5 w-5 text-blue-600" />
                1. Select Available Vehicle
              </Label>
              {availableVehicles.length === 0 ? (
                <div className="text-sm text-slate-500 p-4 bg-slate-50 rounded-md border border-slate-200">
                  No vehicles available at the moment.
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                  {availableVehicles.map(v => (
                    <Card
                      key={v.id}
                      className={`min-w-[220px] max-w-[220px] snap-start cursor-pointer transition-all border-2 ${vehicleId === v.id ? 'border-blue-600 bg-blue-50/50 shadow-md' : 'border-slate-200 hover:border-blue-400'}`}
                      onClick={() => setVehicleId(v.id)}
                    >
                      <CardHeader className="p-4 pb-2 relative">
                        {vehicleId === v.id && (
                          <div className="absolute top-3 right-3 text-blue-600 bg-white rounded-full p-0.5 shadow-sm">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                        <CardTitle className="text-md flex items-center gap-2">
                          {v.name}
                        </CardTitle>
                        <CardDescription>{v.licensePlate}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-1 text-sm text-slate-600">
                        <div className="flex justify-between items-center bg-white p-2 rounded-md border text-xs">
                          <span className="text-slate-500">Max Capacity:</span>
                          <span className="font-bold text-slate-900">{v.maxLoadCapacity?.toLocaleString()} kg</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Select Driver */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                <User className="h-5 w-5 text-emerald-600" />
                2. Select Available Driver
              </Label>
              {availableDrivers.length === 0 ? (
                <div className="text-sm text-slate-500 p-4 bg-slate-50 rounded-md border border-slate-200">
                  No drivers active and ready at the moment.
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                  {availableDrivers.map(d => (
                    <Card
                      key={d.id}
                      className={`min-w-[220px] max-w-[220px] snap-start cursor-pointer transition-all border-2 ${driverId === d.id ? 'border-emerald-600 bg-emerald-50/50 shadow-md' : 'border-slate-200 hover:border-emerald-400'}`}
                      onClick={() => setDriverId(d.id)}
                    >
                      <CardHeader className="p-4 pb-2 relative">
                        {driverId === d.id && (
                          <div className="absolute top-3 right-3 text-emerald-600 bg-white rounded-full p-0.5 shadow-sm">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                        <CardTitle className="text-md flex items-center gap-2">
                          {d.name}
                        </CardTitle>
                        <CardDescription>Score: {d.safetyScore}/100</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Step 3: Logistics Details */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                <MapPin className="h-5 w-5 text-orange-600" />
                3. Logistics & Execution
              </Label>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-sm">
                {/* Route */}
                <div className="space-y-2 md:col-span-2">
                  <Label>Route Destination</Label>
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Origin Location"
                        className="pl-9 bg-white"
                        value={startLocation}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartLocation(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Final Destination"
                        className="pl-9 bg-white"
                        value={endLocation}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndLocation(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Cargo Weight */}
                <div className="space-y-2 lg:col-span-1">
                  <Label>Cargo Weight (kg)</Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="number"
                      placeholder="0"
                      className={`pl-9 bg-white transition-colors ${isOverweight ? 'border-red-500 focus-visible:ring-red-500 bg-red-50/50' : ''}`}
                      value={cargoWeight}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCargoWeight(e.target.value ? Number(e.target.value) : '')}
                    />
                  </div>

                  {/* Dynamic Validation Message */}
                  {isOverweight && (
                    <div className="flex items-center gap-2 text-red-600 mt-2 text-xs font-semibold animate-in fade-in">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>Capacity Exceeded ({selectedVehicle?.maxLoadCapacity} kg max)</span>
                    </div>
                  )}
                </div>

                {/* Action */}
                <div className="space-y-2 lg:col-span-1 flex flex-col justify-end">
                  <Button
                    className={`w-full h-11 text-md transition-colors shadow-sm ${isOverweight
                      ? 'bg-red-100 text-red-500 cursor-not-allowed hover:bg-red-100'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    onClick={handleDispatch}
                    disabled={!vehicleId || !driverId || !startLocation || !endLocation || cargoWeight === '' || isOverweight}
                  >
                    Dispatch Trip
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

          </div>

          <div className="w-full h-px bg-slate-200 my-4" />
        </>
      )}

      {/* Bottom: Trip Monitor (Grouped by Vehicle) */}
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 pt-4">Trip Monitor</h2>
      <p className="text-slate-500 mb-4">Live feed of active and completed logistics routes, grouped by vehicle.</p>

      <div className="space-y-8">
        {activeVehicleGroups.length === 0 ? (
          <Card className="bg-slate-50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Truck className="h-12 w-12 text-slate-300 mb-4" />
              <p className="font-semibold text-lg">No Active Trips</p>
              <p className="text-sm">There are no Dispatched, Completed, or Cancelled trips in history.</p>
            </CardContent>
          </Card>
        ) : (
          activeVehicleGroups.map(group => (
            <Card key={group.vehicle.id} className="shadow-sm overflow-hidden border-t-4 border-t-slate-800">
              <div className="bg-slate-100 px-6 py-4 flex items-center justify-between border-b">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-md shadow-sm border border-slate-200">
                    <Truck className="h-5 w-5 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{group.vehicle.name}</h3>
                    <p className="text-xs text-slate-500">{group.vehicle.licensePlate}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-white">{group.trips.length} Trips Logged</Badge>
              </div>

              <Table>
                <TableHeader className="bg-white">
                  <TableRow>
                    <TableHead className="font-semibold">Route Delivery</TableHead>
                    <TableHead className="font-semibold">Assigned Driver</TableHead>
                    <TableHead className="font-semibold text-right">Cargo Load</TableHead>
                    <TableHead className="font-semibold text-center w-[200px]">Lifecycle Stage</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                  {[...group.trips].reverse().map((trip: Trip) => {
                    const driver = drivers.find((d: Driver) => d.id === trip.driverId);

                    return (
                      <TableRow key={trip.id} className="hover:bg-slate-50/50">
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-slate-900">{trip.startLocation}</span>
                            <span className="text-slate-400 text-xs flex items-center gap-1">
                              <ArrowRight className="h-3 w-3" /> {trip.endLocation}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                              <User className="h-3 w-3 text-slate-500" />
                            </div>
                            <span className="text-sm font-medium text-slate-800">{driver?.name || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium text-slate-700">
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                            {trip.cargoWeight?.toLocaleString() || 0} kg
                          </Badge>
                        </TableCell>
                        <TableCell className="flex justify-center py-4">
                          {renderStepper(trip.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          {trip.status === 'Dispatched' ? (
                            isManager ? (
                              <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-medium shadow-none">
                                {trip.status}
                              </Badge>
                            ) : (
                              <div className="flex gap-2 justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 border-emerald-200"
                                  onClick={() => {
                                    setCompletingTripId(trip.id);
                                    setFinalOdometer(group.vehicle?.odometer || '');
                                  }}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" /> Finish
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-slate-600 hover:text-red-700 hover:bg-red-50 border-slate-200"
                                  onClick={() => updateTripStatus(trip.id, 'Cancelled')}
                                >
                                  <XCircle className="h-4 w-4 mr-1" /> Abort
                                </Button>
                              </div>
                            )
                          ) : (
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-medium shadow-none">
                              {trip.status}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          ))
        )}
      </div>

      {/* Completion Dialog */}
      <Dialog open={!!completingTripId} onOpenChange={(open) => !open && setCompletingTripId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Trip</DialogTitle>
            <DialogDescription>
              Please enter the final odometer reading for this vehicle to complete the trip.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="odometer" className="text-right">
                Odometer
              </Label>
              <Input
                id="odometer"
                type="number"
                value={finalOdometer}
                onChange={(e) => setFinalOdometer(e.target.value ? Number(e.target.value) : '')}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompletingTripId(null)}>Cancel</Button>
            <Button onClick={handleCompleteTrip} className="bg-blue-600 hover:bg-blue-700">Confirm Completion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
