import React from "react";
import RegularIcon from "../icons/RegularIcon";
import FoldersList from "./FoldersList";

function FoldersNavigation({
  handleFolderAddNewClick,
  handleFolderRemoveClick,
  folderNameList,
  foldersList,
  setActiveFolder,
  activeFolder,
}) {
  return (
    <div className="w-72 bg-spillover-color10" id="folder-list-section">
      <p className="border-b border-spillover-color7 my-2 p-2 font-bold flex items-center justify-between text-white">
        <span>Folder</span>
        <span onClick={handleFolderAddNewClick}>
          <RegularIcon
            name="folder-plus"
            iconStyle="fas"
            className="text-spillover-color11 hover:text-white cursor-pointer text-2xl mr-2"
          />
        </span>
      </p>
      <ul>
        <FoldersList
          foldersList={foldersList}
          setActiveFolder={setActiveFolder}
          activeFolder={activeFolder}
          handleFolderRemoveClick={handleFolderRemoveClick}
        />
      </ul>
    </div>
  );
}

export default FoldersNavigation;
