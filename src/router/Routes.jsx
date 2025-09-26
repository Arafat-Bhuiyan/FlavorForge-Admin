import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../layouts/Layout";
import DashboardMainPage from "../Admin/Dashboard/DashboardMainPage";
import AdminLogin from "../Admin/Auth/AdminLogin";
import ProtectedRoute from "../Admin/Auth/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <h2>Route not found</h2>,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <DashboardMainPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <AdminLogin />,
      },
    ],
  },
]);

export default router;
