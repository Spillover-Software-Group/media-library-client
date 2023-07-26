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
import GenerateImage from "./GenerateImage";
import UploadArea from "./UploadArea";
import useFolder from "../../hooks/useFolder";
import useFileActions from "../../hooks/useFileActions";
import useCurrentMediaBrowser from "../../hooks/useCurrentMediaBrowser";
import useCurrentFolderId from "../../hooks/useCurrentFolderId";
import Loading from "../Loading";

function MediaBrowser() {
  const uploadAreaRef = useRef();
  const [showNewFolderPrompt, setShowNewFolderPrompt] = useState(false);
  const [showGenerateImage, setShowGenerateImage] = useState(false);
  const [mediaBrowser] = useCurrentMediaBrowser();
  const [currentFolderId, setCurrentFolderId] = useCurrentFolderId();
  const [showLoading, setShowLoading] = useState(false);

  const openNewFolderPrompt = () => setShowNewFolderPrompt(true);
  const closeNewFolderPrompt = () => setShowNewFolderPrompt(false);
  const openGenerateImage = () => setShowGenerateImage(true);
  const closeGenerateImage = () => setShowGenerateImage(false);

  const { folderId, files, folderChain, loading } = useFolder();

  useEffect(() => {
    if (mediaBrowser === "account" && !currentFolderId) {
      setCurrentFolderId(folderId);
    }
  }, [currentFolderId, setCurrentFolderId, folderId, mediaBrowser]);

  useEffect(() => {
    if (currentFolderId && folderId) {
      if (currentFolderId !== folderId) {
        setShowLoading(true);
      } else if (currentFolderId === folderId) {
        setShowLoading(false);
      }
    }
  }, [currentFolderId, folderId]);

  const {
    fileActions,
    onFileAction,
    enableUpload,
    enableNewFolder,
  } = useFileActions({ uploadAreaRef, openNewFolderPrompt, openGenerateImage });

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
      {showGenerateImage && (
        <div className="sml-p-2 sml-border-b" style={{marginRight: "-8px", marginLeft: "-8px"}}>
          <GenerateImage close={closeGenerateImage} />
        </div>
      )}

      {enableUpload ? (
        <UploadArea ref={uploadAreaRef}>
          {loading || showLoading ? <Loading /> : <FileList />}
        </UploadArea>
      ) : (
        <>
          {loading || showLoading  ? <Loading /> : <FileList />}
        </>
      )}
      <FileContextMenu />
    </FileBrowser>
  );
}

export default MediaBrowser;
