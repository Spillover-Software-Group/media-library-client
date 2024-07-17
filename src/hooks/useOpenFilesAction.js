import { useEffect } from "react";
import useSaveDesignToMyMedia from "./integrations/canva/useSaveDesignToMyMedia";
import useCurrentFolderId from "./useCurrentFolderId";
import useOptions from "./useOptions";

function useOpenFilesAction() {
  const { handleSelected, maxSelectableFiles } = useOptions();
  const { mediaLibraryFile, saveOnMyMedia } = useSaveDesignToMyMedia();

  const [, setCurrentFolderId] = useCurrentFolderId();

  useEffect(() => {
    if (mediaLibraryFile) {
      handleSelected([mediaLibraryFile]);
    }
  }, [mediaLibraryFile]);

  return async (action) => {
    const { targetFile, files: filesToOpen } = action.payload;
    const fileToOpen = targetFile ?? filesToOpen[0];

    if (filesToOpen.length === 1 && !fileToOpen.isDir && fileToOpen?.editUrl) {
      // If the file has editUrl, means it is a canva design
      // save the design to My Media folder and select the Media Library file
      saveOnMyMedia(fileToOpen);
    } else if (filesToOpen.length === 1 && !fileToOpen.isDir) {
      handleSelected([fileToOpen]);
    } else if (filesToOpen.length > 1 && filesToOpen.every((f) => !f.isDir)) {
      handleSelected(filesToOpen.slice(0, maxSelectableFiles || 50));
    } else if (filesToOpen.length === 1 && fileToOpen.isDir) {
      setCurrentFolderId(fileToOpen.id);
    }
  };
}

export default useOpenFilesAction;
