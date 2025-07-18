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
import UploadMaterials from "../pages/TutorDashboard/UploadMaterials/UploadMaterials";
import ViewMaterials from "../pages/TutorDashboard/ViewMaterials/ViewMaterials";
import CreateNote from "../pages/StudentDashboard/CreateNote/CreateNote";
import ManageNotes from "../pages/StudentDashboard/ManageNotes/ManageNotes";
import StudyMaterials from "../pages/StudentDashboard/StudyMaterials/StudyMaterials";
import AdminRoute from "../routes/AdminRoute";
import ManageUsers from "../pages/AdminDashboard/ManageUsers/ManageUsers";
import AllSessions from "../pages/AdminDashboard/AllSessions/AllSessions";
import ManageMaterials from "../pages/AdminDashboard/ManageMaterials/ManageMaterials";

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
      // student routes
      {
        path: "booked-sessions",
        element: (
          <StudentRoute>
            <BookedSessionsPage />
          </StudentRoute>
        ),
      },
      {
        path: "create-note",
        element: (
          <StudentRoute>
            <CreateNote />
          </StudentRoute>
        ),
      },
      {
        path: "all-notes",
        element: (
          <StudentRoute>
            <ManageNotes />
          </StudentRoute>
        ),
      },
      {
        path: "study-materials",
        element: (
          <StudentRoute>
            <StudyMaterials />
          </StudentRoute>
        ),
      },
      // tutor routes
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
      {
        path: "upload-materials",
        element: (
          <TutorRoute>
            <UploadMaterials />
          </TutorRoute>
        ),
      },
      {
        path: "materials",
        element: (
          <TutorRoute>
            <ViewMaterials />
          </TutorRoute>
        ),
      },
      // admin route
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "sessions",
        element: (
          <AdminRoute>
            <AllSessions />
          </AdminRoute>
        ),
      },
      {
        path: "manage-materials",
        element: (
          <AdminRoute>
            <ManageMaterials />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;
