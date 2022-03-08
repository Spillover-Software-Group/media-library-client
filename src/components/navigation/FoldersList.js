import React from "react";
import RegularIcon from "../icons/RegularIcon";

function Folder({
  folder,
  setActiveFolder,
  handleFolderRemoveClick,
  activeFolder,
}) {
  return (
    <div
      className={`${
        activeFolder === folder.id && "bg-spillover-color11"
      } border border-blue-800 text-white p-2 text-sm font-medium flex justify-between items-center cursor-pointer`}
    >
      <div
        className="flex items-center"
        onClick={() => setActiveFolder(folder.id)}
      >
        <RegularIcon name="folder" iconStyle="fas" className="mr-2 text-xl" />
        <span>{folder.folderName}</span>
      </div>

      {folder.businessId === "TEST_SPILLOVER_ID" ? null : (
        <span
          key={`folder-remove-btn-${i}`}
          className="folder-remove-icon border border-blue-600"
          onClick={() => handleFolderRemoveClick(folder.id)}
        >
          <RegularIcon
            name="trash"
            iconStyle="fas"
            className="text-spillover-color4 hover:text-spillover-color2"
          />
        </span>
      )}
    </div>
  );
}

function FoldersList({
  foldersList,
  setActiveFolder,
  handleFolderRemoveClick,
  activeFolder,
}) {
  return (
    <>
      {foldersList.map((folder, i) => (
        <li key={`folder-item-row-${i}`} id={`folder-item-row-${i}`}>
          <Folder
            folder={folder}
            setActiveFolder={setActiveFolder}
            handleFolderRemoveClick={handleFolderRemoveClick}
            activeFolder={activeFolder}
          />
        </li>
      ))}
    </>
  );
}

export default FoldersList;
