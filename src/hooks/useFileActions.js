import { ChonkyActions, defineFileAction } from "chonky";

import useCurrentMediaBrowser from "./useCurrentMediaBrowser";
import useDeleteFilesAction from "./useDeleteFilesAction";
import useFavoriteFilesAction from "./useFavoriteFilesAction";
import useUnfavoriteFilesAction from "./useUnfavoriteFilesAction";
import useMoveFilesAction from "./useMoveFilesAction";
import useOpenFilesAction from "./useOpenFilesAction";
import useRestoreFilesAction from "./useRestoreFilesAction";

const favoriteFilesAction = defineFileAction({
  id: "favorite-files",
  requiresSelection: true,
  fileFilter: (file) => !file.isDir,
  button: {
    name: "Favorite",
    toolbar: false,
    contextMenu: true,
    // icon: ChonkyIconName.
  },
});

const unfavoriteFilesAction = defineFileAction({
  id: "unfavorite-files",
  requiresSelection: true,
  button: {
    name: "Unfavorite files",
    toolbar: true,
    contextMenu: true,
    // icon: ChonkyIconName.
  },
});

const restoreFilesAction = defineFileAction({
  id: "restore-files",
  requiresSelection: true,
  button: {
    name: "Restore files",
    toolbar: true,
    contextMenu: true,
    // icon: ChonkyIconName.
  },
});

const actionsByMediaBrowser = {
  account: [
    ChonkyActions.OpenFiles,
    ChonkyActions.CreateFolder,
    ChonkyActions.UploadFiles,
    ChonkyActions.DeleteFiles,
    ChonkyActions.MoveFiles,
    favoriteFilesAction,
  ],
  global: [
    ChonkyActions.OpenFiles,
  ],
  favorites: [
    ChonkyActions.OpenFiles,
    unfavoriteFilesAction,
  ],
  deleted: [
    restoreFilesAction,
  ],
};

function useMediaBrowserActions({ uploadAreaRef, openNewFolderPrompt }) {
  const [mediaBrowser] = useCurrentMediaBrowser();

  const actions = {
    [ChonkyActions.OpenFiles.id]: useOpenFilesAction(),
    [ChonkyActions.CreateFolder.id]: openNewFolderPrompt,
    [ChonkyActions.UploadFiles.id]: () => uploadAreaRef.current?.openFilePicker(),
    [ChonkyActions.DeleteFiles.id]: useDeleteFilesAction(),
    [ChonkyActions.MoveFiles.id]: useMoveFilesAction(),
    [favoriteFilesAction.id]: useFavoriteFilesAction(),
    [unfavoriteFilesAction.id]: useUnfavoriteFilesAction(),
    [restoreFilesAction.id]: useRestoreFilesAction(),
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
