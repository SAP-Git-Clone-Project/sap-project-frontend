import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

/**
 * AuthProvider
 *
 * Stores access / refresh tokens in localStorage and keeps a `user` object
 * in memory so any component can call `useAuth()` and get:
 *
 *   isAuthenticated  – boolean
 *   user             – null | { name, avatar, email, username, ... }
 *   login(tokens, userData)  – persist tokens, set user
 *   logout()                 – clear everything
 *   setUser(userData)        – update user in place (e.g. after profile edit)
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  // Tracks whether we've finished reading localStorage so we don't flash
  // the logged-out state for a frame on hard refresh.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    const stored = localStorage.getItem("user");

    if (token) {
      setIsAuthenticated(true);
      if (stored) {
        try { setUser(JSON.parse(stored)); } catch { /* ignore corrupt data */ }
      }
    }
    setReady(true);
  }, []);

  /*
    Call after a successful login OR after registration if your API
    returns tokens immediately.
   */
  const login = (tokens, userData = null) => {
    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  /** Refresh the in-memory user object (e.g. after the user edits their profile). */
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser, ready }}>
      {/* Don't render children until we've rehydrated from localStorage.
          This prevents a flash where the navbar briefly shows "Login/Register"
          even though the user is already authenticated. */}
      {ready ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);