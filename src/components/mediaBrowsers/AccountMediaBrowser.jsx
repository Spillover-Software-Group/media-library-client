import React, {
  useCallback,
  useRef,
  useState,
} from 'react';

import { gql, useMutation } from '@apollo/client';
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { toast } from 'react-toastify';

import {
  ChonkyActions,
  ChonkyIconName,
  defineFileAction,
  FileBrowser,
  FileContextMenu,
  FileList,
  FileNavbar,
  FileToolbar,
} from 'chonky';

import config from '../../config';
import NewFolderPrompt from '../NewFolderPrompt';
import ShowImageModal from '../modals/ShowImageModal';
import useFolderQuery from '../../hooks/useFolderQuery';
import { splitFilesAndFolders } from './util';

const QUERY = gql`
  query GetAccountFolderWithChildrenAndFiles(
    $accountId: ID!,
    $folderId: ID
  ) {
    account(accountId: $accountId) {
      id
      folder(folderId: $folderId) {
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
          mimetype
          updatedAt
          url
          thumbnailUrl
          size
          favoritedAt
        }
      }
    }
  }
`;

const UPLOAD_FILES_MUTATION = gql`
  mutation UploadFiles(
    $folderId: ID!
    $files: [Upload!]!
  ) {
    uploadFiles(
      input: {
        folderId: $folderId,
        files: $files
      }
    ) {
      id
      name
      mimetype
      updatedAt
      url
      thumbnailUrl
      size
      favoritedAt
    }
  }
`;

const DELETE_FILES_MUTATION = gql`
  mutation DeleteFiles(
    $fileIds: [ID!]!
  ) {
    deleteFiles(
      input: {
        fileIds: $fileIds
      }
    ) {
      id
      name
    }
  }
`;

const DELETE_FOLDERS_MUTATION = gql`
  mutation DeleteFolders(
    $folderIds: [ID!]!
  ) {
    deleteFolders(
      input: {
        folderIds: $folderIds
      }
    ) {
      id
      name
    }
  }
`;

const MOVE_FILES_MUTATION = gql`
  mutation MoveFiles(
    $fileIds: [ID!]!
    $destinationFolderId: ID!
  ) {
    moveFiles(
      input: {
        fileIds: $fileIds,
        destinationFolderId: $destinationFolderId
      }
    ) {
      id
      name
    }
  }
`;

const MOVE_FOLDERS_MUTATION = gql`
  mutation MoveFolders(
    $folderIds: [ID!]!
    $destinationFolderId: ID!
  ) {
    moveFolders(
      input: {
        folderIds: $folderIds,
        destinationFolderId: $destinationFolderId
      }
    ) {
      id
      name
    }
  }
`;

const FAVORITE_FILES_MUTATION = gql`
  mutation FavoriteFiles(
    $fileIds: [ID!]!
  ) {
    favoriteFiles(
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

function isImage(file) {
  return config.acceptedImageTypes.includes(file.type);
}

function isVideo(file) {
  return config.acceptedVideoTypes.includes(file.type);
}

function isValidFile(file) {
  if (isImage(file) && file.size <= config.maxImageSize) return true;
  if (isVideo(file) && file.size <= config.maxVideoSize) return true;

  return false;
}

function AccountMediaBrowser({
  accountId,
  handleSelected,
  selectableFileTypes,
  maxSelectableSize,
  maxSelectableFiles,
}) {
  // const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  // const [previewFile, setPreviewFile] = useState(null);
  const [showNewFolderPrompt, setShowNewFolderPrompt] = useState(false);
  const uploadInputRef = useRef();

  const {
    loading,
    chonkyFoldersAndFiles,
    folderChain,
    currentFolderId,
    setCurrentFolderId,
  } = useFolderQuery(
    QUERY,
    (data) => data.account.folder,
    { accountId },
    { selectableFileTypes, maxSelectableSize },
  );

  const refetchQueries = [
    'GetAccountFolderWithChildrenAndFiles',
    'GetGlobalFolder',
  ];

  const allRefetechQueries = refetchQueries.concat([
    'GetAccountFavorites',
    'GetAccountTrashBin',
  ]);

  const [runUploadFiles] = useMutation(UPLOAD_FILES_MUTATION, { refetchQueries });
  const [runMoveFiles] = useMutation(MOVE_FILES_MUTATION, { refetchQueries });
  const [runMoveFolders] = useMutation(MOVE_FOLDERS_MUTATION, { refetchQueries });
  const [runDeleteFiles] = useMutation(DELETE_FILES_MUTATION, { allRefetechQueries });
  const [runDeleteFolders] = useMutation(DELETE_FOLDERS_MUTATION, { allRefetechQueries });
  const [runFavoriteFiles] = useMutation(FAVORITE_FILES_MUTATION, { allRefetechQueries });

  const favoriteFilesAction = defineFileAction({
    id: 'favorite-files',
    requiresSelection: true,
    fileFilter: (file) => !file.isDir,
    button: {
      name: 'Favorite',
      toolbar: false,
      contextMenu: true,
      // icon: ChonkyIconName.
    },
  });

  // const previewFileAction = defineFileAction({
  //   id: 'previewFile',
  //   requiresSelection: true,
  //   fileFilter: isImage,
  //   button: {
  //     name: 'Preview',
  //     toolbar: false,
  //     contextMenu: true,
  //     icon: ChonkyIconName.largeThumbnail,
  //   },
  // });

  // TODO: Allow preview in Global/Favorites/Deleted too.
  // const showPreview = (file) => {
  //   if (!isImage(file)) return;

  //   setPreviewFile(file);
  //   setIsPreviewModalOpen(true);
  // };

  const uploadFiles = (files) => {
    if (!files.every(isValidFile)) {
      toast.error('Invalid files!');
      return false;
    }

    const uploadPromise = runUploadFiles({
      variables: {
        folderId: currentFolderId,
        files,
      },
    });

    toast.promise(uploadPromise, {
      pending: 'Uploading files...',
      success: 'Files uploaded!',
      error: 'Error uploading files!',
    });

    return uploadPromise;
  };

  const handleSelectedForUpload = (e) => {
    const { files } = e.target;
    if (!files) return;

    uploadFiles(Array.from(files));
  };

  const [, uploadDropZoneRef] = useDrop({
    accept: [NativeTypes.FILE],

    drop({ files }) {
      uploadFiles(files);
    },

    canDrop({ files }) {
      return files.every(isValidFile);
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
          } else if (filesToOpen.length === 1 && fileToOpen.isDir) {
            setCurrentFolderId(fileToOpen.realId);
          }

          break;
        }

        case ChonkyActions.CreateFolder.id: {
          setShowNewFolderPrompt(true);
          break;
        }

        case ChonkyActions.UploadFiles.id: {
          uploadInputRef.current?.click();
          break;
        }

        case ChonkyActions.DeleteFiles.id: {
          const { selectedFilesForAction } = action.state;
          const { fileIds, folderIds } = splitFilesAndFolders(selectedFilesForAction);

          if (fileIds.length) {
            runDeleteFiles({
              variables: { fileIds },
            });
          }

          if (folderIds.length) {
            runDeleteFolders({
              variables: { folderIds },
            });
          }

          break;
        }

        case ChonkyActions.MoveFiles.id: {
          const { files: filesAndFolders, destination } = action.payload;
          const { fileIds, folderIds } = splitFilesAndFolders(filesAndFolders);
          const destinationFolderId = (destination.realId || destination.id);

          if (fileIds.length) {
            runMoveFiles({
              variables: { fileIds, destinationFolderId },
            });
          }

          if (folderIds.length) {
            runMoveFolders({
              variables: { folderIds, destinationFolderId },
            });
          }

          break;
        }

        case favoriteFilesAction.id: {
          const { selectedFilesForAction } = action.state;

          if (selectedFilesForAction.length) {
            runFavoriteFiles({
              variables: { fileIds: selectedFilesForAction.map((f) => f.realId) },
            });
          }

          break;
        }

        // case previewFileAction.id: {
        //   const { contextMenuTriggerFile } = action.state;
        //   if (!contextMenuTriggerFile) return;

        //   showPreview(contextMenuTriggerFile);

        //   break;
        // }

        default:
          break;
      }
    },
    [
      setCurrentFolderId,
      setShowNewFolderPrompt,
      runDeleteFiles,
      runDeleteFolders,
      runMoveFiles,
      runMoveFolders,
      runFavoriteFiles,
      // showPreview,
      uploadInputRef,
    ],
  );

  if (loading) return (<p>Loading...</p>);

  return (
    <>
      <FileBrowser
        // We're creating our own DndProvider in MediaLibraryContainer
        // so we can use the hook `useDrop` above.
        // SEE: https://chonky.io/docs/2.x/basics/drag-n-drop#cannot-have-two-html5-backends
        disableDragAndDropProvider
        files={chonkyFoldersAndFiles}
        folderChain={folderChain}
        onFileAction={fileActionHandler}
        disableDefaultFileActions={[
          ChonkyActions.ToggleHiddenFiles.id,
        ]}
        fileActions={[
          ChonkyActions.CreateFolder,
          ChonkyActions.DeleteFiles,
          ChonkyActions.SelectAllFiles,
          ChonkyActions.MoveFiles,
          ChonkyActions.UploadFiles,
          favoriteFilesAction,
          // previewFileAction,
        ]}
      >
        <FileNavbar />
        <FileToolbar />

        {showNewFolderPrompt && (
          <NewFolderPrompt
            parentId={currentFolderId}
            close={() => setShowNewFolderPrompt(false)}
          />
        )}

        <div ref={uploadDropZoneRef} className="sml-h-full">
          <FileList />
        </div>

        <FileContextMenu />
      </FileBrowser>

      <input
        ref={uploadInputRef}
        type="file"
        style={{ display: 'none' }}
        accept={config.acceptedFileTypes.join()}
        onChange={handleSelectedForUpload}
        multiple
      />

      {/* <ShowImageModal
        isOpen={isPreviewModalOpen}
        setIsOpen={setIsPreviewModalOpen}
        file={previewFile}
      /> */}
    </>
  );
}

export default AccountMediaBrowser;
