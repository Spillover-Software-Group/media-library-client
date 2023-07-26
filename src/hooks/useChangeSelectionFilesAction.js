import useOptions from "./useOptions";

function useChangeSelectionFilesAction() {
  const {
    handleSelected,
    selectOnSingleClick
  } = useOptions();

  return async (action) => {
    const { selectedFiles } = action.state;

    if (selectedFiles && selectOnSingleClick) {
      handleSelected(selectedFiles)
    }
  }
};

export default useChangeSelectionFilesAction;
