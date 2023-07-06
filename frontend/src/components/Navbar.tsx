import React, { useContext } from "react";
import { AppBar, Toolbar, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const { authToken, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const goToRegister = () => {
    navigate("/register");
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit">
            <MenuIcon />
          </IconButton>
          <div style={{ flexGrow: 1 }}></div>
          <>
            {authToken ? (
              <Button color="inherit" onClick={logoutUser}>
                Logout
              </Button>
            ) : (
              <>
                <Button color="inherit" onClick={goToRegister}>
                  Register
                </Button>
                <Button color="inherit" onClick={goToLogin}>
                  Login
                </Button>
              </>
            )}
          </>
        </Toolbar>
      </AppBar>
      <div style={{ height: "20px" }}></div> {/* Add desired spacing */}
    </>
  );
};

export default Navbar;
