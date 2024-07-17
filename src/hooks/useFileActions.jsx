import { ChonkyActions, defineFileAction } from "chonky";

import useCurrentMediaBrowser from "./useCurrentMediaBrowser";
import useDeleteFilesAction from "./useDeleteFilesAction";
import useFavoriteFilesAction from "./useFavoriteFilesAction";
import useUnfavoriteFilesAction from "./useUnfavoriteFilesAction";
import useMoveFilesAction from "./useMoveFilesAction";
import useOpenFilesAction from "./useOpenFilesAction";
import useRestoreFilesAction from "./useRestoreFilesAction";
import useChangeSelectionFilesAction from "./useChangeSelectionFilesAction";
import useRenameEntryAction from "./useRenameEntryAction";
import useOpenOnCanvaAction from "./integrations/canva/useOpenOnCanvaAction";
import useSaveOnMyMediaAction from "./integrations/canva/useSaveOnMyMediaAction";

const openRenameEntryAction = defineFileAction({
  id: "rename-entry",
  requiresSelection: true,
  button: {
    name: "Rename",
    toolbar: false,
    contextMenu: true,
    icon: "terminal",
  },
});

const favoriteFilesAction = defineFileAction({
  id: "favorite-files",
  requiresSelection: true,
  fileFilter: (file) => !file.isDir,
  button: {
    name: "Favorite",
    toolbar: false,
    contextMenu: true,
    icon: "favorite",
  },
});

const unfavoriteFilesAction = defineFileAction({
  id: "unfavorite-files",
  requiresSelection: true,
  button: {
    name: "Unfavorite files",
    toolbar: true,
    contextMenu: true,
    icon: "unfavorite",
  },
});

const restoreFilesAction = defineFileAction({
  id: "restore-files",
  requiresSelection: true,
  button: {
    name: "Restore files",
    toolbar: true,
    contextMenu: true,
    icon: "restore",
  },
});

const openGenerateImageAction = defineFileAction({
  id: "open-generate-image",
  requiresSelection: false,
  button: {
    name: "Generate image",
    toolbar: true,
    contextMenu: false,
    icon: "generateImage",
  },
});

const openInCanvaAction = defineFileAction({
  id: "open-in-Canva",
  requiresSelection: true,
  fileFilter: (file) => !file.isDir,
  button: {
    name: "Open In Canva",
    toolbar: false,
    contextMenu: true,
    icon: "symlink",
  },
});

const saveOnMyMedia = defineFileAction({
  id: "save-on-my-media",
  requiresSelection: true,
  fileFilter: (file) => !file.isDir,
  button: {
    name: "Save on My Media",
    toolbar: false,
    contextMenu: true,
    icon: "upload",
  },
});

const actionsByMediaBrowser = {
  account: [
    ChonkyActions.OpenFiles,
    ChonkyActions.CreateFolder,
    ChonkyActions.UploadFiles,
    openGenerateImageAction,
    openRenameEntryAction,
    ChonkyActions.DeleteFiles,
    ChonkyActions.MoveFiles,
    favoriteFilesAction,
    openInCanvaAction,
  ],
  global: [ChonkyActions.OpenFiles],
  favorites: [ChonkyActions.OpenFiles, unfavoriteFilesAction],
  deleted: [restoreFilesAction],
  canva: [openInCanvaAction, saveOnMyMedia],
};

function useMediaBrowserActions({
  uploadAreaRef,
  openNewFolderPrompt,
  setRenamingEntry,
  openGenerateImage,
}) {
  const [mediaBrowser] = useCurrentMediaBrowser();

  let actions = {
    [ChonkyActions.OpenFiles.id]: useOpenFilesAction(),
    [ChonkyActions.CreateFolder.id]: openNewFolderPrompt,
    [ChonkyActions.UploadFiles.id]: () =>
      uploadAreaRef.current?.openFilePicker(),
    [ChonkyActions.DeleteFiles.id]: useDeleteFilesAction(),
    [ChonkyActions.MoveFiles.id]: useMoveFilesAction(),
    [favoriteFilesAction.id]: useFavoriteFilesAction(),
    [openInCanvaAction.id]: useOpenOnCanvaAction(),
    [saveOnMyMedia.id]: useSaveOnMyMediaAction(),
    [unfavoriteFilesAction.id]: useUnfavoriteFilesAction(),
    [restoreFilesAction.id]: useRestoreFilesAction(),
    [ChonkyActions.ChangeSelection.id]: useChangeSelectionFilesAction(),
    [openGenerateImageAction.id]: openGenerateImage,
    [openRenameEntryAction.id]: useRenameEntryAction(setRenamingEntry),
  };

  const fileActions = actionsByMediaBrowser[mediaBrowser];

  const onFileAction = (action) => {
    const actionHandler = actions[action.id];
    if (!actionHandler) return;

    actionHandler(action);
  };

  const enableUpload = mediaBrowser === "account";
  const enableNewFolder = mediaBrowser === "account";

  return {
    fileActions,
    onFileAction,
    enableUpload,
    enableNewFolder,
  };
}

export default useMediaBrowserActions;
