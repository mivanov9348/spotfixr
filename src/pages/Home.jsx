import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const [latestReports, setLatestReports] = useState([]);
  const [mostCommented, setMostCommented] = useState([]);
  const [fixedReports, setFixedReports] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem("reports")) || [];

    // Latest by date
    const sortedByDate = [...storedReports].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    setLatestReports(sortedByDate.slice(0, 5));

    // Most commented
    const sortedByComments = [...storedReports]
      .filter((r) => r.comments && Array.isArray(r.comments))
      .sort((a, b) => b.comments.length - a.comments.length);
    setMostCommented(sortedByComments.slice(0, 5));

    // Fixed
    const fixed = storedReports.filter(
      (r) => r.status && r.status.toLowerCase() === "fixed"
    );
    setFixedReports(fixed.slice(0, 5));
  }, []);

  return (
    <div className="home-container">
      <section className="hero">
        <h1 className="hero-title">Welcome to SpotFixr</h1>
        <p className="hero-subtitle">
          Help improve your city by reporting broken infrastructure.
        </p>
        <Link to="/submit" className="link-button">Report New Issue</Link>
      </section>

      <section className="section">
        <h2>🕓 Latest Reports</h2>
        <ul>
          {latestReports.length === 0 ? (
            <li>No reports</li>
          ) : (
            latestReports.map((report) => (
              <li key={report.id}>
                <button
                  className="link-button"
                  onClick={() =>
                    navigate(`/my-reports/${report.id}`, {
                      state: { background: location },
                    })
                  }
                >
                  {report.title} –{" "}
                  <span>
                    {new Date(report.timestamp).toLocaleDateString("en-GB")}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="section">
        <h2>🔥 Most Commented</h2>
        <ul>
          {mostCommented.length === 0 ? (
            <li>No comments</li>
          ) : (
            mostCommented.map((report) => (
              <li key={report.id}>
                <button
                  className="link-button"
                  onClick={() =>
                    navigate(`/my-reports/${report.id}`, {
                      state: { background: location },
                    })
                  }
                >
                  {report.title} ({report.comments.length} comments)
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="section">
        <h2>✅ Fixed Issues</h2>
        <ul>
          {fixedReports.length === 0 ? (
            <li>No fixed reports</li>
          ) : (
            fixedReports.map((report) => (
              <li key={report.id}>
                <button
                  className="link-button"
                  onClick={() =>
                    navigate(`/my-reports/${report.id}`, {
                      state: { background: location },
                    })
                  }
                >
                  {report.title} (fixed on{" "}
                  {new Date(report.timestamp).toLocaleDateString("en-GB")})
                </button>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

export default Home;
