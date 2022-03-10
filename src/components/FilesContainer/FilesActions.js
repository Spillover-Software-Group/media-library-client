import React from "react";
import axios from "axios";

import config from "../../config";
import RegularIconTooltip from "../icons/RegularIconTooltip";
import DeleteFileConfirmationModal from "../modals/DeleteFileConfirmationModal";

function FilesActions({
  handleMediaClick,
  handleDeleteFileClick,
  handleFileFavoriteSetClick,
  fileId,
  getFilesForFolder,
  activeFolderId,
}) {
  const { baseUrl } = config;

  // TODO: Move this functions to somewhere
  const deleteFile = async (fileId) => {
    console.log("DEBUG_DELETE_FILE_WITH_ID: ", fileId);

    const deleteFileResponse = await axios.post(`${baseUrl}/delete_file`, {
      fileId,
    });

    console.log("DEBUG_FILE_DELETE_RESPONSE: ", deleteFileResponse);
    await getFilesForFolder(activeFolderId);
  };

  return (
    <ul className="flex justify-evenly items-center text-spillover-color3">
      <li className="cursor-pointer" onClick={() => handleMediaClick(mediaSrc)}>
        <RegularIconTooltip
          iconName="plus-square"
          iconStyle="fas"
          tooltip="Create Post"
          placement="top"
        />
      </li>
      <li
        className="cursor-pointer"
        onClick={() => handleFileFavoriteSetClick(fileId)}
      >
        <RegularIconTooltip
          iconName="heart"
          iconStyle="fas"
          tooltip="Favorite"
          placement="top"
        />
      </li>
      <li className="cursor-pointer">
        <RegularIconTooltip
          iconName="folder-tree"
          iconStyle="fas"
          tooltip="Move"
          placement="top"
        />

        {/* TODO: Menu to move the file to another folder */}
        {/* <div
        className="border border-yellow-700 h-10 w-10 move-file-menu file-icon-menu-item"
        onClick={() => setSubMenuVisibility(!subMenuVisible)}
        onMouseLeave={() => setSubMenuVisibility(false)}
      >
        {subMenuVisible && (
          <div className="folders-list-submenu">
            {filteredFoldersList?.map((folder) => (
              <div
                className="submenu-folders-list-item list-item-text"
                onClick={() => handleMoveFileClick(fileId, folder.id)}
              >
                {folder.folderName}
              </div>
            ))}
          </div>
        )}
      </div> */}
      </li>
      <li className="cursor-pointer">
        <RegularIconTooltip
          iconName="eye"
          iconStyle="fas"
          tooltip="Image"
          placement="top"
        />
      </li>
      <li className="cursor-pointer">
        <DeleteFileConfirmationModal deleteFile={deleteFile}>
          <RegularIconTooltip
            iconName="trash-alt"
            iconStyle="fas"
            tooltip="Delete"
            placement="top"
          />
        </DeleteFileConfirmationModal>
      </li>

      {/* TODO: recover functionality */}
      {/*       
        {fileIsDeleted && (
              <div
                className="fa fa-undo restore-file file-icon-menu-item"
                onClick={() => handleFileRecover(fileId)}
              />) */}
    </ul>
  );
}

export default FilesActions;
