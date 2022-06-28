import React, { useCallback } from 'react';
import { gql } from '@apollo/client';

import {
  ChonkyActions,
  FileBrowser,
  FileContextMenu,
  FileList,
  FileNavbar,
  FileToolbar,
} from 'chonky';

import useFolderQuery from '../../hooks/useFolderQuery';

const QUERY = gql`
  query GetGlobalFolder(
    $folderId: ID
  ) {
    globalFolder(folderId: $folderId) {
      id
      name
      updatedAt
      totalChildrenCount
      parent {
        id
        name
        updatedAt
        totalChildrenCount
      }
      children {
        id
        name
        updatedAt
        totalChildrenCount
      }
      files {
        id
        name
        updatedAt
        url
        thumbnailUrl
        size
      }
    }
  }
`;

function GlobalMediaBrowser({
  handleSelected,
  selectableFileTypes,
  maxSelectableSize,
  maxSelectableFiles,
}) {
  const {
    loading,
    chonkyFoldersAndFiles,
    folderChain,
    setCurrentFolderId,
  } = useFolderQuery(
    QUERY,
    (data) => data.globalFolder,
    {},
    { selectableFileTypes, maxSelectableSize },
  );

  const fileActionHandler = useCallback(
    (action) => {
      switch (action.id) {
        case ChonkyActions.OpenFiles.id: {
          const { targetFile, files: filesToOpen } = action.payload;
          const fileToOpen = targetFile ?? filesToOpen[0];

          if (filesToOpen.length === 1 && !fileToOpen.isDir) {
            handleSelected([fileToOpen]);
          } else if (filesToOpen.length > 1 && filesToOpen.every((f) => !f.isDir)) {
            handleSelected(filesToOpen.slice(0, maxSelectableFiles || 50));
          } else if (filesToOpen.length === 1 && fileToOpen.isDir) {
            setCurrentFolderId(fileToOpen.realId);
          }

          break;
        }

        default:
          break;
      }
    },
    [
      setCurrentFolderId,
    ],
  );

  if (loading) return (<p>Loading...</p>);

  return (
    <FileBrowser
      // We're creating our own DndProvider in MediaLibraryContainer.
      disableDragAndDropProvider
      files={chonkyFoldersAndFiles}
      folderChain={folderChain}
      onFileAction={fileActionHandler}
      disableDefaultFileActions={[
        ChonkyActions.ToggleHiddenFiles.id,
      ]}
      fileActions={[
        ChonkyActions.SelectAllFiles,
      ]}
    >
      <FileNavbar />
      <FileToolbar />

      <div className="sml-h-full">
        <FileList />
      </div>

      <FileContextMenu />
    </FileBrowser>
  );
}

export default GlobalMediaBrowser;
