import { gql } from "@apollo/client";

import useMutationAndRefetch from "./useMutationAndRefetch";

const FAVORITE_FILES_MUTATION = gql`
  mutation FavoriteFiles(
    $fileIds: [GID!]!
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

function useFavoriteFilesAction() {
  const [runFavoriteFiles] = useMutationAndRefetch(FAVORITE_FILES_MUTATION);

  return (action) => {
    const { selectedFilesForAction } = action.state;

    if (selectedFilesForAction.length) {
      runFavoriteFiles({
        variables: { fileIds: selectedFilesForAction.map((f) => f.id) },
      });
    }
  };
}

export default useFavoriteFilesAction;
