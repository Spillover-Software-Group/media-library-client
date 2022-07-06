import { gql } from '@apollo/client';

import useMutationAndRefetch from './useMutationAndRefetch';

const UNFAVORITE_MUTATION = gql`
  mutation UnfavoriteFiles(
    $fileIds: [GID!]!
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

function useUnfavoriteFilesAction() {
  const [runUnfavoriteFiles] = useMutationAndRefetch(UNFAVORITE_MUTATION);

  return (action) => {
    const { selectedFilesForAction } = action.state;

    if (selectedFilesForAction.length) {
      runUnfavoriteFiles({
        variables: { fileIds: selectedFilesForAction.map((f) => f.id) },
      });
    }
  };
}

export default useUnfavoriteFilesAction;
