import React from "react";
import { useAuth } from "../hooks/useAuth";
import LoadingPage from "../components/LoadingPage/LoadingPage";
import { Navigate } from "react-router";

const StudentRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (user.role !== "student") {
    return <Navigate state={location?.pathname} to="/forbidden"></Navigate>;
  }
  return children;
};

export default StudentRoute;
