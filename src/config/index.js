const acceptedImageTypes = ["image/jpeg", "image/gif", "image/png"];
const acceptedVideoTypes = ["video/mp4", "video/quicktime"];

const isProd = import.meta.env.PROD;

const ssoUrl = isProd ? "https://media-library-api.spillover.com/sso" : "http://localhost:3030/sso";

const config = {
  isProd,
  isDev: import.meta.env.DEV,
  ssoUrl,
  graphqlEndpoint: "https://media-library-api.spillover.com/graphql",
  graphqlDevEndpoint: "http://localhost:3030/graphql",
  acceptedImageTypes,
  acceptedVideoTypes,
  acceptedFileTypes: [...acceptedImageTypes, ...acceptedVideoTypes],
  maxImageSize: 52428800, // 5MB
  maxVideoSize: 2147483648, // 2GB
};

export default config;
