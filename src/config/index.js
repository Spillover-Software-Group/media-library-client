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

const apiEndpoints = (origin) => ({
  graphql: `${origin}/graphql`,
  sso: `${origin}/sso`,
  apiBase: origin,
});

const endpointsByMode = new Map([
  ["production", apiEndpoints("https://media-library-api.spillover.com")],
  ["staging", apiEndpoints("https://media-library-api-staging.spillover.com")],
  [
    "development",
    {
      ...apiEndpoints("http://localhost:3030"),
      // Canva accepts 127.0.0.1, not localhost, as a local OAuth redirect, so its flow starts there.
      apiBase: "http://127.0.0.1:3030",
    },
  ],
]);

// The API endpoints for a host app's `mode` prop. Any mode not listed resolves to production.
export const endpointsFor = (mode) =>
  endpointsByMode.get(mode) ?? endpointsByMode.get("production");

const config = {
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
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
