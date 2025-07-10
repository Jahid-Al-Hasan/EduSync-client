import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Swal from "sweetalert2";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import useAxios from "../../hooks/useAxios";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { user, loading, signIn, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  if (loading) {
    return <LoadingPage />;
  }

  if (user) {
    navigate(location?.state || "/");
  }

  //   handle signin with google
  const handleSignInWithGoogle = () => {
    signInWithGoogle()
      .then(async (res) => {
        try {
          const token = res?.user?.accessToken;

          const { data } = await axiosInstance.get("/api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (data?.exists) {
            Swal.fire("Login successfully");
            navigate(location?.state || "/");
          } else {
            const userData = {
              email: res.user?.email,
              role: "student",
            };

            const userRes = await axiosInstance.post(
              "/api/registerUser",
              userData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!userRes.data.insertedId) {
              Swal.fire("Server registration failed!");
            } else {
              Swal.fire({
                title: "Register successfully",
                icon: "success",
              });
              navigate(location?.state || "/");
            }
          }
        } catch (error) {
          console.log(error);
          Swal.fire("Register failed");
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "Login failed",
          icon: "error",
        });
        console.log(err);
      });
  };

  //   signin with email and password
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      signIn(data.email, data.password)
        .then(() => {
          Swal.fire({
            title: "Login successfully",
            icon: "success",
          });
          navigate(location?.state || "/");
        })
        .catch((err) => {
          Swal.fire({
            title: "Login failed",
            icon: "error",
          });
          console.log(err);
        });
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-2 lg:px-4 py-10 bg-base-200 text-base-content">
      <div className="card w-full max-w-xl bg-base-100 shadow-lg border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold mb-6 text-center">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="form-control lg:flex lg:flex-row lg:items-center lg:gap-x-4">
              <label className="label w-full lg:w-1/3">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^@]+@[^@]+\.[^@]+$/,
                    message: "Invalid email format",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-error text-sm ml-auto">
                {errors.email.message}
              </p>
            )}

            {/* Password */}
            <div className="form-control lg:flex lg:flex-row lg:items-center lg:gap-x-4">
              <label className="label w-full lg:w-1/3">
                <span className="label-text">Password</span>
              </label>

              <div className="relative w-full flex-1">
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
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

            {/* Submit */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${
                  isLoading ? "loading" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="divider">OR</div>

          {/* Social Login */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleSignInWithGoogle()}
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

          {/* Signup link */}
          <div className="text-center mt-4">
            <span className="text-sm">Don’t have an account? </span>
            <Link to="/signup" className="link link-primary text-sm">
              Signup here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
