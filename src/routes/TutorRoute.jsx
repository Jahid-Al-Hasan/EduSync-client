import React from "react";
import { useAuth } from "../hooks/useAuth";
import LoadingPage from "../components/LoadingPage/LoadingPage";
import { Navigate } from "react-router";

const TutorRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (user.role !== "tutor") {
    return <Navigate state={location?.pathname} to="/forbidden"></Navigate>;
  }
  return children;
};

export default TutorRoute;
