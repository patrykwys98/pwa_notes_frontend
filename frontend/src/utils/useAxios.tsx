import axios, { AxiosInstance } from "axios";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const useAxios = (): AxiosInstance => {
  const { authToken, tokenType, setMessage } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api`,
    headers: { Authorization: `${tokenType} ${authToken}` },
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const { response } = error;

      if (response) {
        const { status } = response;
        if (status === 403) {
          setMessage("You are not authorized to access this resource.");
        } else if (status === 404) {
          setMessage("The requested resource was not found.");
        } else if (status === 500) {
          setMessage("An internal server error occurred.");
        } else {
          setMessage("An error occurred.");
        }
      } else {
        setMessage("An error occurred.");
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;
