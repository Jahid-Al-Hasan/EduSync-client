import { Link, NavLink, useNavigate } from "react-router"; // Fixed incorrect import
import { FaUserCircle } from "react-icons/fa";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import Logo from "../Logo/Logo";
import { useAuth } from "../../hooks/useAuth";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  //   console.log(user);

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

  const navLinks = (
    <>
      <li>
        <NavLink to="/" className="font-semibold">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/tutors" className="font-semibold">
          Tutors
        </NavLink>
      </li>
      <li>
        <NavLink to="/study-sessions" className="font-semibold">
          Study Sessions
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink to="/dashboard" className="font-semibold">
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50 px-4">
      {/* Logo */}
      <div className="navbar-start">
        {/* Drawer Toggle for Small Screens */}
        <div className=" lg:hidden">
          <label htmlFor="nav-drawer" className="btn btn-ghost btn-circle">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
        </div>
        <Link to="/">
          <Logo />
        </Link>
      </div>

      {/* Center Nav Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">{navLinks}</ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end flex items-center gap-3">
        {/* Theme Toggle */}
        <button onClick={handleTheme} className="btn btn-sm btn-circle">
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Auth Buttons / Profile Dropdown */}
        {!user ? (
          <>
            <Link to="/login" className="btn btn-outline btn-sm">
              Login
            </Link>
          </>
        ) : (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-8 rounded-full">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" />
                ) : (
                  <FaUserCircle className="w-full h-full text-secondary" />
                )}
              </div>
            </div>
            <button
              tabIndex={0}
              onClick={() => handleLogout()}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 text-accent shadow"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Drawer Content */}
      <input id="nav-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side z-[999]">
        <label htmlFor="nav-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 bg-base-100 text-base-content">
          {navLinks}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
