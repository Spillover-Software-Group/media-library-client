import { useMutation } from "@apollo/client";

import useCurrentMediaBrowser from "./useCurrentMediaBrowser";
import * as queries from "./useFolder/queries";

// Runs mutation and automatically refetches folder query for current mediaBrowser.
function useMutationAndRefetch(mutation, options = {}) {
  const [mediaBrowser] = useCurrentMediaBrowser();
  const refetchQueries = [{ query: queries[mediaBrowser].query }];
  return useMutation(mutation, { ...options, refetchQueries });
}

export default useMutationAndRefetch;
