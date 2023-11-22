function useRenameEntryAction(setRenamingEntry) {
  return (action) => {
    const { selectedFilesForAction } = action.state;

    if (selectedFilesForAction.length) {
      setRenamingEntry(selectedFilesForAction[0]);
    }
  };
}

export default useRenameEntryAction;
