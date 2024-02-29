import { useCallback, useState } from "react";
import { LocalStorageWrapper } from "apollo3-cache-persist";

import useEventListener from "./useEventListener";

// Handles setting 'null' (removing the value).
// SEE: https://github.com/apollographql/apollo-cache-persist/blob/v0.13.0/src/storageWrappers/LocalStorageWrapper.ts#L19
const storage = new LocalStorageWrapper(window.localStorage);

function useLocalStorage(key, initialValue, options = { sync: false }) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = storage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const handleStorageEvent = useCallback(
    (e) => {
      if (!e.isTrusted || !options.sync) return;

      // Update the state to trigger a rerender
      // if the value changes on another tab.
      if (e.key === key) setStoredValue(JSON.parse(e.newValue));
    },
    [key, setStoredValue],
  );

  useEventListener("storage", handleStorageEvent);

  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState.
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      storage.setItem(
        key,
        valueToStore !== null ? JSON.stringify(valueToStore) : null,
      );
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
