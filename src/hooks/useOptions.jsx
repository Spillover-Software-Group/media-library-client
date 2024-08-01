import { createContext, useContext } from "react";

const context = createContext({});

const useOptions = () => useContext(context);

function OptionsProvider({ children, options = {} }) {
  const { selectableFileTypes, maxSelectableSize } = options;

  options.isSelectable = (f) => {
    if (
      selectableFileTypes &&
      ((Array.isArray(selectableFileTypes) &&
        !selectableFileTypes.includes(f.mimetype)) ||
        (typeof selectableFileTypes === "function" && !selectableFileTypes(f)))
    ) {
      return false;
    }

    if (
      maxSelectableSize &&
      ((Number.isInteger(maxSelectableSize) && f.size > maxSelectableSize) ||
        (typeof maxSelectableSize === "function" && !maxSelectableSize(f)))
    ) {
      return false;
    }

    return true;
  };

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
