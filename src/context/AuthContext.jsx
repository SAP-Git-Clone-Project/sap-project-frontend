import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/components/api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUserState] = useState(null);
  const [ready, setReady] = useState(false);

  /**
   * Syncs user state to localStorage.
   * Defined as a helper to keep the logic DRY.
   */
  const syncUserToStorage = (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      if (userData.avatar) {
        localStorage.setItem("cached_avatar", userData.avatar);
      }
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("cached_avatar");
    }
  };

  /**
   * Public setter for the user object.
   * Handles both full replacements and functional updates.
   */
  const setUser = useCallback((userData) => {
    setUserState((prev) => {
      const nextUser = typeof userData === 'function' ? userData(prev) : userData;
      syncUserToStorage(nextUser);
      return nextUser;
    });
  }, []);

  // Initialize Auth on Mount
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("access");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          setIsAuthenticated(true);
          setUserState(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user", e);
          localStorage.clear();
        }
      }
      setReady(true);
    };

    initializeAuth();
  }, []);

  const login = (tokens, userData) => {
    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);
    
    // Set state and storage
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async (redirectPath = "/login") => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    try {
      if (access && refresh) {
        // We don't necessarily need to await this to clear local state
        api.post("/users/logout/", { refresh }, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access}`,
          },
        }).catch(err => console.error("Logout API error:", err.response?.data || err.message));
      }
    } finally {
      // Always clear local state even if the API call fails
      localStorage.clear();
      setIsAuthenticated(false);
      setUserState(null);
      
      // Force a hard redirect to clear any leftover memory state
      window.location.href = redirectPath;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        setUser, 
        login, 
        logout, 
        ready,
        isLoading: !ready 
      }}
    >
      {/* Prevent flickering: Only render children when we know 
         if the user is logged in or not.
      */}
      {ready ? children : <div className="min-h-screen bg-base-100" />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};