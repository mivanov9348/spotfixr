import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const [latestReports, setLatestReports] = useState([]);
  const [mostCommented, setMostCommented] = useState([]);
  const [fixedReports, setFixedReports] = useState([]);

  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem("reports")) || [];

    // Последни по дата (сортирани низходящо по timestamp)
    const sortedByDate = [...storedReports].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    setLatestReports(sortedByDate.slice(0, 5)); // последни 5

    // Най-коментирани (по брой на comments, ако е масив)
    const sortedByComments = [...storedReports]
      .filter((r) => r.comments && Array.isArray(r.comments))
      .sort((a, b) => b.comments.length - a.comments.length);
    setMostCommented(sortedByComments.slice(0, 5));

    // Фиксирани (status === "fixed" или какъвто е статусът ти)
    const fixed = storedReports.filter(
      (r) => r.status && r.status.toLowerCase() === "fixed"
    );
    setFixedReports(fixed.slice(0, 5));
  }, []);

  return (
    <div className="home-container">
      <section className="hero">
        <h1 className="hero-title">Добре дошъл в SpotFixr</h1>
        <p className="hero-subtitle">
          Помогни за подобряването на града като подадеш сигнал за счупена инфраструктура.
        </p>
        <Link to="/submit">
          <button className="hero-button">Подай сигнал</button>
        </Link>
      </section>

      <section className="section">
        <h2>🕓 Последни сигнали</h2>
        <ul>
          {latestReports.length === 0 ? (
            <li>Няма сигнали</li>
          ) : (
            latestReports.map((report) => (
              <li key={report.id}>
                <Link to={`/report/${report.id}`}>
                  {report.title} –{" "}
                  <span>
                    {new Date(report.timestamp).toLocaleDateString("bg-BG")}
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="section">
        <h2>🔥 Най-коментирани</h2>
        <ul>
          {mostCommented.length === 0 ? (
            <li>Няма коментари</li>
          ) : (
            mostCommented.map((report) => (
              <li key={report.id}>
                <Link to={`/report/${report.id}`}>
                  {report.title} ({report.comments.length} коментара)
                </Link>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="section">
        <h2>✅ Решени проблеми</h2>
        <ul>
          {fixedReports.length === 0 ? (
            <li>Няма фиксирани</li>
          ) : (
            fixedReports.map((report) => (
              <li key={report.id}>
                <Link to={`/report/${report.id}`}>
                  {report.title} (фиксиран на{" "}
                  {new Date(report.timestamp).toLocaleDateString("bg-BG")})
                </Link>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

export default Home;
