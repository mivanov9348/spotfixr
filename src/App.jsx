import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { supabase } from "./supabase/supabaseClient";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import ReportIssue from "./pages/ReportIssue";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import LoginRegisterForm from "./pages/LoginRegisterForm";
import "./styles/App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (!user) {
    return (
      <div className="App">
        <header className="header">
          <h1>SpotFixr</h1>
        </header>
        <main>
          {/* Затъмнен фон + pop-up */}
          <div className="modal-overlay">
            <div className="modal-content">
              <LoginRegisterForm onLogin={() => window.location.reload()} />
            </div>
          </div>
        </main>
        <footer>
          <p>2025 SpotFixr</p>
        </footer>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="App">
        <header className="header">
          <h1>SpotFixr</h1>
          <nav className="navbar">
            <ul className="nav-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/submit">Report Issue</Link>
              </li>
              <li>
                <Link to="/my-reports">Reports</Link>
              </li>
            </ul>
            <div className="user-section">
              <span className="user-email">{user.password}</span>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/submit" element={<ReportIssue />} />
            <Route path="/my-reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer>
          <p>2025 SpotFixr</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
