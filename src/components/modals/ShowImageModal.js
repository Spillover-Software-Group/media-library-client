import React, { useState } from "react";
import Modal from "./Modal";

function ShowImageModal({ children, mediaSrc }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
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
        isOpen={isOpen}
        closeModal={closeModal}
        customStyles="w-fil inline-block overflow-hidden align-middle transition-all transform"
      >
        <div className="flex justify-evenly items-center mt-2">
          <div className="w-full">
            <img
              src="https://images.unsplash.com/photo-1646697525966-50a59fa433dc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              alt="some media file"
              className="object-cover w-full h-128"
            />
            <div className="flex justify-evenly items-center mt-6">
              <button
                className="bg-spillover-color2 hover:bg-black px-3 py-1 text-xs md:text-sm text-white rounded-2xl transition ease-in-out duration-300"
                type="submit"
                onClick={closeModal}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ShowImageModal;
