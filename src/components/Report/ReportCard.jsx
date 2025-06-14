import React from "react";
import "../../styles/ReportCard.css"; 

function ReportCard({ report, onClick, onDelete, isOwner }) {
  return (
    <div className="report-card" onClick={onClick}>
      {report.image && (
        <img src={report.image} alt="Report" className="report-image" />
      )}
      <h4>{report.title}</h4>
      <p className="description">
        {report.description.length > 20
          ? report.description.slice(0, 20) + "..."
          : report.description}
      </p>
      <p className="status">
        <strong>Status:</strong> {report.status}
      </p>
      <p className="timestamp">
        <strong>Date:</strong>{" "}
        {new Date(report.timestamp).toLocaleString("bg-BG")}
      </p>

      {isOwner && (
        <button
          className="delete-button"
          onClick={(e) => {
            e.stopPropagation(); 
            onDelete();
          }}
        >
          ❌ Delete
        </button>
      )}
    </div>
  );
}
export default ReportCard;