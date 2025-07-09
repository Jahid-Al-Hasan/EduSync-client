import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import Signup from "../pages/Signup/Signup";
import Login from "../pages/Login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "signup", Component: Signup },
      { path: "login", Component: Login },
    ],
  },
]);

export default router;
