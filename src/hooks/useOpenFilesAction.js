import useCurrentFolderId from './useCurrentFolderId';
import useOptions from './useOptions';

function useOpenFilesAction() {
  const {
    handleSelected,
    maxSelectableFiles,
  } = useOptions();

  const [, setCurrentFolderId] = useCurrentFolderId();

  return async (action) => {
    const { targetFile, files: filesToOpen } = action.payload;
    const fileToOpen = targetFile ?? filesToOpen[0];

    if (filesToOpen.length === 1 && !fileToOpen.isDir) {
      handleSelected([fileToOpen]);
    } else if (filesToOpen.length > 1 && filesToOpen.every((f) => !f.isDir)) {
      handleSelected(filesToOpen.slice(0, maxSelectableFiles || 50));
    } else if (filesToOpen.length === 1 && fileToOpen.isDir) {
      setCurrentFolderId(fileToOpen.id);
    }
  };
}

export default useOpenFilesAction;
