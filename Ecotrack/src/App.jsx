import Header from "./components/header";
import Logs from "./pages/logs";
import Dashboard from "./pages/dashboard";
import { logs } from "./data/logs";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./pages/dashboardLayout";
import DashboardAnalytics from "./pages/dashboardAnalytic";
import DashboardSummary from "./pages/dashboardSummary";
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Header title="EcoTrack - Carbon Footprint Tracker Experiment 1" />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route index element={<DashboardSummary />} />
          <Route path="analytics" element={<DashboardAnalytics />} />
          <Route path="summary" element={<DashboardSummary />} />
          <Route
            path="/logs"
            element={
              <ProtectedRoute>
                <Logs logs={logs} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
