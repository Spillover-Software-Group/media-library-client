import { useReactiveVar } from "@apollo/client";

import { currentAccountIdVar } from "../cache";

function useCurrentAccountId() {
  const currentAccountId = useReactiveVar(currentAccountIdVar);

  return [currentAccountId, currentAccountIdVar];
}

export default useCurrentAccountId;
