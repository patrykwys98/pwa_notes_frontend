import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export const PrivateRoute = ({ children }) => {
  let { user } = useContext(AuthContext);
  console.log(user);
  if (user) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default PrivateRoute;