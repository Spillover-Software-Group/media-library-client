import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

import config from "../../config";
import RegularIconTooltip from "../icons/RegularIconTooltip";
import DeleteFileConfirmationModal from "../modals/DeleteFileConfirmationModal";
import MoveFileToFolder from "./MoveFileToFolder";
import ShowImageModal from "../modals/ShowImageModal";

function FilesActions({
  fileId,
  getFilesForFolder,
  activeFolderId,
  userId,
  mediaSrc,
  foldersList,
  setPageNum,
  refetch,
}) {
  const { baseUrl } = config;

  // TODO: This function is repeated in the Folder.js component, needs to move somewhere else
  const deleteFile = async (fileId) => {
    console.log("DEBUG_DELETE_FILE_WITH_ID: ", fileId);

    const deleteFileResponse = await axios.post(`${baseUrl}/delete_file`, {
      fileId,
    });

    console.log("DEBUG_FILE_DELETE_RESPONSE: ", deleteFileResponse);
    await getFilesForFolder(activeFolderId);
  };

  // TODO: Fix the error on the API side when fav.
  const setFavoriteForCurrentUser = async () => {
    const newFavorite = {
      fileId,
      userId,
    };

    const newFavoriteResponse = await axios.post(`${baseUrl}/favorites_add`, {
      newFavorite,
    });
    console.log("DEBUG_NEW_FAVOURITE_RESPONSE: ", newFavoriteResponse);
  };

  // TODO: Not sure about what the handleSelected should does
  const handleMediaClick = (mediaSrc) => {
    console.log("DEBUG_file: ", mediaSrc);
    // handleSelected(mediaSrc);
  };

  const moveFile = async (fileId, newFolderId) => {
    console.log(`DEBUG: Moving file ${fileId} to folder ${newFolderId}`);

    toast.promise(
      fetch(`${baseUrl}/update_file/${fileId}`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updatedFields: { folderId: newFolderId } }),
      })
        .then(() => refetch({}))
        .then(() => setPageNum(1)),
      {
        pending: "Moving file...",
        success: "Moved Susscesfully.",
        error: "Something went wrong!",
      }
    );
  };

  return (
    <ul className="flex justify-evenly items-center">
      <li className="cursor-pointer" onClick={() => handleMediaClick(mediaSrc)}>
        <RegularIconTooltip
          iconName="plus-square"
          iconStyle="fas"
          tooltip="Create Post"
          placement="top"
        />
      </li>
      <li className="cursor-pointer" onClick={setFavoriteForCurrentUser}>
        <RegularIconTooltip
          iconName="heart"
          iconStyle="fas"
          tooltip="Favorite"
          placement="top"
        />
      </li>
      <li className="cursor-pointer">
        <MoveFileToFolder
          foldersList={foldersList}
          activeFolderId={activeFolderId}
          fileId={fileId}
          moveFile={moveFile}
        />
      </li>
      <li className="cursor-pointer">
        <ShowImageModal mediaSrc={mediaSrc}>
          <RegularIconTooltip
            iconName="eye"
            iconStyle="fas"
            tooltip="Image"
            placement="top"
          />
        </ShowImageModal>
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
