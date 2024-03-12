const acceptedVideoTypes = ["video/mp4", "video/quicktime"];

const acceptedImageTypes = [
  "image/jpeg",
  "image/gif",
  "image/png",
  "image/webp",
];

const acceptedDocumentTypes = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

const config = {
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
  ssoUrl: "https://media-library-api.spillover.com/sso",
  ssoDevUrl: "http://localhost:3030/sso",
  graphqlEndpoint: "https://media-library-api.spillover.com/graphql",
  graphqlDevEndpoint: "http://localhost:3030/graphql",
  acceptedImageTypes,
  acceptedVideoTypes,
  acceptedDocumentTypes,
  acceptedFileTypes: [
    ...acceptedImageTypes,
    ...acceptedVideoTypes,
    ...acceptedDocumentTypes,
  ],
  maxImageSize: 5242880, // 5MB
  maxVideoSize: 2147483648, // 2GB
  maxDocumentSize: 52428800, // 50MB
};

export default config;
