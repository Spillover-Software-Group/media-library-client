import {
  ChonkyActions,
  FileBrowser,
  FileContextMenu,
  FileList,
  FileNavbar,
  FileToolbar,
} from "chonky";
import { useEffect, useRef, useState } from "react";
import useCurrentFolderId from "../../hooks/useCurrentFolderId";
import useCurrentFolderName from "../../hooks/useCurrentFolderName";
import useCurrentMediaBrowser from "../../hooks/useCurrentMediaBrowser";
import useFileActions from "../../hooks/useFileActions";
import useFolder from "../../hooks/useFolder";
import useOptions from "../../hooks/useOptions";
import Loading from "../Loading";
import GenerateImage from "./GenerateImage";
import NewFolderPrompt from "./NewFolderPrompt";
import RenameEntry from "./RenameEntry";
import UploadArea from "./UploadArea";

const currentFilesIsEqualFiles = (files, currentFiles) => {
  if (!files || !currentFiles) return true;

  if (files.length !== currentFiles.length) return false;
  return files.every(
    (obj, index) => JSON.stringify(obj) === JSON.stringify(currentFiles[index]),
  );
};

function MediaBrowser() {
  const uploadAreaRef = useRef();
  const [showNewFolderPrompt, setShowNewFolderPrompt] = useState(false);
  const [showGenerateImage, setShowGenerateImage] = useState(false);
  const [renamingEntry, setRenamingEntry] = useState(null);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useCurrentFolderId();
  const [currentFolderName, setCurrentFolderName] = useCurrentFolderName();
  const [showLoading, setShowLoading] = useState(false);

  const [mediaBrowser] = useCurrentMediaBrowser();
  const { handleSelected } = useOptions();

  const openNewFolderPrompt = () => setShowNewFolderPrompt(true);
  const closeNewFolderPrompt = () => setShowNewFolderPrompt(false);
  const openGenerateImage = () => setShowGenerateImage(true);
  const closeGenerateImage = () => setShowGenerateImage(false);
  const closeRenameEntry = () => setRenamingEntry(null);
  const useImage = (image) => handleSelected([image]);

  const { folderId, folderName, files, folderChain, loading, canManage } =
    useFolder();

  useEffect(() => {
    if (folderName === "Exported from Canva") {
      if (files?.length !== currentFiles?.length) {
        setCurrentFiles(files);
      }
    } else {
      if (!currentFilesIsEqualFiles(files, currentFiles)) {
        setCurrentFiles(files);
      }
    }
  }, [files]);

  useEffect(() => {
    // Curators land on the stock library's real root folder so upload and
    // new-folder (which target currentFolderId) write to the right place.
    const managedGlobal = mediaBrowser === "global" && canManage;
    if ((mediaBrowser === "account" || managedGlobal) && !currentFolderId) {
      setCurrentFolderId(folderId);
    }
  }, [currentFolderId, setCurrentFolderId, folderId, mediaBrowser, canManage]);

  useEffect(() => {
    if (currentFolderId && folderId) {
      if (currentFolderId !== folderId) {
        setShowLoading(true);
      } else if (currentFolderId === folderId) {
        setShowLoading(false);
      }
    }
  }, [currentFolderId, folderId]);

  useEffect(() => {
    setCurrentFolderName(folderName);
  }, [folderId]);

  const { fileActions, onFileAction, enableUpload, enableNewFolder } =
    useFileActions({
      uploadAreaRef,
      openNewFolderPrompt,
      setRenamingEntry,
      openGenerateImage,
      canManage,
    });

  return (
    <FileBrowser
      // We're creating our own DndProvider in MediaLibraryContainer
      // so we can use the hook `useDrop` in useUploadFiles.
      // SEE: https://chonky.io/docs/2.x/basics/drag-n-drop#cannot-have-two-html5-backends
      disableDragAndDropProvider
      files={currentFiles}
      folderChain={folderChain}
      onFileAction={onFileAction}
      disableDefaultFileActions={[ChonkyActions.ToggleHiddenFiles.id]}
      fileActions={fileActions}
      defaultSortActionId={
        mediaBrowser === "canva"
          ? ChonkyActions.SortFilesByDate.id
          : ChonkyActions.SortFilesByName.id
      }
    >
      <FileNavbar />
      <FileToolbar />

      {enableNewFolder && showNewFolderPrompt && (
        <NewFolderPrompt close={closeNewFolderPrompt} />
      )}
      {renamingEntry && (
        <RenameEntry entry={renamingEntry} close={closeRenameEntry} />
      )}
      {showGenerateImage && (
        <div
          className="sml-px-2 sml-py-4 sml-mb-4 sml-border-b"
          style={{ marginRight: "-8px", marginLeft: "-8px" }}
        >
          <GenerateImage close={closeGenerateImage} useImage={useImage} />
        </div>
      )}

      {enableUpload ? (
        <UploadArea ref={uploadAreaRef}>
          {loading || showLoading ? <Loading /> : <FileList />}
        </UploadArea>
      ) : (
        <>{loading || showLoading ? <Loading /> : <FileList />}</>
      )}
      <FileContextMenu />
    </FileBrowser>
  );
}

export default MediaBrowser;
