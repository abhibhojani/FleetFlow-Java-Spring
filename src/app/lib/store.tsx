import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export type VehicleStatus = 'Available' | 'On Trip' | 'In Shop' | 'Out of Service';

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  licensePlate: string;
  maxLoadCapacity: number; // in kg
  odometer: number;
  status: VehicleStatus;
  type: 'Truck' | 'Van' | 'Car' | 'Bike';
  region: string;
  imageUrl?: string;
}

export interface Driver {
  id: string;
  name: string;
  licenseExpiry: string; // ISO date string
  safetyScore: number; // 0-100
  status: 'Active' | 'On Leave' | 'Suspended' | 'On Trip';
  isOnDuty?: boolean;
  suspendDate?: string;
  imageUrl?: string;
  assignedVehicleId?: string;
}

export type TripStatus = 'Draft' | 'Dispatched' | 'Completed' | 'Cancelled';

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  startLocation: string;
  endLocation: string;
  cargoWeight: number;
  status: TripStatus;
  createdAt: string;
  startDate?: string;
  endDate?: string;
}

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  cost: number;
  status: 'Pending' | 'Completed';
}

export interface ExpenseLog {
  id: string;
  vehicleId: string;
  date: string;
  type: 'Fuel' | 'Maintenance' | 'Other';
  amount: number;
  liters?: number; // for fuel
}

export interface Cargo {
  id: string;
  weight: number;
  destination: string;
  description: string;
  status: 'Pending' | 'Assigned' | 'Delivered';
  createdAt: string;
}

interface FleetContextType {
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  maintenanceLogs: MaintenanceLog[];
  expenseLogs: ExpenseLog[];
  pendingCargo: Cargo[];

  // Actions
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
  updateVehicleStatus: (id: string, status: VehicleStatus) => Promise<void>;
  editVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;

  addDriver: (driver: Omit<Driver, 'id'>) => Promise<void>;
  updateDriverStatus: (id: string, updates: Partial<Driver>) => Promise<void>;

  addTrip: (trip: Omit<Trip, 'id' | 'createdAt'>) => void;
  updateTripStatus: (id: string, status: TripStatus) => void;

  addMaintenanceLog: (log: Omit<MaintenanceLog, 'id'>) => Promise<void>;
  editMaintenanceLog: (id: string, logUpdate: Partial<MaintenanceLog>) => Promise<void>;

  addExpenseLog: (log: Omit<ExpenseLog, 'id'>) => Promise<void>;
  addCargo: (cargo: Omit<Cargo, 'id' | 'createdAt' | 'status'>) => void;
}

const FleetContext = createContext<FleetContextType | undefined>(undefined);

const MOCK_VEHICLES: Vehicle[] = []; // Removed mock data, initializing empty array for API

const MOCK_DRIVERS: Driver[] = [];

const MOCK_CARGO: Cargo[] = [
  { id: 'c1', weight: 5000, destination: 'New York, NY', description: 'Electronics', status: 'Pending', createdAt: new Date().toISOString() },
  { id: 'c2', weight: 12000, destination: 'Chicago, IL', description: 'Steel Beams', status: 'Pending', createdAt: new Date().toISOString() },
  { id: 'c3', weight: 800, destination: 'Miami, FL', description: 'Perishables', status: 'Pending', createdAt: new Date().toISOString() },
];

export function FleetProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [expenseLogs, setExpenseLogs] = useState<ExpenseLog[]>([]);
  const [pendingCargo, setPendingCargo] = useState<Cargo[]>(MOCK_CARGO);

  useEffect(() => {
    // Fetch vehicles on load
    fetch('http://localhost:5000/api/vehicles')
      .then(res => res.json())
      .then(data => setVehicles(data.map((item: any) => ({ ...item, id: item._id || item.id }))))
      .catch(err => console.error("Failed to load vehicles:", err));

    // Fetch drivers on load
    fetch('http://localhost:5000/api/drivers')
      .then(res => res.json())
      .then(data => setDrivers(data.map((item: any) => ({ ...item, id: item._id || item.id }))))
      .catch(err => console.error("Failed to load drivers:", err));

    // Fetch maintenance logs on load
    fetch('http://localhost:5000/api/maintenance')
      .then(res => res.json())
      .then(data => setMaintenanceLogs(data.map((item: any) => ({ ...item, id: item._id || item.id }))))
      .catch(err => console.error("Failed to load maintenance logs:", err));

    // Fetch expense logs on load
    fetch('http://localhost:5000/api/expenses')
      .then(res => res.json())
      .then(data => setExpenseLogs(data.map((item: any) => ({ ...item, id: item._id || item.id }))))
      .catch(err => console.error("Failed to load expense logs:", err));
  }, []);

  const addVehicle = async (vehicle: Omit<Vehicle, 'id'>) => {
    try {
      const response = await fetch('http://localhost:5000/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicle)
      });
      if (response.ok) {
        const newDoc = await response.json();
        setVehicles(prev => [{ ...newDoc, id: newDoc._id || newDoc.id }, ...prev]);
      } else {
        const err = await response.json();
        alert(err.message || 'Error creating vehicle');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateVehicleStatus = async (id: string, status: VehicleStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        setVehicles(prev => prev.map(v => v.id === id ? { ...v, status } : v));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const editVehicle = async (id: string, vehicleUpdate: Partial<Vehicle>) => {
    try {
      const response = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleUpdate)
      });
      if (response.ok) {
        let updatedVehicle = await response.json();
        updatedVehicle = { ...updatedVehicle, id: updatedVehicle._id || updatedVehicle.id };
        setVehicles(prev => prev.map(v => v.id === id ? updatedVehicle : v));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteVehicle = async (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this vehicle?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setVehicles(prev => prev.filter(v => v.id !== id));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const addDriver = async (driver: Omit<Driver, 'id'>) => {
    try {
      const response = await fetch('http://localhost:5000/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(driver)
      });
      if (response.ok) {
        const newDoc = await response.json();
        setDrivers(prev => [{ ...newDoc, id: newDoc._id || newDoc.id }, ...prev]);
      } else {
        const err = await response.json();
        alert(err.message || 'Error creating driver');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateDriverStatus = async (id: string, updates: Partial<Driver>) => {
    try {
      const response = await fetch(`http://localhost:5000/api/drivers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        let updatedDriver = await response.json();
        updatedDriver = { ...updatedDriver, id: updatedDriver._id || updatedDriver.id };
        setDrivers(prev => prev.map(d => d.id === id ? updatedDriver : d));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addTrip = (trip: Omit<Trip, 'id' | 'createdAt'>) => {
    const newTrip = {
      ...trip,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setTrips([...trips, newTrip]);

    // Automatically update vehicle and driver status if dispatched
    if (trip.status === 'Dispatched') {
      updateVehicleStatus(trip.vehicleId, 'On Trip');
      updateDriverStatus(trip.driverId, { status: 'On Trip' });
    }
  };

  const updateTripStatus = (id: string, status: TripStatus) => {
    const trip = trips.find(t => t.id === id);
    setTrips(trips.map(t => t.id === id ? { ...t, status } : t));

    if (trip) {
      if (status === 'Completed' || status === 'Cancelled') {
        updateVehicleStatus(trip.vehicleId, 'Available');
        updateDriverStatus(trip.driverId, { status: 'Active' });
      }
    }
  };

  const addMaintenanceLog = async (log: Omit<MaintenanceLog, 'id'>) => {
    try {
      const response = await fetch('http://localhost:5000/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: log.vehicleId,
          type: log.description.split(' - ')[0] || 'General',
          description: log.description,
          date: log.date,
          cost: log.cost,
          status: log.status === 'Pending' ? 'Scheduled' : log.status
        })
      });
      if (response.ok) {
        const newDoc = await response.json();
        // The frontend model expects "Pending" or "Completed", but our backend is "Scheduled", "In Progress", "Completed".
        // Re-mapping for local store sync:
        const mappedDoc = {
          ...newDoc,
          id: newDoc._id || newDoc.id,
          status: newDoc.status === 'Completed' ? 'Completed' : 'Pending'
        };
        setMaintenanceLogs(prev => [mappedDoc, ...prev]);
        updateVehicleStatus(log.vehicleId, 'In Shop');
      } else {
        const err = await response.json();
        alert(err.message || 'Error creating maintenance log');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const editMaintenanceLog = async (id: string, logUpdate: Partial<MaintenanceLog>) => {
    try {
      const response = await fetch(`http://localhost:5000/api/maintenance/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logUpdate)
      });
      if (response.ok) {
        const updatedLog = await response.json();
        const mappedDoc = {
          ...updatedLog,
          id: updatedLog._id || updatedLog.id,
          status: updatedLog.status === 'Completed' ? 'Completed' : 'Pending'
        };
        setMaintenanceLogs(prev => prev.map(l => l.id === id ? mappedDoc : l));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addExpenseLog = async (log: Omit<ExpenseLog, 'id'>) => {
    try {
      const response = await fetch('http://localhost:5000/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
      });
      if (response.ok) {
        const newDoc = await response.json();
        setExpenseLogs(prev => [{ ...newDoc, id: newDoc._id || newDoc.id }, ...prev]);
      } else {
        const err = await response.json();
        alert(err.message || 'Error creating expense log');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addCargo = (cargo: Omit<Cargo, 'id' | 'createdAt' | 'status'>) => {
    const newCargo = {
      ...cargo,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'Pending' as const
    };
    setPendingCargo([...pendingCargo, newCargo]);
  };

  return (
    <FleetContext.Provider value={{
      vehicles,
      drivers,
      trips,
      maintenanceLogs,
      expenseLogs,
      pendingCargo,
      addVehicle,
      updateVehicleStatus,
      editVehicle,
      deleteVehicle,
      addDriver,
      updateDriverStatus,
      addTrip,
      updateTripStatus,
      addMaintenanceLog,
      editMaintenanceLog,
      addExpenseLog,
      addCargo
    }}>
      {children}
    </FleetContext.Provider>
  );
}

export const useFleetStore = () => {
  const context = useContext(FleetContext);
  if (context === undefined) {
    throw new Error('useFleetStore must be used within a FleetProvider');
  }
  return context;
};
