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
        activeFolder === folder.id
          ? "text-spillover-color11 font-bold"
          : "text-white font-medium"
      } py-1 px-4 text-sm  flex justify-between items-center cursor-pointer`}
    >
      <div
        className="flex items-center"
        onClick={() => setActiveFolder(folder.id)}
      >
        <RegularIcon
          name={activeFolder === folder.id ? "folder-open" : "folder"}
          iconStyle="fas"
          className="mr-2 text-xl"
        />
        <span>{folder.folderName}</span>
      </div>

      {folder.businessId === "TEST_SPILLOVER_ID" ? null : (
        <span onClick={() => handleFolderRemoveClick(folder.id)}>
          <RegularIcon
            name="trash-alt"
            iconStyle="fas"
            className="text-spillover-color4 hover:text-spillover-color4"
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
