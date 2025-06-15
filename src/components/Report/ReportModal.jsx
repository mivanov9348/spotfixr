import React, { useState, useEffect } from "react";
import "../../styles/ReportModal.css";
import ImagePreviewModal from "./ImagePreviewModal"

function ReportModal({ report, onClose }) {
  const storageKey = `comments-${report?.id || "default"}`;
  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [newComment, setNewComment] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(comments));
  }, [comments, storageKey]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment = {
      text: newComment,
      timestamp: new Date().toLocaleString(),
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  if (!report) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>
            X
          </button>
          <p>Няма данни за репорта.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          X
        </button>

        <div className="modal-header">
          <h2>{report.title || "Без заглавие"}</h2>
        </div>

        <div className="modal-body">
          <div className="modal-details">
            <p className="description">
              {report.description || "Няма описание"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  report.status
                    ? `status-${report.status.toLowerCase()}`
                    : "status-none"
                }
              >
                {report.status || "Няма статус"}
              </span>
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {report.timestamp
                ? new Date(report.timestamp).toLocaleString()
                : "Няма дата"}
            </p>
          </div>

          {(report.images || report.image) && (
            <div className="modal-images">
              <h4>Images</h4>
              <div className="images-list">
                {report.images ? (
                  report.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Report image ${index + 1}`}
                      className="modal-image"
                      onClick={() => setPreviewImage(img)}
                    />
                  ))
                ) : (
                  <img
                    src={report.image}
                    alt="Report"
                    className="modal-image"
                    onClick={() => setPreviewImage(report.image)}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        <div className="comments-section">
          <h4>Comments</h4>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows="3"
              required
            />
            <button type="submit">Submit</button>
          </form>

          <ul className="comments-list">
            {comments.map((c, index) => (
              <li key={index}>
                <p>{c.text}</p>
                <span>{c.timestamp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {previewImage && (
        <ImagePreviewModal
          imageUrl={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
}

export default ReportModal;
