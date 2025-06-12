import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Reports.css";
import ReportCard from "../components/Report/ReportCard";

function Reports() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem("reports")) || [];
    setReports(storedReports);
  }, []);

  useEffect(() => {
    let updated = [...reports];
    if (statusFilter !== "all") {
      updated = updated.filter((report) => report.status === statusFilter);
    }
    updated.sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp)
    );
    setFilteredReports(updated);
  }, [reports, sortOrder, statusFilter]);

  const handleCardClick = (report) => {
    navigate(`/my-reports/${report.id}`, {
      state: { background: location },
    });
  };

  return (
    <div className="page">
      <h2>My Reports</h2>

      <div className="controls">
        <label>
          Sort:
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">⬇</option>
            <option value="asc">⬆</option>
          </select>
        </label>

        <label>
          Filter:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Ready">Ready</option>
            <option value="in process">In Process</option>
            <option value="submitted">Submitted</option>
          </select>
        </label>
      </div>

      {filteredReports.length === 0 ? (
        <p>Няма репорти, отговарящи на критериите.</p>
      ) : (
        <div className="reports-grid">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onClick={() => handleCardClick(report)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Reports;
