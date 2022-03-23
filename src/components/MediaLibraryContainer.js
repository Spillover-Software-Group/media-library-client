import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";

import useFetchFilesForFolder from "../hooks/useFetchFilesForFolder";
import FoldersNavigation from "./FoldersNavigation";
import FilesContainer from "./FilesContainer";
import UploadFileButton from "./buttons/UploadFileButton";
import BusinessSwitcher from "./BusinessSwitcher";

import "react-toastify/dist/ReactToastify.min.css";

function MediaLibraryContainer({
  selectedBusinessId,
  setSelectedBusinessId,
  activeFolderId,
  setActiveFolderId,
  foldersList,
  getFoldersList,
  baseUrl,
  userId,
  businessList,
}) {
  // Some of these will need to move up to the parent element. I need to know when new files are added, and
  // which folder is active. This calls for storing some data in the main index component.
  const [pageNum, setPageNum] = useState(1);
  const { isLoading, mediaList, hasMore, totalFiles, refetch } =
    useFetchFilesForFolder(pageNum, userId, activeFolderId);

  const inputRef = useRef();

  useEffect(() => {
    getFoldersList();
  }, []);

  const openFileDialog = () => {
    inputRef.current.click();
  };

  // TODO: we can improve this function, to be used on the dragFiles upload too.
  const uploadFiles = (event) => {
    console.log("FROM UPLOAD FILE");
    const files = event.target.files;
    if (!files) return;

    const filesArray = Array.from(files);
    const formData = new FormData();

    if (filesArray && filesArray.length > 0) {
      formData.append("businessId", selectedBusinessId);
      formData.append("folderId", activeFolderId);
      formData.append("userId", userId);

      filesArray.forEach((file) => {
        formData.append("media-uploads", file);
      });
    }

    // TODO: We need a better way to handle API calls, refetch, etc
    // We need to change the page number to have a refetch. For now its a "ugly" solution, when
    // we implement the new back end needs to fix this.
    toast.promise(
      fetch(`${baseUrl}/upload_files`, {
        method: "post",
        body: formData,
      })
        .then(async () => {
          refetch({});
        })
        .then(() => setPageNum(0))
        .then(() => setPageNum(1))
        .catch((err) => {
          console.log(`Error occured: ${err}`);
        }),
      {
        pending: "Uploading files...",
        success: "Uploaded Susscesfully.",
        error: "Something went wrong!",
      }
    );
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
          userId={userId}
        />

        <div className="w-full h-screen">
          <div className="flex bg-gray-50 flex-col w-full pb-0.5 border-b border-spillover-color3">
            <div className="flex justify-evenly py-2">
              <BusinessSwitcher
                businessList={businessList}
                selectedBusinessId={selectedBusinessId}
                setSelectedBusinessId={setSelectedBusinessId}
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
              activeFolderId={activeFolderId}
              foldersList={foldersList}
              selectedBusinessId={selectedBusinessId}
              userId={userId}
              setPageNum={setPageNum}
              isLoading={isLoading}
              mediaList={mediaList}
              hasMore={hasMore}
              totalFiles={totalFiles}
              refetch={refetch}
            />
          </div>
        </div>
        <ToastContainer position="bottom-right" autoClose={2500} />
      </div>
    </div>
  );
}

export default MediaLibraryContainer;
