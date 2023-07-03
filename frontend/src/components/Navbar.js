import React, { useContext } from "react";
import { AppBar } from '@material-ui/core'
import { Toolbar } from '@material-ui/core'
import MenuIcon from "@mui/icons-material/Menu";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NetworkStatusContext from "../context/NetworkStatusContext";

const Navbar = () => {
  let { authToken, logoutUser } = useContext(AuthContext);
  const { isOnline } = useContext(NetworkStatusContext);

  let navigate = useNavigate();

  const goToRegister = () => {
    navigate("/register");
  }

  const goToLogin = () => {
    navigate("/login");
  }

  return (
    <AppBar position="static">
      {isOnline ? <Toolbar>
        <MenuIcon />
        {authToken ? (
          <button onClick={logoutUser}>Logout</button>
        ) : (
          <>
            <button onClick={goToRegister}>Register</button>
            <button onClick={goToLogin}>Login</button>
          </>
        )}
      </Toolbar> : <h1>Offline mode</h1>}
    </AppBar>
  )
}

export default Navbar