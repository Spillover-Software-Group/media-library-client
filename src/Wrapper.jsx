import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { useEffect, useState } from "react";
import { ApolloClient, ApolloLink } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { ApolloProvider } from "@apollo/client/react";
import { ToastContainer } from "react-toastify";

import "./css/style.css";

import config from "./config";
import cache from "./cache";
import { OptionsProvider } from "./hooks/useOptions";
import useAuth from "./hooks/useAuth";

async function setupClient({ mode, accessToken, reauth }) {
  const uri = mode === "development" ? config.graphqlDevEndpoint : config.graphqlEndpoint;

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

  if (!isAuthenticated) return <h2>Not authenticated. Try refreshing the page.</h2>;

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
        {children}
        <ToastContainer position="bottom-right" autoClose={2500} />
      </ApolloProvider>
    </OptionsProvider>
  );
}

export default Wrapper;
