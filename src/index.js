import React, { useState, createRef, useRef } from "react";
import axios from "axios";

import "./css/style.scss";

import MediaList from "./components/media-files-list";
import config from "./config";
import RegularIcon from "./components/icons/RegularIcon";

const dropZoneRef = createRef();

const { baseUrl } = config;

function MediaLibrary({ handleSelected, businessList, userId }) {
  const defaultBusiness =
    businessList && businessList.length > 0 ? businessList[0].id : "";
  const [selectedBusiness, setSelectedBusiness] = useState(defaultBusiness);
  const [activeFolder, setActiveFolder] = useState(null);
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
      activeFolder &&
      selectedBusiness &&
      list.filter((f) => f.id === activeFolder).length > 0;

    if (!activeFolder || !folderExistsForBusiness) {
      setActiveFolder(foldersResponse.data[0].id);
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

  if (!activeFolder) {
    getFoldersList();
  }

  const submitForm = (files) => {
    console.log("DEBUG_FILES: ", files);

    const formData = new FormData();

    if (files && files.length > 0) {
      formData.append("businessId", selectedBusiness);
      formData.append("folderId", activeFolder);
      formData.append("userId", userId);

      files.forEach((file) => {
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
    await getFilesForFolder(activeFolder);
  };

  const deleteFile = async (fileId) => {
    console.log("DEBUG_DELETE_FILE_WITH_ID: ", fileId);

    const deleteFileResponse = await axios.post(`${baseUrl}/delete_file`, {
      fileId,
    });

    console.log("DEBUG_FILE_DELETE_RESPONSE: ", deleteFileResponse);
    await getFilesForFolder(activeFolder);
  };

  const recoverFile = async (fileId) => {
    await axios.post(`${baseUrl}/update_file/${fileId}`, {
      updatedFields: {
        deleted: false,
        deletedDate: null,
      },
    });

    await getFilesForFolder(activeFolder);
  };

  const changeBusiness = (option) => {
    console.log("DEBUG_OPTION_SELECTED: ", option);
    console.log("DEBUG_ACTIVE_FOLDER: ", activeFolder);
    if (option) {
      setSelectedBusiness(option.value);
    }
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
    <div className=" flex justify-center items-center">
      <div className="w-full container  flex flex-col justify-center">
        <MediaList
          renderSelectOptions={renderSelectOptions}
          userId={userId}
          baseUrl={baseUrl}
          handleSelected={handleSelected}
          selectedBusiness={selectedBusiness}
          activeFolder={activeFolder}
          setActiveFolder={setActiveFolder}
          key={`${selectedBusiness}-${activeFolder}`}
          moveFile={moveFile}
          deleteFile={deleteFile}
          recoverFile={recoverFile}
          mediaList={mediaList}
          setMediaList={setMediaList}
          foldersList={foldersList}
          setFoldersList={setFoldersList}
          filesUploading={fileIsUploading}
          getFilesForFolder={getFilesForFolder}
          setFavoriteForCurrentUser={setFavoriteForCurrentUser}
          changeBusiness={changeBusiness}
          submitForm={submitForm}
        />
      </div>
    </div>
  );
}

export default MediaLibrary;
