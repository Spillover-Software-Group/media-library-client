import useOptions from "./useOptions";

function useChangeSelectionFilesAction() {
  const { handleSelected, selectOnSingleClick } = useOptions();

  // Not async: `useFileActions`' dispatcher calls this handler and discards the result, so nothing
  // ever depended on it returning a promise.
  return (action) => {
    const { selectedFiles } = action.state;

    if (selectedFiles && selectOnSingleClick) {
      handleSelected(selectedFiles);
    }
  };
}

export default useChangeSelectionFilesAction;
