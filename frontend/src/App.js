

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login.page";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";


function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<LoginPage />} path="/" />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
