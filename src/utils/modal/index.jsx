import React from 'react';

import './modal-styles.scss';

function Modal({ modalTitle, children, handleClose }) {
  return (
    <div className="modal-container">
      <div className="modal-header">
        <div className="modal-title">{modalTitle}</div>
        <div className="close-modal-button" onClick={handleClose}>X</div>
      </div>
      <div className="modal-body">
        {children}
      </div>
    </div>
  );
}

export default Modal;
