import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import Signup from "../pages/Signup/Signup";
import Login from "../pages/Login/Login";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import PrivateRoute from "../routes/PrivateRoutes";
import StudySessionsPage from "../pages/StudySessionsPage/StudySessionsPage";
import SessionDetailsPage from "../pages/SessionDetailsPage/SessionDetailsPage";
import ErrorPage from "../pages/Error/ErrorPage";
import ForbiddenPage from "../components/Forbidden/Forbidden";
import StudentRoute from "../routes/StudentRoute";
import BookedSessionsPage from "../pages/StudentDashboard/BookedSessionsPage/BookedSessionsPage";
import TutorRoute from "../routes/TutorRoute";
import CreateSession from "../pages/TutorDashboard/CreateSession/CreateSession";
import MySessions from "../pages/TutorDashboard/MySessions/MySessions";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "study-sessions/", Component: StudySessionsPage },
      { path: "sessions/:id", Component: SessionDetailsPage },
      { path: "/forbidden", Component: ForbiddenPage },
    ],
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "signup", Component: Signup },
      { path: "login", Component: Login },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "booked-sessions",
        element: (
          <StudentRoute>
            <BookedSessionsPage />
          </StudentRoute>
        ),
      },
      {
        path: "create-session",
        element: (
          <TutorRoute>
            <CreateSession />
          </TutorRoute>
        ),
      },
      {
        path: "my-sessions",
        element: (
          <TutorRoute>
            <MySessions />
          </TutorRoute>
        ),
      },
    ],
  },
]);

export default router;
