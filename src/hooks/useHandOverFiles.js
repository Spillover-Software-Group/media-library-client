import { toast } from "react-toastify";

import { mediaKindOf, pluralOf } from "../media";
import useOptions from "./useOptions";

// The one way a file reaches the host's `handleSelected`: whatever the host's rules refuse is kept
// back, and the person is told why. Opening many files hands over no more than the host's
// `maxSelectableFiles` (50 when it sets none), counted among the files it takes.
function useHandOverFiles() {
  const { handleSelected, maxSelectableFiles, refusalOf, selectableMedia } =
    useOptions();

  const refusalSentence = (reason, files) => {
    const one = files.length === 1;
    const what = one ? `"${files[0].name}"` : `${files.length} files`;
    const notAdded = one ? "it was not added" : "they were not added";

    if (reason === "size") {
      return `${what} ${one ? "is" : "are"} too large to use here, so ${notAdded}.`;
    }

    // Naming what the spot takes only helps when the file is not one of those kinds.
    if (
      selectableMedia.length &&
      files.every((f) => !selectableMedia.includes(mediaKindOf(f)))
    ) {
      return `You can only use ${pluralOf(selectableMedia)} here, so ${what} ${one ? "was" : "were"} not added.`;
    }

    return `${what} can't be used here, so ${notAdded}.`;
  };

  return (files, { capped = false } = {}) => {
    const accepted = [];
    const refused = { type: [], size: [] };

    for (const f of files) {
      const reason = refusalOf(f);
      if (reason) refused[reason].push(f);
      else accepted.push(f);
    }

    if (accepted.length) {
      handleSelected(
        capped ? accepted.slice(0, maxSelectableFiles || 50) : accepted,
      );
    }

    for (const [reason, refusedFiles] of Object.entries(refused)) {
      if (refusedFiles.length) {
        toast.error(refusalSentence(reason, refusedFiles), {
          autoClose: false,
        });
      }
    }
  };
}

export default useHandOverFiles;
