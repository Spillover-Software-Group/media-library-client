import { useEffect, useState } from "react";
import { ApolloClient, ApolloLink } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { createUploadLink } from "apollo-upload-client";
import { ToastContainer } from "react-toastify";

import "./css/style.css";

import config from "./config";
import cache, { marketTypeVar, currentFolderIdVar } from "./cache";
import { OptionsProvider } from "./hooks/useOptions";

async function setupClient({ mode, engageToken, spilloverToken, senalysisToken }) {
  const uri = mode === "development" ? config.graphqlDevEndpoint : config.graphqlEndpoint;

  // This replaces `createHttpLink` to allow multipart (file upload) requests.
  const httpLink = createUploadLink({ uri });

  const authLink = setContext((_, { headers }) => {
    let authorization;

    if (senalysisToken) {
      authorization = `Senalysis ${senalysisToken}`;
    } else if (engageToken) {
      authorization = `Engage ${engageToken}`;
    } else {
      authorization = `Bearer ${spilloverToken}`;
    }

    return {
      headers: {
        ...headers,
        authorization,
      },
    };
  });

  const client = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache,
  });

  return client;
}

function Wrapper({
  children,
  handleSelected,
  mode,
  spilloverToken,
  engageToken,
  senalysisToken,
  onSelectedAccountChange,
  defaultAccountId,
  selectableFileTypes,
  maxSelectableSize,
  maxSelectableFiles,
  autoSelect,
  selectOnSingleClick,
  marketType,
  showAccountSelector,
  icons = {},
}) {
  const [client, setClient] = useState();

  useEffect(() => {
    async function init() {
      setClient(await setupClient({ mode, spilloverToken, engageToken, senalysisToken }));
    }

    init().catch(console.error);
  }, [mode, spilloverToken, engageToken, senalysisToken]);

  if (!client) {
    return <h2>Initializing...</h2>;
  }

  marketTypeVar(marketType);
  // currentFolderIdVar(defaultAccountId);

  const options = {
    handleSelected,
    onSelectedAccountChange,
    defaultAccountId,
    selectableFileTypes,
    maxSelectableSize,
    maxSelectableFiles,
    icons,
    autoSelect,
    selectOnSingleClick,
    marketType,
    mode,
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
