import { Link, useNavigate } from "react-router";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserShield,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import AuthContext from "../../contexts/auth/AuthContext";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import Swal from "sweetalert2";

const Signup = () => {
  const { user, loading, registerUser, profileUpdate } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [selectedRole, setSelectedRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);

      const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMGBB_API
      }`;

      const res = await axios.post(imageUploadUrl, formData);
      setPreviewUrl(res.data.data.url);
    } catch (error) {
      console.log("Image upload failed:", error.message);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log(data);
    try {
      const userCredential = await registerUser(data.email, data.password);

      if (userCredential.user) {
        const userData = {
          email: data.email,
          role: selectedRole,
          lastSignIn: new Date().toISOString(),
        };

        const userRes = await axios.post(
          "http://localhost:3000/api/registerUser",
          userData
        );

        if (!userRes.data.insertedId) {
          Swal.fire("Firebase registration failed!");
        } else {
          if (data.name || previewUrl) {
            profileUpdate(data.name, previewUrl).catch((err) => {
              console.log(err);
              Swal.fire("Registration failed");
            });
            Swal.fire({
              title: "Register successfully",
              icon: "success",
              draggable: true,
            });
            reset();
            navigate(location?.state || "/");
          }
        }
      } else {
        Swal.fire("Registration failed");
      }
    } catch (error) {
      Swal.fire(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-2 lg:px-4 py-10 bg-base-200 text-base-content">
      <div className="card w-full max-w-2xl bg-base-100 border border-base-300 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold mb-6 text-center">
            Create an Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="form-control lg:flex lg:flex-row lg:items-center lg:gap-x-4">
              <label className="label w-full lg:w-1/3">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className={`input input-bordered w-full ${
                  errors.name ? "input-error" : ""
                }`}
                {...register("name", { required: "Name is required" })}
              />
            </div>
            {errors.name && (
              <p className="text-error text-sm ml-auto">
                {errors.name.message}
              </p>
            )}

            {/* Email */}
            <div className="form-control lg:flex lg:flex-row lg:items-center lg:gap-x-4">
              <label className="label w-full lg:w-1/3">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^@]+@[^@]+\.[^@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-error text-sm ml-auto">
                {errors.email.message}
              </p>
            )}

            {/* Upload Photo */}
            <div className="form-control lg:flex lg:flex-row lg:items-center lg:gap-x-4">
              <label className="label w-full lg:w-1/3">
                <span className="label-text"> Upload Photo (Optional)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="input input-bordered w-full"
              />
              {previewUrl && (
                <div className="mt-2 lg:ml-[33%]">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-24 h-24 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Password */}
            <div className="form-control lg:flex lg:flex-row lg:items-center lg:gap-x-4">
              <label className="label w-full lg:w-1/3">
                <span className="label-text">Password</span>
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered w-full pr-10 ${
                    errors.password ? "input-error" : ""
                  }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-10 right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            {errors.password && (
              <p className="text-error text-sm ml-auto">
                {errors.password.message}
              </p>
            )}

            {/* Role Selection */}
            <div className="form-control lg:flex lg:flex-row lg:items-center lg:gap-x-4">
              <label className="label w-full lg:w-1/3">
                <span className="label-text">Register As</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={selectedRole === "student"}
                    onChange={() => setSelectedRole("student")}
                    className="radio radio-primary"
                  />
                  <span className="flex items-center gap-1 font-medium">
                    <FaUserGraduate /> Student
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="tutor"
                    checked={selectedRole === "tutor"}
                    onChange={() => setSelectedRole("tutor")}
                    className="radio radio-primary"
                  />
                  <span className="flex items-center gap-1 font-medium">
                    <FaChalkboardTeacher /> Tutor
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${
                  isLoading ? "loading" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="divider">OR</div>

          {/* Social Login */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => console.log("Google Login")}
              className="btn btn-outline gap-2 hover:shadow-sm transition-all"
              disabled={isLoading}
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-4 h-4"
              />
              Continue with Google
            </button>
          </div>

          {/* Already have an account */}
          <div className="text-center mt-4">
            <span className="text-sm">Already have an account? </span>
            <Link to="/login" className="link link-primary text-sm">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
