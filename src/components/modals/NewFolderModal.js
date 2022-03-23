import React, { useState } from "react";
import axios from "axios";

import Modal from "./Modal";
import config from "../../config";

function NewFolderModal({ children, selectedBusinessId, getFoldersList }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState({ folderName: "" });

  const { baseUrl } = config;

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const onChange = (ev) => {
    setFormValues({ ...formValues, [ev.target.name]: ev.target.value });
  };

  const addNewFolder = async (e) => {
    e.preventDefault();

    const newFolderValues = { ...formValues, businessId: selectedBusinessId };
    const newFolderResponse = await axios.post(
      `${baseUrl}/create_folder`,
      newFolderValues,
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );

    if (newFolderResponse.status === 200) {
      getFoldersList();
    }
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
      <Modal title="New Folder" isOpen={isOpen} closeModal={closeModal}>
        <div className="flex justify-evenly items-center mt-2 w-72">
          <form className="w-full" onSubmit={addNewFolder}>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-spillover-color2 focus:border-spillover-color2 block w-full p-2.5"
              name="folderName"
              id="folderName"
              placeholder="Folder Name"
              onChange={onChange}
              required
              autoComplete="off"
            />
            <div className="flex justify-evenly items-center mt-6">
              <button
                className="border text-xs md:text-sm px-3 py-1 rounded-2xl transition ease-in-out duration-300 hover:bg-spillover-color3 hover:text-white"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-spillover-color2 hover:bg-black px-3 py-1 text-xs md:text-sm text-white rounded-2xl transition ease-in-out duration-300"
                type="submit"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default NewFolderModal;
