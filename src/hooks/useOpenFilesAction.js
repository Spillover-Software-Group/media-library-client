import useCurrentFolderId from "./useCurrentFolderId";
import useHandOverFiles from "./useHandOverFiles";

// Opening is how most files reach the host, so it goes through the same check as a selection:
// chonky opens a file the host's rules made unselectable.
function useOpenFilesAction(exportDesign) {
  const handOver = useHandOverFiles();

  const [, setCurrentFolderId] = useCurrentFolderId();

  // Not async: `useFileActions`' dispatcher calls this handler and discards the result, so nothing
  // ever depended on it returning a promise.
  return (action) => {
    const { targetFile, files: filesToOpen } = action.payload;
    const fileToOpen = targetFile ?? filesToOpen[0];

    if (filesToOpen.length === 1 && !fileToOpen.isDir && fileToOpen?.editUrl) {
      // A file with an editUrl is a Canva design: it is stored in My Media first, as what the host
      // takes, and the stored file is what the host gets.
      exportDesign(fileToOpen, { handsOver: true });
    } else if (filesToOpen.length === 1 && !fileToOpen.isDir) {
      handOver([fileToOpen]);
    } else if (filesToOpen.length > 1 && filesToOpen.every((f) => !f.isDir)) {
      handOver(filesToOpen, { capped: true });
    } else if (filesToOpen.length === 1 && fileToOpen.isDir) {
      setCurrentFolderId(fileToOpen.id);
    }
  };
}

export default useOpenFilesAction;
