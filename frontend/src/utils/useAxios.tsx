import axios, { AxiosInstance } from "axios";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import NetworkStatusContext from "../context/NetworkStatusContext";

const useAxios = (): AxiosInstance => {
  const { authToken, tokenType } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api`,
    headers: { Authorization: `${tokenType} ${authToken}` },
  });

  return axiosInstance;
};

export default useAxios;
