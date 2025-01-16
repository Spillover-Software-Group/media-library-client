import { useCallback, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";

import useCurrentAccountId from "../useCurrentAccountId";
import useCurrentMediaBrowser from "../useCurrentMediaBrowser";
import useOptions from "../useOptions";
import * as queries from "./queries";
import useCurrentFolderName from "../useCurrentFolderName";

const CANVA_FOLDER_NAME = "Exported from Canva";

function useFolder() {
  const [mediaBrowser] = useCurrentMediaBrowser();
  const [accountId] = useCurrentAccountId();
  const { isSelectable } = useOptions();
  const [currentFolderName] = useCurrentFolderName();
  const currentFolderNameRef = useRef(currentFolderName);

  useEffect(() => {
    currentFolderNameRef.current = currentFolderName;
  }, [currentFolderName]);

  const skipPollAttempt = useCallback(() => {
    if (currentFolderNameRef.current === CANVA_FOLDER_NAME) {
      return false;
    }
    return true;
  }, [currentFolderName]);

  const query = queries[mediaBrowser]?.query;
  const { loading, data, refetch } = useQuery(query, {
    skip: !accountId,
    fetchPolicy: "cache-and-network",
    pollInterval: 1500,
    skipPollAttempt,
  });

  if (loading || !accountId) {
    return { loading: true, files: [], folderChain: [] };
  }

  const {
    entries,
    folderChain,
    id: folderId,
    name: folderName
  } = queries[mediaBrowser].extractFolder(data);

  const files = entries.map((f) => ({
    ...f,
    selectable: isSelectable(f),
  }));

  return {
    loading,
    folderId,
    folderName,
    files,
    folderChain,
    refetch,
  };
}

export default useFolder;
