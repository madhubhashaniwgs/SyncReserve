import { useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const data = response.data;

    localStorage.setItem("token", data.token);

    const loggedInUser = {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem("user", JSON.stringify(loggedInUser));

    setUser(loggedInUser);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profileImage");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
