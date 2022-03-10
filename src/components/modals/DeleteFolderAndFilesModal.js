import React, { useState } from "react";
import RegularIcon from "../icons/RegularIcon";

import Modal from "./Modal";

function DeleteFolderAndFilesModal({
  deleteFolderWithFilesInside,
  isOpen,
  setIsOpen,
}) {
  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDeleteAll = () => {
    deleteFolderWithFilesInside();
    closeModal();
  };

  return (
    <>
      <Modal
        title="Folder Is Not Empty"
        isOpen={isOpen}
        closeModal={closeModal}
      >
        <div className="w-96">
          <div>
            <p className="mb-2 font-medium">
              <RegularIcon
                name="exclamation-circle"
                iconStyle="fas"
                className="text-spillover-color11 mr-2 text-2xl"
              />
              The folder you are trying to delete is not empty!
            </p>
            <p className="text-sm">
              Please move the files to another folder before delete. If you want
              to delete the folder and all the files, press the Delete All
              button.{" "}
            </p>
          </div>
          <div className="flex justify-evenly items-center mt-6">
            <button
              className="border text-xs md:text-sm px-3 py-1 rounded-2xl transition ease-in-out duration-300 hover:bg-spillover-color3 hover:text-white"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="bg-spillover-color2 hover:bg-black px-3 py-1 text-xs md:text-sm text-white rounded-2xl transition ease-in-out duration-300"
              onClick={handleDeleteAll}
            >
              DELETE ALL
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default DeleteFolderAndFilesModal;
