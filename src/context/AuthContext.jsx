import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import api from "@/components/api/api";
import Loader from "@/components/widgets/Loader";
import { mapApiUserToAuthUser } from "@/utils/mapApiUserToAuthUser";

const AuthContext = createContext();

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUserState] = useState(null);
  const [ready, setReady] = useState(false);

  // --- HELPER: CLEAR ALL STORAGE ---
  const clearLocalAuth = useCallback(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    localStorage.removeItem("cached_avatar");
    setIsAuthenticated(false);
    setUserState(null);
  }, []);

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

  const setUser = useCallback((userData) => {
    setUserState((prev) => {
      const nextUser = typeof userData === "function" ? userData(prev) : userData;
      syncUserToStorage(nextUser);
      return nextUser;
    });
  }, []);

  /** Re-fetch `/users/me/` and update context + localStorage (roles, is_staff, etc.). */
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("access");
    if (!token || isTokenExpired(token)) return;
    try {
      const { data } = await api.get("/users/me/");
      const next = mapApiUserToAuthUser(data);
      if (next) setUser(next);
    } catch {
      // Ignore: offline or session invalid; other flows handle logout.
    }
  }, [setUser]);

  // --- REFRESH LOGIC ---
  const refreshAccessToken = async () => {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return null;

    try {
      // Note: We use a raw axios call or a flag to avoid interceptor loops here if needed
      const res = await api.post("/token/refresh/", { refresh }, { _retry: true });
      localStorage.setItem("access", res.data.access);
      if (res.data.refresh) {
        localStorage.setItem("refresh", res.data.refresh);
      }
      return res.data.access;
    } catch (err) {
      return null;
    }
  };

  // --- INTERCEPTORS ---
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(async (config) => {
      // If the request has our custom _retry flag, skip refresh logic
      if (config._retry) return config;

      let token = localStorage.getItem("access");
      if (token && isTokenExpired(token)) {
        token = await refreshAccessToken();
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (res) => res,
      async (err) => {
        const originalRequest = err.config;

        if (err.response?.status === 401 && !originalRequest?._retry) {
          originalRequest._retry = true;
          const newToken = await refreshAccessToken();

          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } else {
            // Stop the loop here!
            console.error("Auth Refresh Failed");
            // clearLocalAuth();
            setIsAuthenticated(false);
            setUserState(null);
            return Promise.reject(err); // This tells the app Stop trying to refresh and fail the request
          }
        }
        return Promise.reject(err);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [clearLocalAuth]);

  // --- INITIALIZATION (FIXED INFINITE LOADING) ---
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("access");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          if (isTokenExpired(token)) {
            const newToken = await refreshAccessToken();
            if (!newToken) {
              clearLocalAuth();
              return;
            }
          }
          setIsAuthenticated(true);
          setUserState(JSON.parse(storedUser));
        } catch (e) {
          console.error("Initialization error:", e);
          clearLocalAuth();
        }
      }
      // CRITICAL: Always set ready to true, even if logic fails
      setReady(true);
    };

    init();
  }, [clearLocalAuth]);

  // After restore from localStorage, sync permissions from server (staff, roles).
  useEffect(() => {
    if (!ready || !isAuthenticated) return;
    refreshUser();
  }, [ready, isAuthenticated, refreshUser]);

  // When user returns to the tab, refresh in case an admin changed their account elsewhere.
  const visibilityRefreshTimer = useRef(null);
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState !== "visible") return;
      if (visibilityRefreshTimer.current) clearTimeout(visibilityRefreshTimer.current);
      visibilityRefreshTimer.current = setTimeout(() => {
        visibilityRefreshTimer.current = null;
        if (localStorage.getItem("access")) refreshUser();
      }, 400);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (visibilityRefreshTimer.current) clearTimeout(visibilityRefreshTimer.current);
    };
  }, [refreshUser]);

  const login = (tokens, userData) => {
    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);
    setIsAuthenticated(true);
    setUser(userData);
  };

  // --- LOGOUT (FIXED FREEZING) ---
  const logout = async (redirectPath = "/login") => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    try {
      if (access && refresh) {
        // We add _retry: true so the interceptor doesn't try 
        // to refresh a token while we are trying to kill the session.
        await api.post(
          "/users/logout/",
          { refresh },
          {
            headers: { Authorization: `Bearer ${access}` },
            _retry: true,
          }
        );
      }
    } catch (err) {
      console.warn("Logout request failed, cleaning local state anyway.");
    } finally {
      clearLocalAuth();
      // Hard redirect to clear any lingering React memory/states
      window.location.href = redirectPath;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        refreshUser,
        login,
        logout,
        ready,
        isLoading: !ready,
      }}
    >
      {ready ? (
        children
      ) : (
        <Loader message="Loading content..." />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);