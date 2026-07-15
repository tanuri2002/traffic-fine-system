import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DistrictStatsPage from "./pages/DistrictStatsPage";
import CategoryBreakdownPage from "./pages/CategoryBreakdownPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/district-stats"
          element={
            <ProtectedRoute>
              <DistrictStatsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/category-breakdown"
          element={
            <ProtectedRoute>
              <CategoryBreakdownPage />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;