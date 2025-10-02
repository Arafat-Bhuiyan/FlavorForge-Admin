import { createContext, useEffect, useState } from "react";
import publicApiInstance from "../../utils/publicApiInstance";
import { toast } from "react-toastify";

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null);

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);

    try {
      const { data, status } = await publicApiInstance.post("/login/", {
        email,
        password,
      });

      if (status === 200) {
        localStorage.setItem("access_token", data?.access);
        localStorage.setItem("refresh_token", data?.refresh);
        localStorage.setItem("user", JSON.stringify(data?.user));
        localStorage.setItem("admin", data?.admin);
        setUser(data?.user);
        toast.success("Login successful!");
      } else {
        setError("Login failed. Please check your credentials.");
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.");
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ email, password, confirmPassword }) => {
    setLoading(true);
    setError(null);
    try {
      const { data, status } = await publicApiInstance.post("/sign-up/", {
        email,
        password,
        confirmPassword,
      });

      if (status === 201) {
        localStorage.setItem("access_token", data?.access);
        localStorage.setItem("refresh_token", data?.refresh);
        localStorage.setItem("user", JSON.stringify(data?.user));
        setUser(data?.user);
      }
    } catch (error) {
      setError("Signup failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    setLoading(false);
  }, []);

  return (
    <MyContext.Provider
      value={{
        user,
        loading,
        setUser,
        login,
        error,
        logout,
        signup,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
