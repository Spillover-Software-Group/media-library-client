import useHandOverFiles from "./useHandOverFiles";
import useOptions from "./useOptions";

function useChangeSelectionFilesAction() {
  const { selectOnSingleClick } = useOptions();
  const handOver = useHandOverFiles();

  // Not async: `useFileActions`' dispatcher calls this handler and discards the result, so nothing
  // ever depended on it returning a promise.
  return (action) => {
    const { selectedFiles } = action.state;

    if (selectedFiles && selectOnSingleClick) {
      handOver(selectedFiles);
    }
  };
}

export default useChangeSelectionFilesAction;
