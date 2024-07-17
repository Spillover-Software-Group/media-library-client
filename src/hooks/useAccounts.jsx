import { createContext, useContext } from "react";
import { gql, useQuery } from "@apollo/client";

import useCurrentAccountId from "./useCurrentAccountId";

const QUERY = gql`
  query GetCurrentUserWithAccounts {
    currentUser {
      id
      role
      accounts {
        id
        spilloverId
        senalysisBusinessId
        name
        rootFolderId
        integrations {
          canva {
            userDisplayName
          }
        }
      }
    }
  }
`;

const context = createContext();

const useAccounts = () => useContext(context);

function AccountsProvider({ children }) {
  const [currentAccountId] = useCurrentAccountId();

  const { loading, data } = useQuery(QUERY);

  const accounts = data?.currentUser?.accounts || [];

  const currentAccount = accounts.find((a) => a.id === currentAccountId);

  const value = {
    loading,
    accounts,
    currentAccount,
  };

  return <context.Provider value={value}>{children}</context.Provider>;
}

export default useAccounts;
export { AccountsProvider };
