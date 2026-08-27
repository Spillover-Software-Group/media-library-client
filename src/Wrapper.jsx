import { ApolloClient, ApolloLink } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { ApolloProvider } from "@apollo/client/react";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

// Ahead of the app stylesheet on purpose: both end up in one bundled `style.css`
// in source order, and the app rules have to be able to override the toast ones.
// Biome will not sort across a bare import, so keeping the two adjacent pins the
// cascade instead of leaving it to whichever module happened to load first.
import "react-toastify/dist/ReactToastify.min.css";
import "./css/style.css";

import cache from "./cache";
import config from "./config";
import { AccountsProvider } from "./hooks/useAccounts.jsx";
import useAuth from "./hooks/useAuth";
import { OptionsProvider } from "./hooks/useOptions";

async function setupClient({ mode, accessToken, reauth }) {
  const uri =
    mode === "development" ? config.graphqlDevEndpoint : config.graphqlEndpoint;

  // This replaces `createHttpLink` to allow multipart (file upload) requests.
  const httpLink = createUploadLink({ uri });

  const authLink = setContext((_, { headers }) => {
    const authorization = accessToken ? `Bearer ${accessToken}` : "";

    return {
      headers: {
        ...headers,
        authorization,
      },
    };
  });

  // Re-authenticate on auth errors.
  const errorLink = onError(({ networkError }) => {
    if (!networkError) return;

    console.error(networkError);
    if (networkError.statusCode === 401) reauth();
  });

  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache,
  });

  return client;
}

function Wrapper({
  children,
  handleSelected,
  mode,
  onSelectedAccountChange,
  defaultAccountId,
  spilloverBusinessId,
  senalysisBusinessId,
  selectableFileTypes,
  maxSelectableSize,
  maxSelectableFiles,
  autoSelect,
  selectOnSingleClick,
  showAccountSelector,
  isFullPage,
  icons = {},
}) {
  const { isAuthenticated, accessToken, reauth } = useAuth();

  if (!isAuthenticated)
    return <h2>Not authenticated. Try refreshing the page.</h2>;

  const [client, setClient] = useState();

  useEffect(() => {
    async function init() {
      setClient(await setupClient({ mode, accessToken, reauth }));
    }

    init().catch(console.error);
  }, [mode, accessToken]);

  if (!client) return <h2>Initializing...</h2>;

  const options = {
    handleSelected,
    onSelectedAccountChange,
    defaultAccountId,
    spilloverBusinessId,
    senalysisBusinessId,
    selectableFileTypes,
    maxSelectableSize,
    maxSelectableFiles,
    icons,
    autoSelect,
    selectOnSingleClick,
    mode,
    isFullPage,
    showAccountSelector: showAccountSelector ?? true,
  };

  return (
    <OptionsProvider options={options}>
      <ApolloProvider client={client}>
        <AccountsProvider>{children}</AccountsProvider>
        <ToastContainer position="bottom-right" autoClose={2500} />
      </ApolloProvider>
    </OptionsProvider>
  );
}

export default Wrapper;
