import React from "react";
import "../../styles/ReportCard.css"; // Adjust the path as necessary

function ReportCard({ report, onClick }) {
  return (
    <div className="report-card" onClick={onClick}>
      {report.image && (
        <img src={report.image} alt="Report" className="report-image" />
      )}
      <h4>{report.title}</h4>
      <p className="description">{report.description}</p>
      <p className="status">
        <strong>Status:</strong> {report.status}
      </p>
      <p className="timestamp">
        <strong>Date:</strong>{" "}
        {new Date(report.timestamp).toLocaleString("bg-BG")}
      </p>
    </div>
  );
}

export default ReportCard;
