// Stores the design as the host would get it on opening (asking when it takes both), so a design
// saved here and picked later from My Media is already what the form takes.
function useSaveOnMyMediaAction(exportDesign) {
  // Not async: `useFileActions`' dispatcher calls this handler and discards the result, so nothing
  // ever depended on it returning a promise.
  return (action) => {
    const { selectedFilesForAction } = action.state;

    if (selectedFilesForAction.length) {
      exportDesign(selectedFilesForAction[0], { handsOver: false });
    }
  };
}

export default useSaveOnMyMediaAction;
