// src/redux/slice/authSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { setCookie, getCookie, deleteCookie } from "@/utils/cookie";

// Load auth state from cookies (with localStorage fallback)
const loadAuthFromStorage = () => {
  if (typeof window !== "undefined") {
    const token = getCookie("accessToken") || localStorage.getItem("accessToken");
    const userStr = localStorage.getItem("user");

    if (token) {
      try {
        const user = userStr ? JSON.parse(userStr) : null;
        if (user?.role) {
          setCookie("userRole", user.role, 7);
          localStorage.setItem("userRole", user.role);
        }
        return {
          isLoggedIn: true,
          user: user,
          token: token,
        };
      } catch (e) {
        return {
          isLoggedIn: false,
          user: null,
          token: null,
        };
      }
    }
  }
  return {
    isLoggedIn: false,
    user: null,
    token: null,
  };
};

const initialState = loadAuthFromStorage();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      state.isLoggedIn = true;
      state.user = user;
      state.token = token;

      // Save token & userRole to cookies (7 days expiry for session persistence)
      if (token) {
        setCookie("accessToken", token, 7);
      }
      if (refreshToken) {
        setCookie("refreshToken", refreshToken, 30);
      }
      if (user?.role) {
        setCookie("userRole", user.role, 7);
      }

      // Also persist to localStorage for fast hydration
      if (typeof window !== "undefined") {
        if (token) localStorage.setItem("accessToken", token);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        if (user?.role) localStorage.setItem("userRole", user.role);
        if (user) localStorage.setItem("user", JSON.stringify(user));
      }
    },
    setLogout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;

      // Remove from cookies
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      deleteCookie("userRole");

      // Remove from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("user");
      }
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      if (action.payload?.role) {
        setCookie("userRole", action.payload.role, 7);
      }
      if (typeof window !== "undefined" && state.user) {
        if (action.payload?.role) {
          localStorage.setItem("userRole", action.payload.role);
        }
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});

export const { setLogin, setLogout, updateUser } = authSlice.actions;
export default authSlice.reducer;

