import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Select from "react-select";

import FoldersNavigation from "./FoldersNavigation";
import FilesContainer from "./FilesContainer";
import UploadFileButton from "./buttons/UploadFileButton";

function MediaLibraryContainer({
  selectedBusiness,
  setSelectedBusiness,
  activeFolderId,
  setActiveFolderId,
  mediaList,
  foldersList,
  getFoldersList,
  getFilesForFolder,
  baseUrl,
  userId,
  businessList,
}) {
  // Some of these will need to move up to the parent element. I need to know when new files are added, and
  // which folder is active. This calls for storing some data in the main index component.
  const [fileIsUploading, setFileIsUploading] = useState(false);

  const inputRef = useRef();

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

  useEffect(() => {
    getFoldersList();
    const getMediaList = async () => {
      await getFilesForFolder(activeFolderId);
    };

    if (activeFolderId) {
      getMediaList();
    }
  }, []);

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
          getFilesForFolder={getFilesForFolder}
          userId={userId}
        />

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
              activeFolderId={activeFolderId}
              foldersList={foldersList}
              selectedBusiness={selectedBusiness}
              userId={userId}
              getFilesForFolder={getFilesForFolder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaLibraryContainer;
