import React from "react";

import Folder from "./Folder";

function FoldersList({
  foldersList,
  setActiveFolderId,
  handleFolderRemoveClick,
  activeFolderId,
  mediaList,
  getFoldersList,
  getFilesForFolder,
  userId,
}) {
  return (
    <>
      {foldersList.map((folder, i) => (
        <li key={`folder-item-row-${i}`} id={`folder-item-row-${i}`}>
          <Folder
            folder={folder}
            setActiveFolderId={setActiveFolderId}
            handleFolderRemoveClick={handleFolderRemoveClick}
            activeFolderId={activeFolderId}
            mediaList={mediaList}
            getFoldersList={getFoldersList}
            getFilesForFolder={getFilesForFolder}
            userId={userId}
          />
        </li>
      ))}
    </>
  );
}

export default FoldersList;
