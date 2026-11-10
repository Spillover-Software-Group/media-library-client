import { createContext, useContext, useEffect } from "react";

import { takenMedia, unknownMedia } from "../media";

const context = createContext({});

const useOptions = () => useContext(context);

function OptionsProvider({ children, options = {} }) {
  const { selectableFileTypes, maxSelectableSize } = options;
  const ignoredMedia = unknownMedia(options.selectableMedia).join(", ");

  useEffect(() => {
    if (ignoredMedia) {
      console.error(
        `Media Library: selectableMedia takes "video" and "image", so ${ignoredMedia} is ignored.`,
      );
    }
  }, [ignoredMedia]);

  // Why the host's rules refuse a file ("type" or "size"), or null when they take it.
  options.refusalOf = (f) => {
    if (
      selectableFileTypes &&
      ((Array.isArray(selectableFileTypes) &&
        !selectableFileTypes.includes(f.mimetype)) ||
        (typeof selectableFileTypes === "function" && !selectableFileTypes(f)))
    ) {
      return "type";
    }

    if (
      maxSelectableSize &&
      ((Number.isInteger(maxSelectableSize) && f.size > maxSelectableSize) ||
        (typeof maxSelectableSize === "function" && !maxSelectableSize(f)))
    ) {
      return "size";
    }

    return null;
  };

  options.isSelectable = (f) => !options.refusalOf(f);
  options.selectableMedia = takenMedia(options.selectableMedia);
  // Only a host that says what it takes has files kept back by its rules; any other gets every file
  // it opens, as a full-page library that opens files in a new tab needs.
  options.gatesFiles = options.selectableMedia.length > 0;

  options.isProd = options.mode === "production";
  options.isDev = !options.isProd;

  options.icons = {
    // Media browser icons.
    account: "fa-solid fa-house",
    global: "fa-solid fa-globe",
    favorites: "fa-solid fa-heart",
    deleted: "fa-solid fa-trash",

    // Other icons.
    loading: "fa-solid fa-circle-notch fa-spin fa-2x sml-text-gray-400",
    generateImage: "fa-solid fa-magic-wand-sparkles",
    syncFolder: "fa-solid fa-sync",
    confirm: "fa-solid fa-circle-check",
    reload: "fa-solid fa-rotate-right",
    save: "fa-solid fa-floppy-disk",
    favorite: "fa-solid fa-heart",
    unfavorite: "fa-regular fa-heart",
    restore: "fa-solid fa-trash-arrow-up",

    // Custom overrides.
    ...options.icons,
  };

  return <context.Provider value={options}>{children}</context.Provider>;
}

export default useOptions;
export { OptionsProvider };
