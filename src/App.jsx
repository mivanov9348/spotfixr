import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { supabase } from "./components/supabaseClient";
import { useState, useEffect } from "react";

import Home from "./components/Home";
import ReportIssue from "./components/ReportIssue";
import MyReports from "./components/MyReports";
import NotFound from "./components/NotFound";
import LoginRegisterForm from "./components/LoginRegisterForm";
import "./App.css";

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
    await supabase.auth.signOut()
    setUser(null)
  }

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
      <li><Link to="/">Home</Link></li>
      <li><Link to="/submit">Report Issue</Link></li>
      <li><Link to="/my-reports">My Reports</Link></li>
    </ul>
    <div className="user-section">
      <span className="user-email">{user.email}</span>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  </nav>
</header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/submit" element={<ReportIssue />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer>
          <p>2025 SpotFixr</p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App