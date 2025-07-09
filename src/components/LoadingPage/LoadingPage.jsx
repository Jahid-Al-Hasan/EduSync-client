import React from "react";

const LoadingPage = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4 bg-base-100 text-base-content">
      {/* DaisyUI Spinner */}
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="text-lg font-semibold">{message}</p>
    </div>
  );
};

export default LoadingPage;
