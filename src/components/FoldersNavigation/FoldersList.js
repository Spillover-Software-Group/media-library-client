import React from "react";

import Folder from "./Folder";

function FoldersList({
  foldersList,
  setActiveFolderId,
  activeFolderId,
  getFoldersList,
  userId,
}) {
  return (
    <>
      {foldersList.map((folder, i) => (
        <li key={`folder-item-row-${i}`} id={`folder-item-row-${i}`}>
          <Folder
            folder={folder}
            setActiveFolderId={setActiveFolderId}
            activeFolderId={activeFolderId}
            getFoldersList={getFoldersList}
            userId={userId}
          />
        </li>
      ))}
    </>
  );
}

export default FoldersList;
