import React from "react";
import "../../styles/ImagePreviewModal.css";

function ImagePreviewModal({ imageUrl, onClose }) {
  return (
    <div className="image-preview-modal" onClick={onClose}>
      <div className="image-preview-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <img src={imageUrl} alt="Preview" className="preview-image" />
      </div>
    </div>
  );
}

export default ImagePreviewModal;
