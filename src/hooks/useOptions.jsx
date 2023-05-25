import { createContext, useContext } from "react";

const context = createContext({});

const useOptions = () => useContext(context);

function OptionsProvider({ children, options = {} }) {
  const { selectableFileTypes, maxSelectableSize } = options;

  options.isSelectable = (f) => {
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

  return <context.Provider value={options}>{children}</context.Provider>;
}

export default useOptions;
export { OptionsProvider };
