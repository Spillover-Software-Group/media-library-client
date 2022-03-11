import React from "react";

import CreateFolderButton from "../buttons/CreateFolderButton";
import NewFolderModal from "../modals/NewFolderModal";
import FoldersList from "./FoldersList";

function FoldersNavigation({
  handleFolderAddNewClick,
  foldersList,
  setActiveFolderId,
  activeFolderId,
  getFoldersList,
  selectedBusiness,
  getFilesForFolder,
  userId,
}) {
  return (
    <div className="w-72 bg-gray-50">
      <p className="border-b border-spillover-color3 my-2 p-3 font-bold flex items-center justify-between text-spillover-color2">
        <span className="uppercase">Media Library</span>
      </p>
      <div className="ml-2 mt-6">
        <span onClick={handleFolderAddNewClick}>
          <NewFolderModal
            selectedBusiness={selectedBusiness}
            getFoldersList={getFoldersList}
          >
            <CreateFolderButton />
          </NewFolderModal>
        </span>
      </div>
      <div>
        <h5 className="px-4 py-3 mt-2 font-medium text-sm">Folders</h5>
        <ul>
          <FoldersList
            foldersList={foldersList}
            setActiveFolderId={setActiveFolderId}
            activeFolderId={activeFolderId}
            getFoldersList={getFoldersList}
            getFilesForFolder={getFilesForFolder}
            userId={userId}
          />
        </ul>
      </div>
    </div>
  );
}

export default FoldersNavigation;
