import React, { createContext, useReducer, useEffect } from "react";
import api from "../services/api";
import setAuthToken from "../utils/setAuthToken";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "USER_LOADED":
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case "AUTH_ERROR":
    case "LOGIN_FAIL":
    case "LOGOUT":
    case "REGISTER_FAIL":
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      try {
        const res = await api.get("/auth");
        dispatch({ type: "USER_LOADED", payload: res.data });
      } catch (err) {
        dispatch({ type: "AUTH_ERROR" });
      }
    } else {
      dispatch({ type: "AUTH_ERROR" });
    }
  };

  const login = async (formData) => {
    try {
      const res = await api.post("/auth/login", formData);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      await loadUser();
    } catch (err) {
      dispatch({ type: "LOGIN_FAIL", payload: err.response.data.msg });
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post("/auth/register", formData);
      dispatch({ type: "REGISTER_SUCCESS", payload: res.data });
      await loadUser();
    } catch (err) {
      dispatch({ type: "REGISTER_FAIL", payload: err.response.data.msg });
    }
  };

  const logout = () => dispatch({ type: "LOGOUT" });

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
