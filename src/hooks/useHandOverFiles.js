import { toast } from "react-toastify";

import { mediaKindOf, pluralOf } from "../media";
import useOptions from "./useOptions";

// The one way a file reaches the host's `handleSelected`. When the host says what it takes
// (`gatesFiles`), whatever its rules refuse is kept back and the person is told why; any other host
// gets the files as they are. Opening many files hands over no more than the host's
// `maxSelectableFiles` (50 when it sets none). A selection is always handed over, even an empty one,
// so the host hears of a deselect. Returns whether any file was handed over.
function useHandOverFiles() {
  const {
    handleSelected,
    maxSelectableFiles,
    refusalOf,
    selectableMedia,
    gatesFiles,
  } = useOptions();

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

  return (files, { capped = false, selection = false } = {}) => {
    const accepted = [];
    const refused = { type: [], size: [] };

    for (const f of files) {
      const reason = gatesFiles && refusalOf(f);
      if (reason) refused[reason].push(f);
      else accepted.push(f);
    }

    const handed = capped
      ? accepted.slice(0, maxSelectableFiles || 50)
      : accepted;
    if (handed.length || selection) handleSelected(handed);

    for (const [reason, refusedFiles] of Object.entries(refused)) {
      if (refusedFiles.length) {
        toast.error(refusalSentence(reason, refusedFiles), {
          autoClose: false,
        });
      }
    }

    return handed.length > 0;
  };
}

export default useHandOverFiles;
