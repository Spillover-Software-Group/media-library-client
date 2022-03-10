import React, { useState, createRef } from "react";
import Dropzone from "react-dropzone";
import config from "../../config";
import RegularIcon from "../icons/RegularIcon";

import MediaFile from "./MediaFile";

const allowedImageTypes = [".png", ".jpg", ".jpeg", ".PNG", ".JPG", ".JPEG"];

function FilesContainer({
  mediaList,
  foldersList,
  activeFolderId,
  handleFileRecover,
  handleMediaClick,
  handleFileFavoriteSetClick,
  handleDeleteFileClick,
  isFavorite,
  setSubMenuVisibility,
  subMenuVisible,
  handleMoveFileClick,
  selectedBusiness,
  userId,
  baseUrl,
  getFilesForFolder,
}) {
  const { allowedFileTypes } = config;
  const dropZoneRef = createRef();

  const [fileIsUploading, setFileIsUploading] = useState(false);

  const isImage = (item) =>
    allowedImageTypes.includes(`.${item.fileName.split(".").pop()}`);

  const activeFolder = foldersList?.find(
    (folder) => folder.id === activeFolderId
  );

  const uploadFilesFromDrag = (files) => {
    console.log("DEBUG_FILES: ", files);

    const formData = new FormData();

    if (files && files.length > 0) {
      formData.append("businessId", selectedBusiness);
      formData.append("folderId", activeFolderId);
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
        await getFilesForFolder(activeFolderId);
        setFileIsUploading(false);
      })
      .catch((err) => {
        console.log(`Error occured: ${err}`);
        setFileIsUploading(false);
      });
  };

  return (
    <div className="h-[calc(100%_-_3.5rem)]">
      <div className="px-4 py-2">
        <div>
          <RegularIcon
            name="folder-open"
            iconStyle="fas"
            className="mr-2 text-xl text-spillover-color2"
          />
          {activeFolder?.folderName}
        </div>
        <span className="text-xs text-spillover-color3">
          {mediaList?.length} results
        </span>
      </div>
      <Dropzone
        onDrop={(files) => uploadFilesFromDrag(files)}
        multiple
        accept={allowedFileTypes}
        ref={() => dropZoneRef}
        disabled={fileIsUploading}
        noClick
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <>
            <section className="relative cursor-default h-full">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="h-[calc(100%_-_3.5rem)]">
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
                  <div className="w-full h-[calc(100vh_-_10rem)] overflow-y-auto cursor-default">
                    <div className="flex flex-wrap justify-start p-2">
                      {mediaList?.map((item) => (
                        <MediaFile
                          key={item.id}
                          fileId={item.id}
                          fileName={item?.fileName?.split(".")[0]}
                          isImage={isImage(item)}
                          mediaSrc={item.url}
                          handleFileRecover={handleFileRecover}
                          handleMediaClick={handleMediaClick}
                          handleFileFavoriteSetClick={
                            handleFileFavoriteSetClick
                          }
                          handleDeleteFileClick={handleDeleteFileClick}
                          isFavorite={isFavorite}
                          setSubMenuVisibility={setSubMenuVisibility}
                          subMenuVisible={subMenuVisible}
                          foldersList={foldersList}
                          handleMoveFileClick={handleMoveFileClick}
                          fileIsDeleted={false}
                          getFilesForFolder={getFilesForFolder}
                          activeFolderId={activeFolderId}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </Dropzone>
    </div>
  );
}

export default FilesContainer;
