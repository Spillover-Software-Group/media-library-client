import useSaveDesignToMyMedia from "./useSaveDesignToMyMedia";

function useSaveOnMyMediaAction() {
  const { saveOnMyMedia } = useSaveDesignToMyMedia();

  // Not async: `useFileActions`' dispatcher calls this handler and discards the result, so nothing
  // ever depended on it returning a promise.
  return (action) => {
    const { selectedFilesForAction } = action.state;

    if (selectedFilesForAction.length) {
      saveOnMyMedia(selectedFilesForAction[0]);
    }
  };
}

export default useSaveOnMyMediaAction;
