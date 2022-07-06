import { gql } from '@apollo/client';

import useMutationAndRefetch from './useMutationAndRefetch';
import { splitFilesAndFolders } from './util';

const RESTORE_FILES_MUTATION = gql`
  mutation RestoreFiles(
    $fileIds: [GID!]!
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
    $folderIds: [GID!]!
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

function useRestoreFilesAction() {
  const [runRestoreFiles] = useMutationAndRefetch(RESTORE_FILES_MUTATION);
  const [runRestoreFolders] = useMutationAndRefetch(RESTORE_FOLDERS_MUTATION);

  return (action) => {
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
  };
}

export default useRestoreFilesAction;
