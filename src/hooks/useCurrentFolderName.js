import { useReactiveVar } from "@apollo/client";

import { currentFolderNameVar } from "../cache";

function useCurrentFolderName() {
  const currentFolderName = useReactiveVar(currentFolderNameVar);

  const setCurrentForlderName = (folderName) => {
    currentFolderNameVar(folderName);
  };

  return [currentFolderName, setCurrentForlderName];
}

export default useCurrentFolderName;
