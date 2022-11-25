const acceptedImageTypes = ["image/jpeg", "image/gif", "image/png"];
const acceptedVideoTypes = ["video/mp4", "video/quicktime"];

const config = {
  graphqlEndpoint: "https://media-library-api.spillover.com/graphql",
  graphqlDevEndpoint: "http://localhost:3030/graphql",
  acceptedImageTypes,
  acceptedVideoTypes,
  acceptedFileTypes: [...acceptedImageTypes, ...acceptedVideoTypes],
  maxImageSize: 52428800, // 5MB
  maxVideoSize: 2147483648, // 2GB
};

export default config;
