import { useQuery } from "@apollo/client";

import useCurrentAccountId from "../useCurrentAccountId";
import useCurrentMediaBrowser from "../useCurrentMediaBrowser";
import useOptions from "../useOptions";
import * as queries from "./queries";

function useFolder() {
  const [mediaBrowser] = useCurrentMediaBrowser();
  const [accountId] = useCurrentAccountId();
  const { isSelectable } = useOptions();

  const { loading, data, refetch } = useQuery(queries[mediaBrowser].query, {
    skip: !accountId,
    fetchPolicy: "cache-and-network",
  });

  if (loading || !accountId)
    return { loading: true, files: [], folderChain: [] };

  const {
    entries,
    folderChain,
    id: folderId,
  } = queries[mediaBrowser].extractFolder(data);

  const files = entries.map((f) => ({
    ...f,
    selectable: isSelectable(f),
  }));

  return {
    loading,
    folderId,
    files,
    folderChain,
    refetch,
  };
}

export default useFolder;
