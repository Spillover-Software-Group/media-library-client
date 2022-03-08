import React from "react";
import RegularIcon from "./icons/RegularIcon";

function MediaFile({
  fileId,
  fileName,
  isImage,
  mediaSrc,
  fileIsDeleted,
  handleFileRecover,
  handleMediaClick,
  handleFileFavoriteSetClick,
  isFavorite,
  setSubMenuVisibility,
  subMenuVisible,
  filteredFoldersList,
  handleMoveFileClick,
}) {
  return (
    <div
      className="border border-spillover-color7 flex flex-col justify-between rounded-2xl w-64 sm:w-36 md:w-60 h-52 m-2 pb-2"
      id={`file-template-${fileId}`}
      key={`file-template-key-${fileId}`}
    >
      <div>
        {isImage ? (
          // <img src={mediaSrc} alt="some media file" className="object-fill p-4" />
          <img
            src="https://images.unsplash.com/photo-1646697525966-50a59fa433dc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
            alt="some media file"
            className="object-cover h-40 w-full rounded-tl-2xl rounded-tr-2xl"
          />
        ) : (
          <video className="p-4" controls width="320" height="240">
            <source src={mediaSrc} />
          </video>
        )}

        {/* <div className="media-preview-menu-item">
          <div className="media-menu-actions-list">
            {fileIsDeleted ? (
              <div
                className="fa fa-undo restore-file file-icon-menu-item"
                onClick={() => handleFileRecover(fileId)}
              />
            ) : (
              <>
                <div
                  className="fa fa-plus add-file-icon file-icon-menu-item"
                  onClick={() => handleMediaClick(mediaSrc)}
                />
                <div
                  className={`fa fa-heart${
                    isFavorite ? "" : "-o"
                  } favorite-icon file-icon-menu-item border border-red-400`}
                  onClick={() => handleFileFavoriteSetClick(fileId)}
                />
                <div
                  className="fa fa-trash delete-file file-icon-menu-item"
                  onClick={() => handleDeleteFileClick(fileId)}
                />
                <div
                  className="fa fa-folder move-file-menu file-icon-menu-item"
                  onClick={() => setSubMenuVisibility(!subMenuVisible)}
                  onMouseLeave={() => setSubMenuVisibility(false)}
                >
                  {subMenuVisible && (
                    <div className="folders-list-submenu">
                      {filteredFoldersList.map((folder) => (
                        <div
                          className="submenu-folders-list-item list-item-text"
                          onClick={() => handleMoveFileClick(fileId, folder.id)}
                        >
                          {folder.folderName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div> */}
      </div>
      <div className="px-4">
        <span className="flex items-center text-xs">
          <RegularIcon
            name={isImage ? "file-image" : "file-video"}
            className={`${
              isImage ? "text-spillover-color4" : "text-spillover-color2"
            } mr-2 text-xl`}
          />
          {/* TODO: If more than X characters, slice and ... */}
          {fileName.slice(0, 20)}...
        </span>
      </div>
    </div>
  );
}

export default MediaFile;
