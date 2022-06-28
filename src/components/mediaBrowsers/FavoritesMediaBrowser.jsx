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

const QUERY = gql`
  query GetAccountFavorites(
    $accountId: ID!
  ) {
    account(accountId: $accountId) {
      id
      favorites {
        id
        name
        updatedAt
        url
        thumbnailUrl
        size
        favoritedAt
      }
    }
  }
`;

const UNFAVORITE_MUTATION = gql`
  mutation UnfavoriteFiles(
    $fileIds: [ID!]!
  ) {
    unfavoriteFiles(
      input: {
        fileIds: $fileIds
      }
    ) {
      id
      name
      favoritedAt
    }
  }
`;

function FavoritesMediaBrowser({
  accountId,
  handleSelected,
  selectableFileTypes,
  maxSelectableSize,
  maxSelectableFiles,
}) {
  const {
    loading,
    chonkyFoldersAndFiles,
    folderChain,
  } = useFolderQuery(
    QUERY,
    (data) => ({ files: data.account.favorites, children: [] }),
    { accountId },
    { selectableFileTypes, maxSelectableSize },
  );

  const refetchQueries = ['GetAccountFavorites'];

  const [runUnfavorite] = useMutation(UNFAVORITE_MUTATION, { refetchQueries });

  const unfavoriteAction = defineFileAction({
    id: 'unfavorite-files',
    requiresSelection: true,
    button: {
      name: 'Unfavorite files',
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

          if (filesToOpen.length === 1 && !fileToOpen.isDir) {
            handleSelected([fileToOpen]);
          } else if (filesToOpen.length > 1 && filesToOpen.every((f) => !f.isDir)) {
            handleSelected(filesToOpen.slice(0, maxSelectableFiles || 50));
          }

          break;
        }

        case unfavoriteAction.id: {
          const { selectedFilesForAction } = action.state;

          if (selectedFilesForAction.length) {
            runUnfavorite({
              variables: { fileIds: selectedFilesForAction.map((f) => f.realId) },
            });
          }

          break;
        }

        default:
          break;
      }
    },
    [
      // setCurrentFolderId,
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
        unfavoriteAction,
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

export default FavoritesMediaBrowser;
