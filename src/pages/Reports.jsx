import React, { useState, useEffect } from "react";
import "../styles/Reports.css"; 

function MyReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem("reports")) || [];
    setReports(storedReports);
  }, []);

  return (
    <div className="page">
      <h2>My Reports</h2>
      {reports.length === 0 ? (
        <p>No reports submitted yet.</p>
      ) : (
        <div className="reports-grid">
          {reports.map((report) => (
            <div key={report.id} className="report-card">
              <h3>{report.title}</h3>
              <p>
                <strong>By:</strong> {report.user}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(report.timestamp).toLocaleString()}
              </p>
              <p>{report.description}</p>
              {report.image && (
                <img
                  src={report.image}
                  alt="Report"
                  style={{
                    width: "100%",
                    maxHeight: "100px",
                    objectFit: "cover",
                  }}
                />
              )}
              <p>
                <strong>Location:</strong> {report.address}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReports;
