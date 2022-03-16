import React, { useState } from "react";
import axios from "axios";

import config from "../../config";
import RegularIcon from "../icons/RegularIcon";
import DeleteFolderAndFilesModal from "../modals/DeleteFolderAndFilesModal";

function Folder({
  folder,
  setActiveFolderId,
  activeFolderId,
  getFoldersList,
  userId,
}) {
  const { baseUrl } = config;

  const [isOpen, setIsOpen] = useState(false);

  const deleteFolder = async (folderId) => {
    const filesFromFolder = await axios.get(`${baseUrl}/${folderId}/files`, {
      params: { userId },
    });

    const folderNotEmpty = !!filesFromFolder?.data?.length;

    if (folderNotEmpty) {
      setIsOpen(true);
    } else {
      const removeFolderResponse = await axios.post(
        `${baseUrl}/delete_folder`,
        {
          folderId,
        }
      );

      if (removeFolderResponse && removeFolderResponse.status === 200) {
        getFoldersList();
      }
    }
  };

  const deleteFolderWithFilesInside = async (folderId) => {
    const filesFromFolder = await axios.get(`${baseUrl}/${folderId}/files`, {
      params: { userId },
    });

    const filesToDelete = filesFromFolder?.data;

    for (let i = 0; i < filesToDelete.length; i++) {
      const file = filesToDelete[i];
      deleteFile(file.id);
      if (i === filesToDelete.length - 1) {
        await deleteFolder(folderId);
      }
    }
    setIsOpen(false);
  };

  // TODO: This function is repeated in the FilesAction.js component, needs to move somewhere else
  const deleteFile = async (fileId) => {
    console.log("DEBUG_DELETE_FILE_WITH_ID: ", fileId);

    const deleteFileResponse = await axios.post(`${baseUrl}/delete_file`, {
      fileId,
    });

    console.log("DEBUG_FILE_DELETE_RESPONSE: ", deleteFileResponse);
    // NOTE: there is no more getFilesForFolder function, it is the hook useFetchFilesForFolder
    // await getFilesForFolder(activeFolderId);
  };

  return (
    <>
      <div
        className={`${
          activeFolderId === folder.id
            ? "text-spillover-color11 font-bold"
            : "text-spillover-color10 font-medium"
        } py-1 px-4 text-sm flex justify-between items-center cursor-pointer`}
      >
        <div
          className="flex items-center w-full"
          onClick={() => setActiveFolderId(folder.id)}
        >
          <RegularIcon
            name={activeFolderId === folder.id ? "folder-open" : "folder"}
            iconStyle="fas"
            className="mr-2 text-xl"
          />
          <span>{folder.folderName}</span>
        </div>
        {folder.businessId !== "TEST_SPILLOVER_ID" && (
          <span onClick={() => deleteFolder(folder.id)}>
            <RegularIcon
              name="trash-alt"
              iconStyle="fas"
              className="text-spillover-color4 hover:text-spillover-color4"
            />
          </span>
        )}
      </div>
      <DeleteFolderAndFilesModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        deleteFolderWithFilesInside={() =>
          deleteFolderWithFilesInside(folder.id)
        }
      />
    </>
  );
}

export default Folder;
