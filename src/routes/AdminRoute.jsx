import React from "react";
import { useAuth } from "../hooks/useAuth";
import LoadingPage from "../components/LoadingPage/LoadingPage";
import { Navigate } from "react-router";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (user.role !== "admin") {
    return <Navigate state={location?.pathname} to="/forbidden"></Navigate>;
  }
  return children;
};

export default AdminRoute;
