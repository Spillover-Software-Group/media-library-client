import { gql } from "@apollo/client";

import useMutationAndRefetch from "./useMutationAndRefetch";
import { splitFilesAndFolders } from "./util";

const DELETE_FILES_MUTATION = gql`
  mutation DeleteFiles(
    $fileIds: [GID!]!
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
    $folderIds: [GID!]!
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

function useDeleteFilesAction() {
  const [runDeleteFiles] = useMutationAndRefetch(DELETE_FILES_MUTATION);
  const [runDeleteFolders] = useMutationAndRefetch(DELETE_FOLDERS_MUTATION);

  return (action) => {
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
  };
}

export default useDeleteFilesAction;
