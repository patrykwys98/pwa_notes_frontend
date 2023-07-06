import React, { createContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type AuthContextType = {
  user: any;
  authToken: string | null;
  loginUser: (credentials: { email: string; password: string }) => void;
  logoutUser: () => void;
  setAuthToken: React.Dispatch<React.SetStateAction<string | null>>;
  tokenType: string | null;
  setTokenType: React.Dispatch<React.SetStateAction<string | null>>;
  baseURL: string;
  message?: string;
  setMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
  registerUser: (credentials: { email: string; password: string }) => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default AuthContext;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const baseURL = `${process.env.REACT_APP_API_URL}/api`;
  const navigate = useNavigate();

  const [authToken, setAuthToken] = useState<string | null>(
    () => localStorage.getItem("authToken") || null
  );
  const [tokenType, setTokenType] = useState<string | null>(
    () => localStorage.getItem("tokenType") || null
  );
  const [user, setUser] = useState<any>(() =>
    authToken ? jwt_decode(authToken) : null
  );
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>();

  const loginUser = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);
      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      const response = await axios.post(
        `${baseURL}/auth/token`,
        params,
        config
      );
      const { access_token, token_type } = response.data;
      localStorage.setItem("authToken", access_token);
      localStorage.setItem("tokenType", token_type);
      setUser(jwt_decode(access_token));
      setMessage("");
      navigate("/");
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 403) {
          setMessage("Invalid credentials");
        } else if (status === 500) {
          setMessage("An internal server error occurred");
          logoutUser();
        }
      } else {
        setMessage("An error occurred");
      }
    }
  };

  const registerUser = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      await axios.post(`${baseURL}/user/create-user`, { email, password });
      navigate("/login");
    } catch (error) {
      setMessage(error.response.data.detail || error.message);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenType");
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    if (authToken) {
      setUser(jwt_decode(authToken));
    }
    setLoading(false);
  }, [authToken]);

  const contextData: AuthContextType = {
    user,
    authToken,
    loginUser,
    logoutUser,
    setAuthToken,
    tokenType,
    setTokenType,
    baseURL,
    message,
    setMessage,
    registerUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
