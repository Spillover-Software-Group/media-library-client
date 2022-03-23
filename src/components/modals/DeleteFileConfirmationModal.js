import React, { useState } from "react";

import Modal from "./Modal";

function DeleteFileConfirmationModal({ children, deleteFile }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleDeleteFile = () => {
    deleteFile();
    closeModal();
  };

  return (
    <>
      <div className="inset-0">
        <button
          type="button"
          onClick={() => {
            openModal();
          }}
        >
          {children}
        </button>
      </div>
      <Modal
        title="Confirm Delete File"
        subtitle="Are you sure you want to delete this file?"
        isOpen={isOpen}
        closeModal={closeModal}
      >
        <div className="flex justify-evenly items-center mt-2">
          <button
            className="border text-xs md:text-sm px-3 py-1 rounded-2xl transition ease-in-out duration-300 hover:bg-spillover-color3 hover:text-white"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="bg-spillover-color2 hover:bg-black px-3 py-1 text-xs md:text-sm text-white rounded-2xl transition ease-in-out duration-300"
            onClick={handleDeleteFile}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </>
  );
}

export default DeleteFileConfirmationModal;
