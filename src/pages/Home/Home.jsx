import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure.jsx";

const Home = () => {
  const axiosSecure = useAxiosSecure();

  const handleCheck = async () => {
    try {
      const res = await axiosSecure.get("/data");
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h1 className="">This is home page</h1>
      <button onClick={() => handleCheck()} className="btn btn-primary btn-sm">
        check header
      </button>
    </div>
  );
};

export default Home;
