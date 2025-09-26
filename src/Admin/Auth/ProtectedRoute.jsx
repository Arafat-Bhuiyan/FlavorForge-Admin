import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "./Provider";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(MyContext);

  // If loading, show a loading state or return null
  if (loading) {
    return <div>Loading...</div>; // Or use a spinner component
  }

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user exists, render the protected route content
  return children;
};

export default ProtectedRoute;
