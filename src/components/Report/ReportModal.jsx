// components/Report/ReportModal.jsx
import React from "react";
import "../../styles/ReportModal.css"; // Adjust the path as necessary

function ReportModal({ report, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <h3>{report.title}</h3>
        <p>{report.description}</p>
        <p><strong>Status:</strong> {report.status}</p>
        <p><strong>Time:</strong> {new Date(report.timestamp).toLocaleString()}</p>
        {report.image && (
          <img src={report.image} alt="Report" className="modal-image" />
        )}
      </div>
    </div>
  );
}

export default ReportModal;
