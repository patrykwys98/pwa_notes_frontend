simport axios from "axios";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const baseURL = `${process.env.REACT_APP_API_URL}/api`;

export const useAxios = () => {
  const { authToken, tokenType } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `${tokenType} ${authToken}` },
  });

  return axiosInstance;
}

export default useAxios;