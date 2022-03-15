import React, { useEffect, useState } from "react";
import axios from "axios";

import config from "../../config";

function useFetchFilesForFolder(pageNum, userId, activeFolderId) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  // const [shouldRefetch, refetch] = useState({});

  const { baseUrl } = config;

  useEffect(() => {
    setIsLoading(true);
    setError(false);

    axios
      .get(`${baseUrl}/${activeFolderId}/files?pageNum=${pageNum}`, {
        params: { userId },
      })
      .then((res) => {
        setMediaList((prev) => {
          return [...new Set([...prev, ...res.data.filesFromPage])];
        });
        setTotalFiles(res.data.totalFiles);
        setHasMore(res?.data?.filesFromPage?.length > 0);
        setIsLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError(err);
      });
  }, [pageNum]);
  return {
    isLoading,
    error,
    mediaList,
    totalFiles,
    hasMore,
    // refetch,
  };
}

export default useFetchFilesForFolder;
