import React, { useState, createRef, useRef } from "react";
import axios from "axios";

import "./css/style.scss";

import MediaLibraryContainer from "./components/MediaLibraryContainer";
import config from "./config";
import RegularIcon from "./components/icons/RegularIcon";

const dropZoneRef = createRef();

const { baseUrl } = config;

function MediaLibrary({ handleSelected, businessList, userId }) {
  const defaultBusiness =
    businessList && businessList.length > 0 ? businessList[0].id : "";
  const [selectedBusiness, setSelectedBusiness] = useState(defaultBusiness);
  const [activeFolderId, setActiveFolderId] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [foldersList, setFoldersList] = useState([]);
  const [fileIsUploading, setFileIsUploading] = useState(false);

  console.log({ mediaList });

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

  const getFilesForFolder = async (folderId) => {
    const filesResponse = await axios.get(`${baseUrl}/${folderId}/files`, {
      params: { userId },
    });

    console.log("DEBUG_FILES_FOR_FOLDER: ", filesResponse);
    setMediaList(filesResponse.data);
  };

  if (!activeFolderId) {
    getFoldersList();
  }

  const setFavoriteForCurrentUser = async (fileId) => {
    const newFavorite = {
      fileId,
      userId,
    };

    const newFavoriteResponse = await axios.post(`${baseUrl}/favorites_add`, {
      newFavorite,
    });
    console.log("DEBUG_NEW_FAVOURITE_RESPONSE: ", newFavoriteResponse);
  };

  const moveFile = async (fileId, newFolderId) => {
    console.log(`DEBUG: Moving file ${fileId} to folder ${newFolderId}`);
    const moveFileResponse = await axios.post(
      `${baseUrl}/update_file/${fileId}`,
      { updatedFields: { folderId: newFolderId } }
    );
    console.log("DEBUG_FILE_UPDATE_RESPONSE: ", moveFileResponse);
    await getFilesForFolder(activeFolderId);
  };

  const recoverFile = async (fileId) => {
    await axios.post(`${baseUrl}/update_file/${fileId}`, {
      updatedFields: {
        deleted: false,
        deletedDate: null,
      },
    });

    await getFilesForFolder(activeFolderId);
  };

  const renderSelectOptions = () => {
    console.log("DEBUG_SELECTED_BUSINESS_VALUE: ", selectedBusiness);
    if (businessList && businessList.length > 0) {
      return businessList.map((b) => ({
        value: b.id,
        label: b.name,
      }));
    }

    return [];
  };

  return (
    <MediaLibraryContainer
      renderSelectOptions={renderSelectOptions}
      userId={userId}
      baseUrl={baseUrl}
      handleSelected={handleSelected}
      selectedBusiness={selectedBusiness}
      setSelectedBusiness={setSelectedBusiness}
      activeFolderId={activeFolderId}
      setActiveFolderId={setActiveFolderId}
      key={`${selectedBusiness}-${activeFolderId}`}
      moveFile={moveFile}
      recoverFile={recoverFile}
      mediaList={mediaList}
      setMediaList={setMediaList}
      foldersList={foldersList}
      setFoldersList={setFoldersList}
      filesUploading={fileIsUploading}
      getFilesForFolder={getFilesForFolder}
      setFavoriteForCurrentUser={setFavoriteForCurrentUser}
    />
  );
}

export default MediaLibrary;
