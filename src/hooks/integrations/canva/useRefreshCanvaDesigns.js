import useMutationAndRefetch from "../../useMutationAndRefetch";
import { REFRESH_CANVA_DESIGNS } from "./queries";

// Reads the Canva designs again, past the five minutes the API keeps a listing. The browser's
// folder query is refetched after it, which the API answers from the listing just replaced.
function useRefreshCanvaDesigns() {
  // A failure is shown from `error`, so the call itself must not reject.
  const [refresh, { loading, error, reset }] = useMutationAndRefetch(
    REFRESH_CANVA_DESIGNS,
    { onError: () => {} },
  );

  return {
    refreshCanvaDesigns: () => {
      if (!loading) refresh();
    },
    refreshingCanvaDesigns: loading,
    refreshCanvaDesignsError: error,
    dismissRefreshCanvaDesignsError: reset,
  };
}

export default useRefreshCanvaDesigns;
