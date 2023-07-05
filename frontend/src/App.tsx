import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login.page";
import RegisterPage from "./pages/register.page";
import HomePage from "./pages/home.page";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { NotesProvider } from "./context/NotesContext";
import { NetworkStatusProvider } from "./context/NetworkStatusContext";
import { Container } from "@material-ui/core";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import Navbar from "./components/Navbar";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotesProvider>
        <Container>
          <Router>
            <AuthProvider>
              <NetworkStatusProvider>
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
              </NetworkStatusProvider>
            </AuthProvider>
          </Router>
        </Container>
      </NotesProvider>
    </ThemeProvider>
  );
}

export default App;
