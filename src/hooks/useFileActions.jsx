import { ChonkyActions, defineFileAction } from "chonky";
import useOpenOnCanvaAction from "./integrations/canva/useOpenOnCanvaAction";
import useSaveOnMyMediaAction from "./integrations/canva/useSaveOnMyMediaAction";
import useAccounts from "./useAccounts";
import useChangeSelectionFilesAction from "./useChangeSelectionFilesAction";
import useCopyToClipboardAction from "./useCopyToClipboardAction";
import useCurrentMediaBrowser from "./useCurrentMediaBrowser";
import useDeleteFilesAction from "./useDeleteFilesAction";
import useFavoriteFilesAction from "./useFavoriteFilesAction";
import useMoveFilesAction from "./useMoveFilesAction";
import useOpenFilesAction from "./useOpenFilesAction";
import useRefreshFolder from "./useRefreshFolder";
import useRenameEntryAction from "./useRenameEntryAction";
import useRestoreFilesAction from "./useRestoreFilesAction";
import useUnfavoriteFilesAction from "./useUnfavoriteFilesAction";

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

const refreshFolderAction = defineFileAction({
  id: "refresh-folder-action",
  requiresSelection: false,
  button: {
    name: "Refresh folder",
    toolbar: true,
    contextMenu: false,
    icon: "syncFolder",
  },
});

const openInCanvaAction = defineFileAction({
  id: "open-in-Canva",
  requiresSelection: true,
  fileFilter: (file) => !file.isDir,
  button: {
    name: "Open in Canva",
    toolbar: false,
    contextMenu: true,
    icon: "symlink",
  },
});

const copyLinkToClipboardAction = defineFileAction({
  id: "copy-link-to-clipboard",
  requiresSelection: true,
  fileFilter: (file) => !file.isDir,
  button: {
    name: "Copy link",
    toolbar: false,
    contextMenu: true,
    icon: "copy",
  },
});

const saveOnMyMedia = defineFileAction({
  id: "save-on-my-media",
  requiresSelection: true,
  fileFilter: (file) => !file.isDir,
  button: {
    name: "Save on my media",
    toolbar: false,
    contextMenu: true,
    icon: "upload",
  },
});

function useMediaBrowserActions({
  uploadAreaRef,
  openNewFolderPrompt,
  setRenamingEntry,
  openGenerateImage,
  canManage,
}) {
  const [mediaBrowser] = useCurrentMediaBrowser();
  const { currentAccount, loading } = useAccounts();
  const canvaIsConnected =
    !loading && currentAccount?.integrations?.canva?.userDisplayName;

  let actionsByMediaBrowser = {
    account: [
      ChonkyActions.OpenFiles,
      ChonkyActions.CreateFolder,
      ChonkyActions.UploadFiles,
      openGenerateImageAction,
      refreshFolderAction,
      openRenameEntryAction,
      ChonkyActions.DeleteFiles,
      ChonkyActions.MoveFiles,
      favoriteFilesAction,
      copyLinkToClipboardAction,
    ],
    // Stock curators (canManage from the globalFolder query) get the write
    // actions; favorites and image generation stay out because both target
    // the viewer's own account, not the stock library.
    global: canManage
      ? [
          ChonkyActions.OpenFiles,
          ChonkyActions.CreateFolder,
          ChonkyActions.UploadFiles,
          refreshFolderAction,
          openRenameEntryAction,
          ChonkyActions.DeleteFiles,
          ChonkyActions.MoveFiles,
          copyLinkToClipboardAction,
        ]
      : [ChonkyActions.OpenFiles],
    favorites: [ChonkyActions.OpenFiles, unfavoriteFilesAction],
    deleted: [restoreFilesAction],
  };

  const actions = {
    [ChonkyActions.OpenFiles.id]: useOpenFilesAction(),
    [ChonkyActions.CreateFolder.id]: openNewFolderPrompt,
    [ChonkyActions.UploadFiles.id]: () =>
      uploadAreaRef.current?.openFilePicker(),
    [ChonkyActions.DeleteFiles.id]: useDeleteFilesAction(),
    [ChonkyActions.MoveFiles.id]: useMoveFilesAction(),
    [favoriteFilesAction.id]: useFavoriteFilesAction(),
    [unfavoriteFilesAction.id]: useUnfavoriteFilesAction(),
    [restoreFilesAction.id]: useRestoreFilesAction(),
    [ChonkyActions.ChangeSelection.id]: useChangeSelectionFilesAction(),
    [openGenerateImageAction.id]: openGenerateImage,
    [refreshFolderAction.id]: useRefreshFolder(),
    [openRenameEntryAction.id]: useRenameEntryAction(setRenamingEntry),
    [openInCanvaAction.id]: useOpenOnCanvaAction(),
    [copyLinkToClipboardAction.id]: useCopyToClipboardAction(),
    [saveOnMyMedia.id]: useSaveOnMyMediaAction(),
  };

  // Canva Actions
  if (canvaIsConnected) {
    actionsByMediaBrowser = {
      ...actionsByMediaBrowser,
      account: [...actionsByMediaBrowser.account, openInCanvaAction],
      global: [...actionsByMediaBrowser.global, openInCanvaAction],
      favorites: [...actionsByMediaBrowser.favorites, openInCanvaAction],
      canva: [openInCanvaAction, saveOnMyMedia],
    };
  }

  const fileActions = actionsByMediaBrowser[mediaBrowser];

  const onFileAction = (action) => {
    const actionHandler = actions[action.id];
    if (!actionHandler) return;

    actionHandler(action);
  };

  const managedGlobal = mediaBrowser === "global" && Boolean(canManage);
  const enableUpload = mediaBrowser === "account" || managedGlobal;
  const enableNewFolder = mediaBrowser === "account" || managedGlobal;

  return {
    fileActions,
    onFileAction,
    enableUpload,
    enableNewFolder,
  };
}

export default useMediaBrowserActions;
