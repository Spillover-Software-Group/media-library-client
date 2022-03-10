import React, { useState, useEffect, useRef, createRef } from "react";
import axios from "axios";
import Select from "react-select";
import Dropzone from "react-dropzone";

import config from "../config/index";
import Modal from "../utils/modal";
import RegularIcon from "./icons/RegularIcon";
import MediaFile from "./FilesContainer/MediaFile";
import FoldersNavigation from "./FoldersNavigation";
import FilesContainer from "./FilesContainer";
import UploadFileButton from "./buttons/UploadFileButton";

const allowedImageTypes = [".png", ".jpg", ".jpeg", ".PNG", ".JPG", ".JPEG"];

function MediaList({
  handleSelected,
  selectedBusiness,
  setSelectedBusiness,
  activeFolderId,
  setActiveFolderId,
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
  renderSelectOptions,
  userId,
}) {
  // Some of these will need to move up to the parent element. I need to know when new files are added, and
  // which folder is active. This calls for storing some data in the main index component.
  const [addNewIsOpen, setAddNewIsOpen] = useState(false);
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
      activeFolderId &&
      selectedBusiness &&
      list.filter((f) => f.id === activeFolderId).length > 0;

    if (!activeFolderId || !folderExistsForBusiness) {
      setActiveFolderId(foldersResponse.data[0].id);
    }
    return setFoldersList(foldersResponse.data);
  };

  useEffect(() => {
    getFoldersList();
    const getMediaList = async () => {
      await getFilesForFolder(activeFolderId);
    };

    if (activeFolderId) {
      getMediaList();
    }
  }, []);

  const handleMediaClick = (mediaSrc) => {
    console.log("DEBUG_file: ", mediaSrc);
    handleSelected(mediaSrc);
  };

  const handleMoveFileClick = (fileId, folderId) => {
    moveFile(fileId, folderId);
  };

  const handleFileRecover = (fileId) => {
    recoverFile(fileId);
  };

  const handleFileFavoriteSetClick = (fileId) => {
    setFavorite(!isFavorite);
    setFavoriteForCurrentUser(fileId);
  };

  const changeBusiness = (option) => {
    console.log("DEBUG_OPTION_SELECTED: ", option);
    console.log("DEBUG_ACTIVE_FOLDER: ", activeFolderId);
    if (option) {
      setSelectedBusiness(option.value);
    }
  };

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
      formData.append("folderId", activeFolderId);
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
        await getFilesForFolder(activeFolderId);
        setFileIsUploading(false);
      })
      .catch((err) => {
        console.log(`Error occured: ${err}`);
        setFileIsUploading(false);
      });
  };

  return (
    <div className="flex justify-center items-center mx-28">
      <div className={`w-full h-screen border border-spillover-color6 flex`}>
        <FoldersNavigation
          foldersList={foldersList}
          setActiveFolderId={setActiveFolderId}
          activeFolderId={activeFolderId}
          getFoldersList={getFoldersList}
          selectedBusiness={selectedBusiness}
          mediaList={mediaList}
          getFilesForFolder={getFilesForFolder}
          userId={userId}
        />

        {/* {addNewIsOpen ? displayModal : null}
        {folderNotEmptyWarningIsOpen ? folderDeletionWarningModal : null}
        {fileDeletionWarningOpen ? fileDeletionWarningModal : null} */}

        <div className="w-full h-screen">
          <div className="flex bg-gray-50 flex-col w-full pb-0.5 border-b border-spillover-color3">
            <div className="flex justify-evenly py-2">
              <Select
                className="business-select w-1/2"
                classNamePrefix="business-select-options"
                defaultValue={renderSelectOptions()[0]}
                onChange={changeBusiness}
                options={renderSelectOptions()}
              />
              <div>
                <UploadFileButton
                  openFileDialog={openFileDialog}
                  inputRef={inputRef}
                  uploadFiles={uploadFiles}
                />
              </div>
            </div>
          </div>

          <div className="p-4 h-[calc(100%_-_4rem)]">
            <FilesContainer
              mediaList={mediaList}
              handleFileRecover={handleFileRecover}
              handleMediaClick={handleMediaClick}
              handleFileFavoriteSetClick={handleFileFavoriteSetClick}
              isFavorite={isFavorite}
              setSubMenuVisibility={setSubMenuVisibility}
              subMenuVisible={subMenuVisible}
              handleMoveFileClick={handleMoveFileClick}
              activeFolderId={activeFolderId}
              foldersList={foldersList}
              selectedBusiness={selectedBusiness}
              setSelectedBusiness={setSelectedBusiness}
              userId={userId}
              baseUrl={baseUrl}
              getFilesForFolder={getFilesForFolder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaList;
