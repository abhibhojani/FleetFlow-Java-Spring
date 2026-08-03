# FleetFlow 🚚💨

**Live Demo:** (https://fleet-flow-chi.vercel.app/)
**Backend API:** https://fleetflow-backend-nf95.onrender.com

**FleetFlow** is a modern, full-stack enterprise logistics application specifically engineered to monitor, dispatch, and manage vehicular fleets. Built rapidly and reliably for hackathon constraints, FleetFlow features a dynamic **Role-Based Access Control (RBAC)** architecture that naturally splits the software into two distinct views:

1. **The Dispatcher Hub:** An operational command center for validating capacities, assigning drivers, and tracking live logistics routes. 
2. **The Fleet Manager Dashboard:** A high-level view providing full CRUD control over the Vehicle Registry, Driver Profiles, Expense tracking, and Maintenance logs, alongside a read-only scoreboard of the Dispatcher's actions.

![FleetFlow Dispatcher](https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop)

---

## Tech Stack

### Frontend Architecture
- **React.js + Vite** for blazing-fast compiling and component rendering.
- **Tailwind CSS** for a highly responsive, modern utility-first aesthetic design.
- **Lucide React** for crisp, scalable vector iconography.
- **Radix UI** primitives for highly accessible dropdowns, dialogs, and interactive elements.
- **Zustand** (custom `store.tsx`) for robust global state management.

### Backend Architecture
- **Node.js + Express** providing strict, structured RESTful API endpoints.
- **MongoDB + Mongoose** schemas handling persistent, scalable data storage and lookups.
- **JWT (JSON Web Tokens) & bcrypt** for secure, hashed user authentication and authorization.

---

## Core Features

- **Dual-View RBAC Layout:** True data isolation. Dispatchers see only what they need to dispatch trips, while Managers see the big-picture financials and asset controls.
- **Dynamic Capacity Validation:** The Trip Dispatcher actively blocks route creation if the user inputs a cargo weight that physically exceeds the selected vehicle's internal payload limit.
- **Compliance Tracking:** The system aggressively flags and locks out Drivers whose operating licenses have expired strictly against the current real-time data.
- **Live Asset Filtering:** When a vehicle or driver is dispatched on a trip, they instantly vanish from the "Available" dispatch pool globally across the application.
- **Visual Status Tooling:** Everything from interactive Switch toggles to color-coded Badges providing instant clarity across massive tables of data.

---

## Quick Setup Guide

### Prerequisites
- Node.js (v18+)
- Local MongoDB installation or a MongoDB Atlas URI string

### 1. Clone the Repository
```bash
git clone https://github.com/abhibhojani/FleetFlow
cd FleetFlow
```

### 2. Configure the Backend
Navigate to the `server` directory and install the Node server dependencies.
```bash
cd server
npm install
```
Create a `.env` file in the `server` root directory and feed it your specific database secrets:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fleetflow
JWT_SECRET=super-secret-fleet-key-change-me
```
*Note: The app is configured to seek MongoDB locally on `27017` by default if a `.env` is not heavily configured.*

Start the backend server:
```bash
node server.js
```
*If successful, you will see `✅ MongoDB connected successfully`.*

### 3. Configure the Frontend
Open a new terminal session, navigate back to the **main project root**, and install the React dependencies.
```bash
cd ..
npm install
```

Start the Vite development build:
```bash
npm run dev
```

The application will hot-launch at `http://localhost:5173`. 

---

## Default Role Emulation
When creating a new account on the `/register` screen, you will be prompted to select either a **Fleet Manager** or **Dispatcher** role. This decision is permanently burned into your `localStorage` token and controls exactly which screens and features you are allowed to access via the Sidebar.

If you wish to test the limits of the software, we highly recommend opening two separate Incognito windows and logging into each role side-by-side!

---
*Built independently with React, Node.js, and MongoDB.*
