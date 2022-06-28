import React, { useEffect, useState } from 'react';
import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { InMemoryCache, ApolloClient, ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { ApolloProvider } from '@apollo/client/react';
import { createUploadLink } from 'apollo-upload-client';

import './css/style.css';

import config from './config';
import MediaLibraryContainer from './components/MediaLibraryContainer';

setChonkyDefaults({ iconComponent: ChonkyIconFA });

async function setupClient({ mode, spilloverToken, senalysisToken }) {
  const uri = mode === 'development' ? config.graphqlDevEndpoint : config.graphqlEndpoint;

  // This replaces `createHttpLink` to allow multipart (file upload) requests.
  const httpLink = createUploadLink({ uri });

  const authLink = setContext((_, { headers }) => {
    let authorization;

    if (senalysisToken) {
      authorization = `Senalysis ${senalysisToken}`;
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

  const cache = new InMemoryCache();

  const client = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache,
  });

  return client;
}

function MediaLibrary({
  handleSelected,
  mode,
  spilloverToken,
  senalysisToken,
  selectableFileTypes,
  maxSelectableSize,
  maxSelectableFiles,
  icons = {},
}) {
  const [client, setClient] = useState();

  useEffect(() => {
    async function init() {
      setClient(await setupClient({ mode, spilloverToken, senalysisToken }));
    }

    init().catch(console.error);
  }, [mode, spilloverToken, senalysisToken]);

  if (!client) {
    return <h2>Initializing...</h2>;
  }

  return (
    <ApolloProvider client={client}>
      <MediaLibraryContainer
        handleSelected={handleSelected}
        selectableFileTypes={selectableFileTypes}
        maxSelectableSize={maxSelectableSize}
        maxSelectableFiles={maxSelectableFiles}
        icons={icons}
      />
    </ApolloProvider>
  );
}

export default MediaLibrary;
