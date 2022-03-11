import React, { useState, useEffect, useRef } from "react";

import FoldersNavigation from "./FoldersNavigation";
import FilesContainer from "./FilesContainer";
import UploadFileButton from "./buttons/UploadFileButton";
import BusinessSwitcher from "./BusinessSwitcher";

function MediaLibraryContainer({
  selectedBusinessId,
  setselectedBusinessId,
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

  useEffect(() => {
    getFoldersList();
    const getMediaList = async () => {
      await getFilesForFolder(activeFolderId);
    };

    if (activeFolderId) {
      getMediaList();
    }
  }, []);

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
      formData.append("businessId", selectedBusinessId);
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
          selectedBusinessId={selectedBusinessId}
          getFilesForFolder={getFilesForFolder}
          userId={userId}
        />

        <div className="w-full h-screen">
          <div className="flex bg-gray-50 flex-col w-full pb-0.5 border-b border-spillover-color3">
            <div className="flex justify-evenly py-2">
              <BusinessSwitcher
                businessList={businessList}
                selectedBusinessId={selectedBusinessId}
                setselectedBusinessId={setselectedBusinessId}
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
              selectedBusinessId={selectedBusinessId}
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
