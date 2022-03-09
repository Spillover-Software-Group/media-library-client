import React, { useState, useEffect, useRef, createRef } from "react";
import axios from "axios";
import Select from "react-select";
import Dropzone from "react-dropzone";

import "./styles.scss";

import config from "../config/index";
import Modal from "../utils/modal";
import RegularIcon from "./icons/RegularIcon";
import MediaFile from "./MediaFile";
import FoldersNavigation from "./navigation/FoldersNavigation";
import MediaFilesContainer from "./MediaFilesContainer";
import UploadButton from "./buttons/UploadButton";

const allowedImageTypes = [".png", ".jpg", ".jpeg", ".PNG", ".JPG", ".JPEG"];

function MediaList({
  handleSelected,
  selectedBusiness,
  activeFolder,
  setActiveFolder,
  moveFile,
  deleteFile,
  recoverFile,
  mediaList,
  foldersList,
  setFoldersList,
  filesUploading,
  getFilesForFolder,
  setFavoriteForCurrentUser,
  baseUrl,
  changeBusiness,
  renderSelectOptions,
  userId,
  submitForm,
}) {
  // Some of these will need to move up to the parent element. I need to know when new files are added, and
  // which folder is active. This calls for storing some data in the main index component.
  const [addNewIsOpen, setAddNewIsOpen] = useState(false);
  const [formValues, setFormValues] = useState({ folderName: "" });
  const [subMenuVisible, setSubMenuVisibility] = useState(false);
  const [folderNotEmptyWarningIsOpen, setFolderNotEmptyWarningIsOpen] =
    useState(false);
  const [folderIdForRemoval, setFolderIdForRemoval] = useState(null);
  const [fileDeletionWarningOpen, setFileDeletionWarningModalIsOpen] =
    useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [isFavorite, setFavorite] = useState(false);
  const [fileIsUploading, setFileIsUploading] = useState(false);

  const inputRef = useRef();
  const { allowedFileTypes } = config;
  const dropZoneRef = createRef();

  const getFoldersList = async () => {
    const folderListUrl = selectedBusiness
      ? `${baseUrl}/folders_list/${selectedBusiness}`
      : `${baseUrl}/folders_list`;
    const foldersResponse = await axios.get(folderListUrl);
    const list = foldersResponse.data;

    const folderExistsForBusiness =
      activeFolder &&
      selectedBusiness &&
      list.filter((f) => f.id === activeFolder).length > 0;

    if (!activeFolder || !folderExistsForBusiness) {
      setActiveFolder(foldersResponse.data[0].id);
    }
    return setFoldersList(foldersResponse.data);
  };

  useEffect(() => {
    getFoldersList();
    const getMediaList = async () => {
      await getFilesForFolder(activeFolder);
    };

    if (activeFolder) {
      getMediaList();
    }
  }, []);

  const handleMediaClick = (mediaSrc) => {
    console.log("DEBUG_file: ", mediaSrc);
    handleSelected(mediaSrc);
  };

  const handleFolderAddNewClick = () => {
    setAddNewIsOpen(!addNewIsOpen);
  };

  const addNewFolderSubmit = async () => {
    const newFolderValues = { ...formValues, businessId: selectedBusiness };
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
    setAddNewIsOpen(!addNewIsOpen);
  };

  const deleteFolder = async (folderId) => {
    const removeFolderResponse = await axios.post(`${baseUrl}/delete_folder`, {
      folderId,
    });

    if (removeFolderResponse && removeFolderResponse.status === 200) {
      getFoldersList();
    }
  };

  const handleFolderRemoveClick = async (folderId) => {
    const folderNotEmpty =
      mediaList &&
      mediaList.filter((mf) => mf.folderId.toString() === folderId.toString())
        .length > 0;

    if (folderNotEmpty) {
      setFolderIdForRemoval(folderId);
      setFolderNotEmptyWarningIsOpen(true);
    } else {
      await deleteFolder(folderId);
    }
  };

  const handleFolderClick = (folderId) => {
    setActiveFolder(folderId);
  };

  const onChange = (ev) => {
    setFormValues({ ...formValues, [ev.target.name]: ev.target.value });
  };

  const handleMoveFileClick = (fileId, folderId) => {
    moveFile(fileId, folderId);
  };

  const handleDeleteFileClick = (fileId) => {
    setSelectedFileId(fileId);
    setFileDeletionWarningModalIsOpen(true);
  };

  const handleFileRecover = (fileId) => {
    recoverFile(fileId);
  };

  const confirmFileDelete = () => {
    if (selectedFileId) {
      deleteFile(selectedFileId);
      setSelectedFileId(null);
      setFileDeletionWarningModalIsOpen(false);
    }
  };
  const cancelFileDelete = () => {
    setSelectedFileId(null);
    setFileDeletionWarningModalIsOpen(false);
  };

  const handleFileFavoriteSetClick = (fileId) => {
    setFavorite(!isFavorite);
    setFavoriteForCurrentUser(fileId);
  };

  const deleteFolderWithFilesInside = async () => {
    if (folderIdForRemoval) {
      const filesToDelete = mediaList.filter(
        (f) => f.folderId.toString() === folderIdForRemoval.toString()
      );
      for (let i = 0; i < filesToDelete.length; i++) {
        const file = filesToDelete[i];
        deleteFile(file.id);
        if (i === filesToDelete.length - 1) {
          await deleteFolder(folderIdForRemoval);
        }
      }
    }
  };

  const folderDeletionWarningModal = (
    <Modal
      modalTitle="Folder is not empty!"
      handleClose={() => setFolderNotEmptyWarningIsOpen(false)}
    >
      <div className="folder-deletion-warning-modal warning-modal">
        <div className="folder-deletion-warning-text">
          Folder you are trying to delete is not empty. <br />
          Please move files out of it, or delete them before trying to delete
          this folder again.
        </div>
        <div className="folder-deletion-warning-buttons modal-warning-buttons">
          <button
            className="modal-button"
            onClick={() => setFolderNotEmptyWarningIsOpen(false)}
          >
            Cancel
          </button>
          <button
            className="modal-button button-danger"
            onClick={() => deleteFolderWithFilesInside()}
          >
            Delete All
          </button>
        </div>
      </div>
    </Modal>
  );

  const fileDeletionWarningModal = (
    <Modal modalTitle="Confirm file Deletion" handleClose={cancelFileDelete}>
      <div className="file-deletion-modal warning-modal">
        <div className="folder-deletion-warning-text modal-warning-text">
          <span className="fa fa-2x fa-hand-paper-o delete-warning-icon" />
          Are you sure you want to delete this file?
        </div>
        <div className="folder-deletion-warning-buttons modal-warning-buttons">
          <button className="modal-button" onClick={cancelFileDelete}>
            Cancel
          </button>
          <button
            className="modal-button button-danger"
            onClick={confirmFileDelete}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );

  const displayModal = (
    <Modal
      modalTitle="Add New Folder"
      handleClose={() => setAddNewIsOpen(false)}
    >
      <div className="form-container">
        <form className="folder-add-form" onSubmit={addNewFolderSubmit}>
          <div className="input-fields">
            <input
              className="folder-add-input"
              name="folderName"
              id="folderName"
              placeholder="Folder Name"
              onChange={onChange}
              required
              autoComplete="off"
            />
          </div>
          <div className="form-buttons">
            <button
              className="form-button"
              onClick={() => setAddNewIsOpen(false)}
            >
              Cancel
            </button>
            <button className="form-button" type="submit">
              Add
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );

  const openFileDialog = () => {
    inputRef.current.click();
  };

  const uploadFiles = (event) => {
    console.log("FROM UPLOAD FILE");
    const files = event.target.files;
    if (!files) return;

    const filesArray = Array.from(files);
    const formData = new FormData();

    if (files && files.length > 0) {
      formData.append("businessId", selectedBusiness);
      formData.append("folderId", activeFolder);
      formData.append("userId", userId);

      filesArray.forEach((file) => {
        formData.append("media-uploads", file);
      });
    }

    setFileIsUploading(true);

    fetch(`${baseUrl}/upload_files`, {
      method: "post",
      body: formData,
    })
      .then(async (res) => {
        console.log(res);
        await getFilesForFolder(activeFolder);
        setFileIsUploading(false);
      })
      .catch((err) => {
        console.log(`Error occured: ${err}`);
        setFileIsUploading(false);
      });
  };

  return (
    <div
      className={`w-full h-screen flex ${filesUploading ? " loading" : ""}`}
      key={activeFolder}
    >
      <FoldersNavigation
        handleFolderAddNewClick={handleFolderAddNewClick}
        handleFolderRemoveClick={handleFolderRemoveClick}
        foldersList={foldersList}
        setActiveFolder={setActiveFolder}
        activeFolder={activeFolder}
      />

      {addNewIsOpen ? displayModal : null}
      {folderNotEmptyWarningIsOpen ? folderDeletionWarningModal : null}
      {fileDeletionWarningOpen ? fileDeletionWarningModal : null}

      <div className="flex flex-col border border-red-600 w-3/4">
        <div className="border border-green-400 flex justify-evenly py-2">
          <Select
            className="business-select w-1/2"
            classNamePrefix="business-select-options"
            defaultValue={renderSelectOptions()[0]}
            onChange={changeBusiness}
            options={renderSelectOptions()}
          />
          <div>
            <UploadButton
              openFileDialog={openFileDialog}
              inputRef={inputRef}
              uploadFiles={uploadFiles}
            />
          </div>
        </div>

        <Dropzone
          onDrop={(files) => submitForm(files)}
          multiple
          accept={allowedFileTypes}
          ref={() => dropZoneRef}
          disabled={fileIsUploading}
          noClick
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <>
              <section className="border border-green-500 relative h-15 cursor-pointer">
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div>
                    {isDragActive && (
                      <div
                        style={{
                          border: "dashed grey 4px",
                          backgroundColor: "rgba(255,255,255,.8)",
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          left: 0,
                          right: 0,
                          zIndex: 9999,
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: 0,
                            left: 0,
                            textAlign: "center",
                            color: "grey",
                            fontSize: 36,
                          }}
                        >
                          <div>drop here</div>
                        </div>
                      </div>
                    )}
                    <MediaFilesContainer
                      mediaList={mediaList}
                      handleFileRecover={handleFileRecover}
                      handleMediaClick={handleMediaClick}
                      handleFileFavoriteSetClick={handleFileFavoriteSetClick}
                      handleDeleteFileClick={handleDeleteFileClick}
                      isFavorite={isFavorite}
                      setSubMenuVisibility={setSubMenuVisibility}
                      subMenuVisible={subMenuVisible}
                      handleMoveFileClick={handleMoveFileClick}
                    />
                  </div>
                </div>
              </section>
            </>
          )}
        </Dropzone>
      </div>
    </div>
  );
}

export default MediaList;
