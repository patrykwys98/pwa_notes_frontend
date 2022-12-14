import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login.page";
import HomePage from "./pages/home.page";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { NotesProvider } from "./context/NotesContext";
import { Container } from "@material-ui/core";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={
                <PrivateRoute>
                  <NotesProvider>
                    <HomePage />
                  </NotesProvider>
                </PrivateRoute>
              } />
              <Route element={<LoginPage />} path="/login" />
            </Routes>
          </AuthProvider>
        </Router>
      </Container>
    </ThemeProvider>
  );
}

export default App;
