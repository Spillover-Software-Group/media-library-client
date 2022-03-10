import React from "react";

import Folder from "./Folder";

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
