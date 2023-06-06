import { useEffect, useRef, useState } from "react";

import {
  ChonkyActions,
  FileBrowser,
  FileContextMenu,
  FileList,
  FileNavbar,
  FileToolbar,
} from "chonky";

import NewFolderPrompt from "./NewFolderPrompt";
import UploadArea from "./UploadArea";
import useFolder from "../../hooks/useFolder";
import useFileActions from "../../hooks/useFileActions";
import useCurrentMediaBrowser from "../../hooks/useCurrentMediaBrowser";
import useCurrentFolderId from "../../hooks/useCurrentFolderId";
import Loading from "../Loading";

function MediaBrowser() {
  const uploadAreaRef = useRef();
  const [showNewFolderPrompt, setShowNewFolderPrompt] = useState(false);
  const [mediaBrowser] = useCurrentMediaBrowser();
  const [currentFolderId, setCurrentFolderId] = useCurrentFolderId();

  const openNewFolderPrompt = () => setShowNewFolderPrompt(true);
  const closeNewFolderPrompt = () => setShowNewFolderPrompt(false);

  const { folderId, files, folderChain, loading } = useFolder();

  useEffect(() => {
    if (mediaBrowser === "account" && !currentFolderId) {
      setCurrentFolderId(folderId);
    }
  }, [currentFolderId, setCurrentFolderId, folderId, mediaBrowser]);

  const {
    fileActions,
    onFileAction,
    enableUpload,
    enableNewFolder,
  } = useFileActions({ uploadAreaRef, openNewFolderPrompt });

  return (
    <FileBrowser
      // We're creating our own DndProvider in MediaLibraryContainer
      // so we can use the hook `useDrop` in useUploadFiles.
      // SEE: https://chonky.io/docs/2.x/basics/drag-n-drop#cannot-have-two-html5-backends
      disableDragAndDropProvider
      files={files}
      folderChain={folderChain}
      onFileAction={onFileAction}
      disableDefaultFileActions={[
        ChonkyActions.ToggleHiddenFiles.id,
      ]}
      fileActions={fileActions}
    >
      <FileNavbar />
      <FileToolbar />

      {enableNewFolder && showNewFolderPrompt && <NewFolderPrompt close={closeNewFolderPrompt} />}

      {enableUpload ? (
        <UploadArea ref={uploadAreaRef}>
          {loading ? <Loading /> : <FileList />}
        </UploadArea>
      ) : (
        <>
          {loading ? <Loading /> : <FileList />}
        </>
      )}
      <FileContextMenu />
    </FileBrowser>
  );
}

export default MediaBrowser;
