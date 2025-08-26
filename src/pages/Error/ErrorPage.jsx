import { AlertCircle, Home, RefreshCw } from "lucide-react";
import React from "react";
import { Link } from "react-router";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card-body items-center text-center">
        {/* Error Icon */}
        <AlertCircle className="w-10 h-10 md:w-16 md:h-16 text-error" />

        {/* Error Code */}
        <h1 className="text-3xl md:text-6xl font-bold text-error">404</h1>

        {/* Error Message */}
        <p className="text-base md:text-lg">Page Not Found</p>

        {/* Action Buttons */}
        <div className="card-actions justify-center gap-2 mt-6">
          <button
            className="btn btn-primary btn-sm md:btn-md"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>

          <Link to="/" className="btn btn-primary btn-outline btn-sm md:btn-md">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
