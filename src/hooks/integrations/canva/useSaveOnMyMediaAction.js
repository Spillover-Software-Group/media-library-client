import useSaveDesignToMyMedia from "./useSaveDesignToMyMedia";

function useSaveOnMyMediaAction() {
  const { saveOnMyMedia } = useSaveDesignToMyMedia();

  return async (action) => {
    const { selectedFilesForAction } = action.state;

    if (selectedFilesForAction.length) {
      saveOnMyMedia(selectedFilesForAction[0]);
    }
  };
}

export default useSaveOnMyMediaAction;
