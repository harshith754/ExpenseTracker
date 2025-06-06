import { useState, useEffect } from "react";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterPage from "./pages/Register";
import "./App.css";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const handleLogin = (token) => {
    setToken(token);
  };

  const handleLogout = () => {
    setToken(null);
  };

  if (!token) {
    if (showRegister) {
      return (
        <RegisterPage
          onRegister={() => setShowRegister(false)}
          onGoToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <LoginPage
        onLogin={handleLogin}
        onGoToRegister={() => setShowRegister(true)}
      />
    );
  }

  return <Dashboard token={token} onLogout={handleLogout} />;
}

export default App;
