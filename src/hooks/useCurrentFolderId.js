import { useReactiveVar } from "@apollo/client";

import { currentFolderIdVar } from "../cache";

function useCurrentFolderId() {
  const currentFolderId = useReactiveVar(currentFolderIdVar);

  const setCurrentFolderId = (folderId) => {
    let id = folderId;

    if (folderId?.includes("/trash_bin")) {
      id = null;
    }

    currentFolderIdVar(id);
  };

  return [
    currentFolderId,
    setCurrentFolderId,
  ];
}

export default useCurrentFolderId;
