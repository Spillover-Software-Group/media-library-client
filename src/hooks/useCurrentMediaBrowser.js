import { useReactiveVar } from "@apollo/client";

import { currentMediaBrowserVar } from "../cache";

function useCurrentMediaBrowser() {
  const currentMediaBrowser = useReactiveVar(currentMediaBrowserVar);

  return [currentMediaBrowser, currentMediaBrowserVar];
}

export default useCurrentMediaBrowser;
