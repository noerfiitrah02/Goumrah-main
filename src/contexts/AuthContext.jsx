// contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: () =>
    Promise.resolve({ success: false, message: "Provider not available" }),
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const response = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.data);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem("authToken");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("authToken", response.data.token);
      setUser(response.data.data);
      console.log(response.data.data);

      setIsAuthenticated(true);
      return { success: true, data: response.data };
    } catch (error) {
      // Jangan cleanup token di sini karena user belum login
      console.error("Login error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Login gagal. Silakan coba lagi.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
