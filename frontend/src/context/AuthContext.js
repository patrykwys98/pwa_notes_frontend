import { createContext, useEffect, useState } from "react";
import jwt_decode from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import axios from "axios";


const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let baseURL = `${process.env.REACT_APP_API_URL}/api`;
  let [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("authToken") ? localStorage.getItem("authToken") : null
  );
  let [tokenType, setTokenType] = useState(() =>
    localStorage.getItem("tokenType") ? localStorage.getItem("tokenType") : null
  );
  let [user, setUser] = useState(() =>
    localStorage.getItem("authToken") ? jwt_decode(localStorage.getItem("authToken")) : null
  );

  let [loading, setLoading] = useState(true);
  let [message, setMessage] = useState();
  let navigate = useNavigate();

  let loginUser = async ({ email, password }) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    let response = await axios.post(`${baseURL}/auth/token/`, params, config);
    console.log(response);
    let data = await response.data;
    if (response.status === 200) {
      console.log(data.access_token);
      localStorage.setItem("authToken", data.access_token);
      localStorage.setItem("tokenType", data.token_type);
      setUser(jwt_decode(data.access_token));
      setMessage("");
      navigate("/");
    } else if (response.status === 401) {
      setMessage("Invalid username or password");
    }
  }

  let logoutUser = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenType");
    setUser(null);
    navigate("/");
  }

  let contextData = {
    user: user,
    authToken: authToken,
    loginUser: loginUser,
    logoutUser: logoutUser,
    setAuthToken: setAuthToken,
    tokenType: tokenType,
    setTokenType: setTokenType,
    setUser: setUser,
    baseURL: baseURL,
    message: message,
    setMessage: setMessage,
  }


  useEffect(() => {
    if (authToken) {
      setUser(jwt_decode(authToken));
    }
    setLoading(false);
  }, [authToken, loading])

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}

