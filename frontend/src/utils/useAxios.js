import axios from "axios";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import atob from "atob";
import NetworkStatusContext from "../context/NetworkStatusContext";

const baseURL = `${process.env.REACT_APP_API_URL}/api`;

export const useAxios = () => {
  const { authToken, tokenType } = useContext(AuthContext);
  const { setIsOnline } = useContext(NetworkStatusContext);

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `${tokenType} ${authToken}` },
  });

  // axiosInstance.interceptors.response.use(
  //   (response) => {
  //     setIsOnline(true);
  //     return response;
  //   },
  //   (error) => {
  //     setIsOnline(false);
  //     return Promise.reject(error);
  //   }
  // );

  return axiosInstance;

};

export default useAxios;