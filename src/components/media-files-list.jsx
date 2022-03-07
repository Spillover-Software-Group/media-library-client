import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './styles.scss';

import Modal from '../utils/modal';
import RegularIcon from './icons/RegularIcon';
import MediaFile from './MediaFile';

const allowedImageTypes = ['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG'];

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
}) {
  // Some of these will need to move up to the parent element. I need to know when new files are added, and
  // which folder is active. This calls for storing some data in the main index component.
  const [addNewIsOpen, setAddNewIsOpen] = useState(false);
  const [formValues, setFormValues] = useState({ folderName: '' });
  const [subMenuVisible, setSubMenuVisibility] = useState(false);
  const [folderNotEmptyWarningIsOpen, setFolderNotEmptyWarningIsOpen] = useState(false);
  const [folderIdForRemoval, setFolderIdForRemoval] = useState(null);
  const [fileDeletionWarningOpen, setFileDeletionWarningModalIsOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [isFavorite, setFavorite] = useState(false);

  const getFoldersList = async () => {
    const folderListUrl = selectedBusiness ? `${baseUrl}/folders_list/${selectedBusiness}` : `${baseUrl}/folders_list`;
    const foldersResponse = await axios.get(folderListUrl);
    const list = foldersResponse.data;

    const folderExistsForBusiness = (activeFolder && selectedBusiness)
      && (list.filter((f) => f.id === activeFolder)).length > 0;

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
    console.log('DEBUG_file: ', mediaSrc);
    handleSelected(mediaSrc);
  };

  const handleFolderAddNewClick = () => {
    setAddNewIsOpen(!addNewIsOpen);
  };

  const addNewFolderSubmit = async () => {
    const newFolderValues = { ...formValues, businessId: selectedBusiness };
    const newFolderResponse = await axios.post(`${baseUrl}/create_folder`, newFolderValues, {
      headers: {
        'content-type': 'application/json',
      },
    });

    if (newFolderResponse.status === 200) {
      getFoldersList();
    }
    setAddNewIsOpen(!addNewIsOpen);
  };

  const deleteFolder = async (folderId) => {
    const removeFolderResponse = await axios.post(`${baseUrl}/delete_folder`, { folderId });

    if (removeFolderResponse && removeFolderResponse.status === 200) {
      getFoldersList();
    }
  };

  const handleFolderRemoveClick = async (folderId) => {
    const folderNotEmpty = mediaList && mediaList.filter((mf) => mf.folderId.toString() === folderId.toString()).length > 0;

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
      const filesToDelete = mediaList.filter((f) => f.folderId.toString() === folderIdForRemoval.toString());
      for (let i = 0; i < filesToDelete.length; i++) {
        const file = filesToDelete[i];
        deleteFile(file.id);
        if (i === filesToDelete.length - 1) {
          await deleteFolder(folderIdForRemoval);
        }
      }
    }
  };

  console.log('DEBUG_LIST: ', mediaList);
  const filesList = mediaList.map((item) => Object.entries(item).map(([key, value]) => {
    if (key === 'url') {
      const mediaSrc = value;
      const fileName = item.fileName.split('.')[0];
      const fileId = item.id;
      // const fileIsDeleted = item.deleted;
      const fileIsDeleted = false;

      const filteredFoldersList = foldersList.filter((folder) => folder.id !== activeFolder);
      // Need to make sure images get displayed as images and video files as video for preview.
      const isImage = allowedImageTypes.includes(`.${item.fileName.split('.').pop()}`);
      return (
        <MediaFile 
          fileId={fileId}
          fileName={fileName}
          isImage={isImage}
          mediaSrc={mediaSrc}
          handleFileRecover={handleFileRecover}
          handleMediaClick={handleMediaClick}
          handleFileFavoriteSetClick={handleFileFavoriteSetClick}
          isFavorite={isFavorite}
          setSubMenuVisibility={setSubMenuVisibility}
          subMenuVisible={subMenuVisible}
          filteredFoldersList={filteredFoldersList}
          handleMoveFileClick={handleMoveFileClick}
          fileIsDeleted={fileIsDeleted}
        />
      );
    }
    return null;
  }));

  const folderNameList = foldersList.map((f, index) => (
    <div className={`folder-item-row${activeFolder === f.id ? ' is-active' : ''}`} id={`folder-item-row-${index}`} key={`folder-item-row-${index}`}>
      <div className="folder-name" onClick={() => handleFolderClick(f.id)}>{f.folderName || ''}</div>
      {f.businessId === 'TEST_SPILLOVER_ID'
        ? null
        : <div key={`folder-remove-btn-${index}`} className="folder-remove-icon" onClick={() => handleFolderRemoveClick(f.id)}><i className="fa fa-trash delete-icon" /></div>}
    </div>
  ));

  const folderDeletionWarningModal = (
    <Modal
      modalTitle="Folder is not empty!"
      handleClose={() => setFolderNotEmptyWarningIsOpen(false)}
    >
      <div className="folder-deletion-warning-modal warning-modal">
        <div className="folder-deletion-warning-text">
          Folder you are trying to delete is not empty.
          {' '}
          <br />
          Please move files out of it, or delete them before trying to delete this folder again.
        </div>
        <div className="folder-deletion-warning-buttons modal-warning-buttons">
          <button className="modal-button" onClick={() => setFolderNotEmptyWarningIsOpen(false)}>Cancel</button>
          <button className="modal-button button-danger" onClick={() => deleteFolderWithFilesInside()}>Delete All</button>
        </div>
      </div>
    </Modal>
  );

  const fileDeletionWarningModal = (
    <Modal
      modalTitle="Confirm file Deletion"
      handleClose={cancelFileDelete}
    >
      <div className="file-deletion-modal warning-modal">
        <div className="folder-deletion-warning-text modal-warning-text">
          <span className="fa fa-2x fa-hand-paper-o delete-warning-icon" />
          Are you sure you want to delete this file?
        </div>
        <div className="folder-deletion-warning-buttons modal-warning-buttons">
          <button className="modal-button" onClick={cancelFileDelete}>Cancel</button>
          <button className="modal-button button-danger" onClick={confirmFileDelete}>Confirm</button>
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
            <button className="form-button" onClick={() => setAddNewIsOpen(false)}>Cancel</button>
            <button className="form-button" type="submit">Add</button>
          </div>
        </form>
      </div>
    </Modal>
  );

  return (
    <div className={`w-full flex border border-yellow-400 ${filesUploading ? ' loading' : ''}`} key={activeFolder}>
      <div className="w-1/5 border border-green-500" id="folder-list-section">
        <div className="folder-item add-new" onClick={handleFolderAddNewClick}>+ New Folder</div>
        <div className="folder-item">{folderNameList}</div>
      </div>
      {addNewIsOpen ? displayModal : null}
      {folderNotEmptyWarningIsOpen ? folderDeletionWarningModal : null}
      {fileDeletionWarningOpen ? fileDeletionWarningModal : null}
      <div className="border border-blue-500 p-4 w-full flex justify-center items-center flex-wrap" id="files-list-section">{filesList}</div>
    </div>
  );
}

export default MediaList;
