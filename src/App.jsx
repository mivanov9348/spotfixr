import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { supabase } from "./supabase/supabaseClient";
import Home from "./pages/Home";
import ReportIssue from "./pages/ReportIssue";
import Reports from "./pages/Reports";
import ReportDetails from "./components/Report/ReportDetails";
import NotFound from "./pages/NotFound";
import LoginRegisterForm from "./pages/LoginRegisterForm";
import "./styles/App.css";

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const location = useLocation();
  const background = location.state?.background;

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        if (profile) {
          setUsername(profile.username);
        }
      }
    };

    fetchUserData();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const loggedInUser = session?.user || null;
        setUser(loggedInUser);

        if (loggedInUser) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", loggedInUser.id)
            .single();

          if (profile) {
            setUsername(profile.username);
          }
        } else {
          setUsername("");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUsername("");
  };

  if (!user) {
    return (
      <div className="App">
        <header className="header">
          <h1>SpotFixr</h1>
        </header>
        <main>
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
            <span className="user-email">{username || user.email}</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>
      </header>

      <main>
        <Routes location={background || location}>
          <Route path="/" element={<Home />} />
          <Route path="/submit" element={<ReportIssue />} />
          <Route path="/my-reports" element={<Reports />} />
          <Route path="/my-reports/:id" element={<ReportDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {background && (
          <Routes>
            <Route path="/my-reports/:id" element={<ReportDetails />} />
          </Routes>
        )}
      </main>

      <footer>
        <p>2025 SpotFixr</p>
      </footer>
    </div>
  );
}

export default App;
