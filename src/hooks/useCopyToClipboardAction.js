import { toast } from "react-toastify";

function useCopyToClipboardAction() {
  return (action) => {
    const { selectedFilesForAction } = action.state;
    navigator.clipboard.writeText(selectedFilesForAction[0]?.url);

    toast.success("Link copied to the clipboard!");
  };
}

export default useCopyToClipboardAction;
