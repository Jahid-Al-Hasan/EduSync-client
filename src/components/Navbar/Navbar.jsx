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

  // navlinks
  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `font-semibold cursor-pointer ${isActive && "bg-base-300"}`
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/tutors"
          className={({ isActive }) =>
            `font-semibold cursor-pointer ${isActive && "bg-base-300"}`
          }
        >
          Tutors
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/study-sessions"
          className={({ isActive }) =>
            `font-semibold cursor-pointer ${isActive && "bg-base-300"}`
          }
        >
          Study Sessions
        </NavLink>
      </li>
      {user?.role === "admin" && (
        <li>
          <NavLink
            to="/dashboard/manage-users"
            className={({ isActive }) =>
              `font-semibold cursor-pointer ${isActive && "bg-base-300"}`
            }
          >
            Dashboard
          </NavLink>
        </li>
      )}
      {user?.role === "tutor" && (
        <li>
          <NavLink
            to="/dashboard/my-sessions"
            className={({ isActive }) =>
              `font-semibold cursor-pointer ${isActive && "bg-base-300"}`
            }
          >
            Dashboard
          </NavLink>
        </li>
      )}
      {user?.role === "student" && (
        <li>
          <NavLink
            to="/dashboard/booked-sessions"
            className={({ isActive }) =>
              `font-semibold cursor-pointer ${isActive && "bg-base-300"}`
            }
          >
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <nav className="bg-base-100 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto navbar ">
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
          <label className="toggle text-primary border-2">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={handleTheme}
              className="theme-controller"
            />

            <svg
              aria-label="sun"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </g>
            </svg>

            <svg
              aria-label="moon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </g>
            </svg>
          </label>

          {/* Auth Buttons / Profile Dropdown */}
          {!user ? (
            <>
              <Link to="/login" className="btn btn-primary btn-sm border-0">
                Login
              </Link>
            </>
          ) : (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-8 rounded-full">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User photo"
                      className="w-full h-full object-cover"
                    />
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
    </nav>
  );
};

export default Navbar;
