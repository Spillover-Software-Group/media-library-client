import React from "react";

import MediaFile from "./MediaFile";

const allowedImageTypes = [".png", ".jpg", ".jpeg", ".PNG", ".JPG", ".JPEG"];

function MediaFilesContainer({
  mediaList,
  foldersList,
  activeFolder,
  handleFileRecover,
  handleMediaClick,
  handleFileFavoriteSetClick,
  handleDeleteFileClick,
  isFavorite,
  setSubMenuVisibility,
  subMenuVisible,
  handleMoveFileClick,
}) {
  const isImage = (item) =>
    allowedImageTypes.includes(`.${item.fileName.split(".").pop()}`);

  return (
    <div
      className="p-4 w-full h-fit flex justify-center items-center flex-wrap border border-spillover-color3"
      id="files-list-section"
    >
      {mediaList?.map((item) => (
        <MediaFile
          fileId={item.id}
          fileName={item?.fileName?.split(".")[0]}
          isImage={isImage(item)}
          mediaSrc={item.url}
          handleFileRecover={handleFileRecover}
          handleMediaClick={handleMediaClick}
          handleFileFavoriteSetClick={handleFileFavoriteSetClick}
          handleDeleteFileClick={handleDeleteFileClick}
          isFavorite={isFavorite}
          setSubMenuVisibility={setSubMenuVisibility}
          subMenuVisible={subMenuVisible}
          foldersList={foldersList}
          handleMoveFileClick={handleMoveFileClick}
          fileIsDeleted={false}
        />
      ))}
    </div>
  );
}

export default MediaFilesContainer;
