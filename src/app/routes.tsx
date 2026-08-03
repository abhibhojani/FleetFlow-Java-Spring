import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import VehicleRegistry from "./pages/VehicleRegistry";
import TripDispatcher from "./pages/TripDispatcher";
import MaintenanceLogs from "./pages/MaintenanceLogs";
import ExpenseFuel from "./pages/ExpenseFuel";
import DriverProfiles from "./pages/DriverProfiles";
import Analytics from "./pages/Analytics";
import { DashboardLayout } from "./layouts/DashboardLayout";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "registry",
        Component: VehicleRegistry,
      },
      {
        path: "dispatcher",
        Component: TripDispatcher,
      },
      {
        path: "maintenance",
        Component: MaintenanceLogs,
      },
      {
        path: "expenses",
        Component: ExpenseFuel,
      },
      {
        path: "drivers",
        Component: DriverProfiles,
      },
      {
        path: "analytics",
        Component: Analytics,
      },
    ],
  },
]);
