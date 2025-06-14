// components/UI/Modal.js
import React from "react";
import "../../styles/AddReportModal.css"

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // предотвратява затваряне при клик вътре
      >
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
