import React from "react";
import { useNavigate } from "react-router";

const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-red-600">403 - Forbidden</h1>
      <p className="text-lg mt-4 text-gray-600">
        You don’t have permission to access this page.
      </p>
      <button className="btn btn-primary mt-6" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

export default ForbiddenPage;
