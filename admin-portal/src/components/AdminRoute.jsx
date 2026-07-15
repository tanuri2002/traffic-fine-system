import { Navigate } from "react-router-dom";

import { getOfficer, getToken } from "../services/authService";

function AdminRoute({ children }) {
  const token = getToken();
  const officer = getOfficer();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (officer?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;