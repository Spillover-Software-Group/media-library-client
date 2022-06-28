import React, { useCallback } from 'react';
import { gql, useMutation } from '@apollo/client';

import {
  ChonkyActions,
  // ChonkyIconName,
  defineFileAction,
  FileBrowser,
  FileContextMenu,
  FileList,
  FileNavbar,
  FileToolbar,
} from 'chonky';

import useFolderQuery from '../../hooks/useFolderQuery';
import { splitFilesAndFolders } from './util';

const QUERY = gql`
  query GetAccountTrashBin(
    $accountId: ID!
    $folderId: ID
  ) {
    account(accountId: $accountId) {
      id
      trashBin(folderId: $folderId) {
        id
        name
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
  }
`;

const RESTORE_FILES_MUTATION = gql`
  mutation RestoreFiles(
    $fileIds: [ID!]!
  ) {
    restoreFiles(
      input: {
        fileIds: $fileIds
      }
    ) {
      id
      name
    }
  }
`;

const RESTORE_FOLDERS_MUTATION = gql`
  mutation RestoreFolders(
    $folderIds: [ID!]!
  ) {
    restoreFolders(
      input: {
        folderIds: $folderIds
      }
    ) {
      id
      name
    }
  }
`;

function DeletedMediaBrowser({ accountId }) {
  const {
    loading,
    chonkyFoldersAndFiles,
    folderChain,
    setCurrentFolderId,
  } = useFolderQuery(QUERY, (data) => data.account.trashBin, { accountId });

  const refetchQueries = [
    'GetAccountFolderWithChildrenAndFiles',
    'GetGlobalFolder',
    'GetAccountFavorites',
    'GetAccountTrashBin',
  ];

  const [runRestoreFiles] = useMutation(RESTORE_FILES_MUTATION, { refetchQueries });
  const [runRestoreFolders] = useMutation(RESTORE_FOLDERS_MUTATION, { refetchQueries });

  const restoreFilesAction = defineFileAction({
    id: 'restore-files',
    requiresSelection: true,
    button: {
      name: 'Restore files',
      toolbar: true,
      contextMenu: true,
      // icon: ChonkyIconName.
    },
  });

  const fileActionHandler = useCallback(
    (action) => {
      switch (action.id) {
        case ChonkyActions.OpenFiles.id: {
          const { targetFile, files: filesToOpen } = action.payload;
          const fileToOpen = targetFile ?? filesToOpen[0];

          if (fileToOpen && fileToOpen.isDir) {
            setCurrentFolderId(fileToOpen.realId);
          }

          break;
        }

        case restoreFilesAction.id: {
          const { selectedFilesForAction } = action.state;
          const { fileIds, folderIds } = splitFilesAndFolders(selectedFilesForAction);

          if (fileIds.length) {
            runRestoreFiles({
              variables: { fileIds },
            });
          }

          if (folderIds.length) {
            runRestoreFolders({
              variables: { folderIds },
            });
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
      fileActions={[
        restoreFilesAction,
      ]}
      disableDefaultFileActions={[
        ChonkyActions.ToggleHiddenFiles.id,
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

export default DeletedMediaBrowser;
