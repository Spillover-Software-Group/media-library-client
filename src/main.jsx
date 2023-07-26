import { useEffect, useState } from "react";
import { setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";
import { ApolloClient, ApolloLink } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { createUploadLink } from "apollo-upload-client";

import "./css/style.css";

import config from "./config";
import cache, { marketTypeVar } from "./cache";
import MediaLibraryContainer from "./components/MediaLibraryContainer";
import Icon from "./components/Icon";
import GenerateImage from "./components/MediaBrowser/GenerateImage";
import { OptionsProvider } from "./hooks/useOptions";

// SEE: https://chonky.io/docs/2.x/basics/icons#defining-a-custom-icon-component
const iconMap = {
  generateImage: { name: "magic-wand-sparkles", iconStyle: "fa-solid" },
  favorite: { name: "heart", iconStyle: "fa-solid" },
  unfavorite: { name: "heart", iconStyle: "fa-regular" },
  restore: { name: "trash-arrow-up", iconStyle: "fa-solid" },
};

function IconComponent(props) {
  const icon = iconMap[props.icon];

  if (icon) return <Icon {...icon} />;

  return <ChonkyIconFA {...props} />;
}

setChonkyDefaults({ iconComponent: IconComponent });

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

function MediaLibrary({
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
  };

  return (
    <OptionsProvider options={options}>
      <ApolloProvider client={client}>
        <MediaLibraryContainer />
      </ApolloProvider>
    </OptionsProvider>
  );
}

export default MediaLibrary;
export { GenerateImage };
