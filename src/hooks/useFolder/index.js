import { useQuery } from "@apollo/client";

import useCurrentAccountId from "../useCurrentAccountId";
import useCurrentMediaBrowser from "../useCurrentMediaBrowser";
import useOptions from "../useOptions";
import * as queries from "./queries";

function useFolder() {
  const [mediaBrowser] = useCurrentMediaBrowser();
  const [accountId] = useCurrentAccountId();
  const { selectableFileTypes, maxSelectableSize } = useOptions();

  const { loading, data } = useQuery(
    queries[mediaBrowser].query,
    { skip: !accountId, fetchPolicy: "cache-and-network" },
  );

  if (loading || !accountId) return { loading: true, files: [], folderChain: [] };

  const isSelectable = (f) => {
    if (
      selectableFileTypes
      && (
        (
          Array.isArray(selectableFileTypes)
          && !selectableFileTypes.includes(f.mimetype)
        ) || (
          typeof selectableFileTypes === "function"
          && !selectableFileTypes(f)
        )
      )
    ) {
      return false;
    }

    if (
      maxSelectableSize
      && (
        (
          Number.isInteger(maxSelectableSize)
          && f.size > maxSelectableSize
        ) || (
          typeof maxSelectableSize === "function"
          && !maxSelectableSize(f)
        )
      )
    ) {
      return false;
    }

    return true;
  };

  const { entries, folderChain, id: folderId } = queries[mediaBrowser].extractFolder(data);

  const files = entries.map((f) => ({
    ...f,
    selectable: isSelectable(f),
  }));

  return {
    loading,
    folderId,
    files,
    folderChain,
  };
}

export default useFolder;
