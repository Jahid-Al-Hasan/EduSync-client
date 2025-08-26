import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Calendar,
  Briefcase,
  Edit,
  Save,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";

const ProfilePage = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    photoURL: "",
    phoneNumber: "",
    address: "",
    bio: "",
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/api/user");

        if (response.data.exists) {
          setUserData({
            name: user.displayName || "",
            photoURL: user.photoURL || "",
            phoneNumber: response.data.phoneNumber || "",
            address: response.data.address || "",
            bio: response.data.bio || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to load user data. Please refresh the page.",
        });
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user, axiosInstance]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      await axiosInstance.patch(`/api/user/update/${user.email}`, {
        name: userData.name,
        photoURL: userData.photoURL,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        bio: userData.bio,
      });

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      setIsEditing(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUserData({
      name: user.displayName || "",
      photoURL: user.photoURL || "",
      phoneNumber: userData.phoneNumber || "",
      address: userData.address || "",
      bio: userData.bio || "",
    });
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="card bg-base-200 shadow-2xl rounded-2xl overflow-hidden">
        <div className="card-body p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
              <User className="w-9 h-9 text-primary" />
              My Profile
            </h1>

            {!isEditing ? (
              <button
                className="btn btn-outline btn-primary mt-4 md:mt-0"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3 mt-4 md:mt-0">
                <button
                  className="btn btn-outline btn-error"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="avatar mb-6">
                <div className="w-40 h-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                  <img
                    src={
                      userData.photoURL ||
                      "https://i.ibb.co/Y7J7ZRCq/icons8-user-100-2.png"
                    }
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="form-control w-full max-w-xs">
                  <label className="label font-semibold">
                    Profile Photo URL
                  </label>
                  <input
                    type="text"
                    placeholder="Enter image URL"
                    className="input input-bordered w-full"
                    name="photoURL"
                    value={userData.photoURL}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Name + Email */}
              <div>
                {isEditing ? (
                  <div className="form-control">
                    <label className="label font-semibold">Full Name</label>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="input input-bordered"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <h2 className="text-2xl font-semibold">
                    {userData.name || "Anonymous User"}
                  </h2>
                )}
                <p className="flex items-center gap-2 opacity-80 mt-2">
                  <Mail className="w-4 h-4" /> {user?.email}
                </p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="text-sm opacity-80">Phone Number</p>
                    {isEditing ? (
                      <input
                        type="text"
                        placeholder="Phone Number"
                        className="input input-bordered input-sm w-full"
                        name="phoneNumber"
                        value={userData.phoneNumber}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="font-medium">
                        {userData.phoneNumber || "--------"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-secondary mt-1" />
                  <div>
                    <p className="text-sm opacity-80">Address</p>
                    {isEditing ? (
                      <input
                        type="text"
                        placeholder="Your Address"
                        className="input input-bordered input-sm w-full"
                        name="address"
                        value={userData.address}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="font-medium">
                        {userData.address || "--------"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-start gap-3">
                  <Lock className="w-6 h-6 text-accent mt-1" />
                  <div>
                    <p className="text-sm opacity-80">Account Type</p>
                    <p className="font-medium capitalize">
                      {user?.role || "student"}
                    </p>
                  </div>
                </div>

                {/* Created At */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-6 h-6 text-warning mt-1" />
                  <div>
                    <p className="text-sm opacity-80">Created At</p>
                    <p className="font-medium">
                      {user?.metadata?.createdAt
                        ? new Date(
                            Number(user.metadata.createdAt)
                          ).toLocaleString()
                        : "--------"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <span className="font-semibold">About Me</span>
                </div>
                {isEditing ? (
                  <textarea
                    placeholder="Tell us about yourself..."
                    className="textarea textarea-bordered w-full h-32"
                    name="bio"
                    value={userData.bio}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="opacity-80 leading-relaxed">
                    {userData.bio || "No bio provided yet."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
