import { gql } from '@apollo/client';

import useMutationAndRefetch from './useMutationAndRefetch';
import { splitFilesAndFolders } from './util';

const MOVE_FILES_MUTATION = gql`
  mutation MoveFiles(
    $fileIds: [GID!]!
    $destinationFolderId: GID!
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
    $folderIds: [GID!]!
    $destinationFolderId: GID!
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

function useMoveFilesAction() {
  const [runMoveFiles] = useMutationAndRefetch(MOVE_FILES_MUTATION);
  const [runMoveFolders] = useMutationAndRefetch(MOVE_FOLDERS_MUTATION);

  return (action) => {
    const { files: filesAndFolders, destination } = action.payload;
    const { fileIds, folderIds } = splitFilesAndFolders(filesAndFolders);
    const destinationFolderId = destination.id;

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
  };
}

export default useMoveFilesAction;
