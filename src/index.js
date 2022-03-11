import React, { useState } from "react";
import axios from "axios";

import "./css/style.scss";

import MediaLibraryContainer from "./components/MediaLibraryContainer";
import config from "./config";

const { baseUrl } = config;

function MediaLibrary({ handleSelected, businessList, userId }) {
  const defaultBusiness =
    businessList && businessList.length > 0 ? businessList[0].id : "";
  const [selectedBusiness, setSelectedBusiness] = useState(defaultBusiness);
  const [activeFolderId, setActiveFolderId] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [foldersList, setFoldersList] = useState([]);
  const [fileIsUploading, setFileIsUploading] = useState(false);

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

  const recoverFile = async (fileId) => {
    await axios.post(`${baseUrl}/update_file/${fileId}`, {
      updatedFields: {
        deleted: false,
        deletedDate: null,
      },
    });

    await getFilesForFolder(activeFolderId);
  };

  return (
    <MediaLibraryContainer
      userId={userId}
      baseUrl={baseUrl}
      handleSelected={handleSelected}
      selectedBusiness={selectedBusiness}
      setSelectedBusiness={setSelectedBusiness}
      activeFolderId={activeFolderId}
      setActiveFolderId={setActiveFolderId}
      key={`${selectedBusiness}-${activeFolderId}`}
      recoverFile={recoverFile}
      mediaList={mediaList}
      setMediaList={setMediaList}
      getFoldersList={getFoldersList}
      foldersList={foldersList}
      filesUploading={fileIsUploading}
      getFilesForFolder={getFilesForFolder}
      businessList={businessList}
    />
  );
}

export default MediaLibrary;
