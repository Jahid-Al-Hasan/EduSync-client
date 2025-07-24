import {
  User,
  Mail,
  BookOpen,
  Calendar,
  Clock,
  Edit,
  Save,
  Lock,
  Globe,
  X,
  Check,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto lg:px-4 py-8 max-w-4xl">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          {/* Header with edit button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <User className="w-8 h-8" />
              My Profile
            </h1>
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Avatar and Stats */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="avatar mb-4">
                <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={
                      user?.photoURL ||
                      "https://i.ibb.co/Y7J7ZRCq/icons8-user-100-2.png"
                    }
                    alt="Profile"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Profile Details */}
            <div className="md:col-span-2">
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    {user?.displayName || "Anonymous User"}
                  </h2>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" /> {user?.email}
                  </p>
                </div>

                <div className="divider"></div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">
                        {user?.phoneNumber || "--------"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-secondary/10">
                      <Lock className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Type</p>
                      <p className="font-medium capitalize">
                        {user?.role || "student"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-secondary/10">
                      <Lock className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created At</p>
                      <p className="font-medium capitalize">
                        {new Date(
                          Number(user?.metadata?.createdAt)
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-secondary/10">
                      <Lock className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last login</p>
                      <p className="font-medium capitalize">
                        {new Date(
                          Number(user?.metadata?.lastLoginAt)
                        ).toLocaleString("")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Section (always visible) */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5" /> Account Security
            </h3>
            <button className="btn btn-outline btn-sm">Change Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
