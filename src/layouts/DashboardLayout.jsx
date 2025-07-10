import React from "react";
import { Outlet, Link, useNavigate, NavLink } from "react-router";
import {
  Menu,
  Home,
  User,
  Calendar,
  Users,
  BookOpen,
  LogOut,
  Sun,
  Moon,
  Settings,
  CalendarCheck,
  FileEdit,
  Notebook,
  CalendarPlus,
  CalendarDays,
  Upload,
  Library,
  UserCog,
  CalendarSearch,
  LibraryBig,
  FileSearch,
  Megaphone,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Swal from "sweetalert2";
import { useTheme } from "../hooks/useTheme";
import Logo from "../components/Logo/Logo";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const role = user?.role;
  const navigate = useNavigate();

  // theme
  const handleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // handle logout
  const handleLogout = () => {
    logOut()
      .then(() => {
        Swal.fire({
          title: "Logout successfully",
          icon: "success",
          draggable: true,
        });
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const links = (
    <>
      <li>
        <NavLink to="/" className="flex items-center gap-3">
          <Home className="w-5 h-5" />
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/profile" className="flex items-center gap-3">
          <User className="w-5 h-5" />
          My Profile
        </NavLink>
      </li>

      {/* Student-specific routes */}
      {role === "student" && (
        <>
          <li className="menu-title">
            <span>Student Dashboard</span>
          </li>
          <li>
            <NavLink
              to="/dashboard/booked-sessions"
              className="flex items-center gap-3"
            >
              <CalendarCheck className="w-5 h-5" />
              Booked Sessions
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/create-note"
              className="flex items-center gap-3"
            >
              <FileEdit className="w-5 h-5" />
              Create Note
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/notes" className="flex items-center gap-3">
              <Notebook className="w-5 h-5" />
              My Notes
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/study-materials"
              className="flex items-center gap-3"
            >
              <BookOpen className="w-5 h-5" />
              Study Materials
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/classmates"
              className="flex items-center gap-3"
            >
              <Users className="w-5 h-5" />
              Classmates
            </NavLink>
          </li>
        </>
      )}

      {/* Tutor specific routes */}
      {role === "tutor" && (
        <>
          <li className="menu-title">
            <span>Teaching Dashboard</span>
          </li>
          <li>
            <NavLink
              to="/dashboard/create-session"
              className="flex items-center gap-3"
            >
              <CalendarPlus className="w-5 h-5" />
              Create Study Session
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/my-sessions"
              className="flex items-center gap-3"
            >
              <CalendarDays className="w-5 h-5" />
              My Study Sessions
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/upload-materials"
              className="flex items-center gap-3"
            >
              <Upload className="w-5 h-5" />
              Upload Materials
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/materials"
              className="flex items-center gap-3"
            >
              <Library className="w-5 h-5" />
              All Materials
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/students"
              className="flex items-center gap-3"
            >
              <Users className="w-5 h-5" />
              My Students
            </NavLink>
          </li>
        </>
      )}

      {/* Admin-only routes */}
      {role === "admin" && (
        <>
          <li className="menu-title">
            <span>Admin Dashboard</span>
          </li>

          {/* User Management */}
          <li>
            <NavLink to="/admin/users" className="flex items-center gap-3">
              <UserCog className="w-5 h-5" />
              Manage Users
              <span className="badge badge-sm badge-info ml-auto">New</span>
            </NavLink>
          </li>

          {/* Session Management */}
          <li>
            <NavLink to="/admin/sessions" className="flex items-center gap-3">
              <CalendarSearch className="w-5 h-5" />
              All Study Sessions
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/session-approvals"
              className="flex items-center gap-3"
            >
              <CalendarCheck className="w-5 h-5" />
              Session Approvals
              <span className="badge badge-sm badge-warning ml-auto">5</span>
            </NavLink>
          </li>

          {/* Content Management */}
          <li>
            <NavLink to="/admin/materials" className="flex items-center gap-3">
              <LibraryBig className="w-5 h-5" />
              All Materials
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/content-review"
              className="flex items-center gap-3"
            >
              <FileSearch className="w-5 h-5" />
              Content Review
            </NavLink>
          </li>

          {/* System Management */}
          <li>
            <NavLink
              to="/admin/announcements"
              className="flex items-center gap-3"
            >
              <Megaphone className="w-5 h-5" />
              Create Announcements
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/settings" className="flex items-center gap-3">
              <Settings className="w-5 h-5" />
              System Settings
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-100">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* MAIN CONTENT AREA */}
      <div className="drawer-content flex flex-col">
        {/* Mobile Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-base-100 border-b border-base-300 shadow-sm lg:hidden">
          <label
            htmlFor="dashboard-drawer"
            className="btn btn-ghost btn-circle"
          >
            <Menu className="w-5 h-5" />
          </label>
          <div className="w-full flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">
              <span>
                <Logo />
              </span>
            </Link>
            <button onClick={handleTheme} className="btn btn-sm btn-circle">
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="w-5"></div> {/* Spacer for alignment */}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* SIDEBAR */}
      <aside className="drawer-side z-30">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <div className="menu p-4 w-72 min-h-full bg-base-100 border-r border-base-300">
          {/* Brand Header */}
          <div className="mb-6 px-2 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-2xl font-bold">
                <span>
                  <Logo />
                </span>
              </Link>
              <button onClick={handleTheme} className="btn btn-sm btn-circle">
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-sm opacity-70 mt-1">
              Collaborative Study Platform
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-1">{links}</ul>
          </nav>

          {/* Bottom Section */}
          <div className="mt-auto pt-4 border-t border-base-300">
            <div className="flex items-center gap-3 px-2 py-3">
              <div className="avatar">
                <div className="w-10 rounded-full bg-base-300">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="User" />
                  ) : (
                    <User className="w-5 h-5 m-auto" />
                  )}
                </div>
              </div>
              <div>
                <p className="font-medium">{user?.displayName || "User"}</p>
                <p className="text-xs opacity-70 capitalize">{role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-sm w-full justify-start mt-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default DashboardLayout;
