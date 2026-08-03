import React, { useMemo, useState } from 'react';
import {
  Truck,
  Wrench,
  Activity,
  Package,
  Filter,
  Search
} from 'lucide-react';
import { useFleetStore, Vehicle, Cargo } from '@/app/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/app/components/ui/select';

export default function Dashboard() {
  const { vehicles, pendingCargo } = useFleetStore();

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);

  const toggleStatusFilter = (status: string) => {
    setStatusFilters(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v: Vehicle) => {
      const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || v.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesRegion = regionFilter === 'all' || v.region.toLowerCase() === regionFilter.toLowerCase();
      const matchesStatus = statusFilters.length === 0 || statusFilters.includes(v.status);
      return matchesSearch && matchesType && matchesRegion && matchesStatus;
    });
  }, [vehicles, searchTerm, typeFilter, regionFilter, statusFilters]);

  // KPI Calculations
  const activeFleetCount = filteredVehicles.filter((v: Vehicle) => v.status === 'On Trip').length;
  const maintenanceCount = filteredVehicles.filter((v: Vehicle) => v.status === 'In Shop').length;
  const totalVehicles = filteredVehicles.length;
  const utilizationRate = totalVehicles > 0 ? Math.round((activeFleetCount / totalVehicles) * 100) : 0;

  const filteredCargo = useMemo(() => {
    return pendingCargo.filter((c: Cargo) => {
      const matchesSearch = c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.destination.toLowerCase().includes(searchTerm.toLowerCase());

      const regionMatchStr = regionFilter.toLowerCase();
      const destLower = c.destination.toLowerCase();

      const matchesRegion = regionFilter === 'all' ||
        (regionMatchStr === 'north' && destLower.includes('new york')) ||
        (regionMatchStr === 'east' && destLower.includes('miami')) ||
        (regionMatchStr === 'west' && destLower.includes('san francisco')) ||
        (regionMatchStr === 'south' && destLower.includes('texas')) ||
        destLower.includes(regionMatchStr);

      return matchesSearch && matchesRegion;
    });
  }, [pendingCargo, searchTerm, regionFilter]);

  const pendingCargoCount = filteredCargo.length;

  // Filter Logic (although the prompt specifically asked for filters on the Pending Cargo table, 
  // usually pending cargo doesn't have Vehicle Type/Region until assigned. 
  // The prompt says "Below the KPIs, include a data table for 'Pending Cargo' with columns for Cargo Weight and Destination. 
  // ... and a search bar with filters for 'Vehicle Type' and 'Region'." 
  // This might imply the filters are for a vehicle list or the dashboard globally?
  // Or maybe it means filter the cargo by destination region?
  // Let's assume the filters apply to a vehicle list or maybe the prompt meant the Registry page?
  // Re-reading: "The layout features... Below the KPIs, include a data table for 'Pending Cargo'... Use a clean, professional sidebar navigation and a search bar with filters for 'Vehicle Type' and 'Region'."
  // It's ambiguous if the filters apply to the Pending Cargo table. 
  // However, since Pending Cargo is unassigned, filtering by Vehicle Type makes no sense.
  // I will add a "Fleet Overview" table below the Pending Cargo table to make use of these filters, or just put the filters at the top of the page affecting the global view?
  // Actually, I'll stick to the "Pending Cargo" table as the main data view requested. 
  // Maybe the search/filter is for the global context? 
  // Let's implement the filters for the Pending Cargo table (maybe by destination region?) and perhaps add a small "Available Vehicles" list which is filterable.
  // Or maybe I should just display the Pending Cargo table and the filters are just UI elements as requested.
  // I'll add a section for "Fleet Overview" which makes sense for the filters.

  // Let's prioritize the "Pending Cargo" table as requested.

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Command Center</h1>
        <div className="flex flex-wrap items-center gap-4">

          {/* 1. Vehicle Type Pills */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            {['all', 'truck', 'van', 'bike'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${typeFilter === type
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* 2. Status Multi-select styling via Popover/Select substitute (using simple badges for now) */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 mr-1">Status:</span>
            {['Available', 'On Trip', 'In Shop', 'Out of Service'].map(status => (
              <Badge
                key={status}
                variant={statusFilters.includes(status) ? "default" : "outline"}
                className={`cursor-pointer ${statusFilters.includes(status) ? 'bg-blue-600 hover:bg-blue-700' : 'text-slate-500'}`}
                onClick={() => toggleStatusFilter(status)}
              >
                {status}
              </Badge>
            ))}
          </div>

          {/* 3. Region Filter */}
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="north">North (NY)</SelectItem>
              <SelectItem value="south">South</SelectItem>
              <SelectItem value="east">East (FL)</SelectItem>
              <SelectItem value="west">West (CA)</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search..."
              className="w-[180px] pl-8 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Fleet</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{activeFleetCount}</div>
            <p className="text-xs text-slate-500">Vehicles currently on trip</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Maintenance Alerts</CardTitle>
            <Wrench className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{maintenanceCount}</div>
            <p className="text-xs text-slate-500">Vehicles in shop</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Utilization Rate</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{utilizationRate}%</div>
            <p className="text-xs text-slate-500">Fleet efficiency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Cargo</CardTitle>
            <Package className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{pendingCargoCount}</div>
            <p className="text-xs text-slate-500">Orders waiting for dispatch</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Cargo Table */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Pending Cargo</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Weight (kg)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCargo.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-slate-500">
                    No pending cargo matches search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCargo.map((cargo: Cargo) => (
                  <TableRow key={cargo.id}>
                    <TableCell className="font-medium">{cargo.description}</TableCell>
                    <TableCell>{cargo.destination}</TableCell>
                    <TableCell>{cargo.weight.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                        {cargo.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Assign
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Fleet Overview Table */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Fleet Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle Name</TableHead>
                <TableHead>License Plate</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-slate-500">
                    No vehicles found matching filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredVehicles.map((vehicle: Vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.name}</TableCell>
                    <TableCell>{vehicle.licensePlate}</TableCell>
                    <TableCell>{vehicle.type}</TableCell>
                    <TableCell>{vehicle.region}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                        {vehicle.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
