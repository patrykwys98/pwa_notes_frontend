import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/login.page";
import RegisterPage from "./pages/register.page";
import HomePage from "./pages/home.page";
import PrivateRoute from "./utils/PrivateRoute";
import AuthContext, { AuthProvider } from "./context/AuthContext";
import { NotesProvider } from "./context/NotesContext";
import { Container } from "@material-ui/core";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import Navbar from "./components/Navbar";

function App() {
  const { message } = useContext(AuthContext);

  useEffect(() => {
    console.log("message", message);
    if (message) {
      console.log(message);
      toast.error(message, { position: toast.POSITION.TOP_RIGHT });
    }
  }, [message]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotesProvider>
        <Container>
          <Router>
            <AuthProvider>
                <Navbar />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <HomePage />
                      </PrivateRoute>
                    }
                  />
                  <Route element={<LoginPage />} path="/login" />
                  <Route element={<RegisterPage />} path="/register" />
                </Routes>
            </AuthProvider>
          </Router>
        </Container>
      </NotesProvider>
      <ToastContainer position="top-right" />
    </ThemeProvider>
  );
}

export default App;
