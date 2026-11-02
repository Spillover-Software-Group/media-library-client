// What a person is told when a folder cannot be loaded. The API codes Canva's failures, so a rate
// limit, which passes within a minute, reads differently from Canva not answering at all.
const CANVA_RATE_LIMITED = {
  title: "Canva needs a moment",
  body: "Canva is limiting how often we can load your designs. Try again in a minute.",
};

const CANVA_UNAVAILABLE = {
  title: "Canva isn't responding",
  body: "We couldn't load your designs from Canva. Try again in a moment.",
};

const FOLDER_UNAVAILABLE = {
  title: "This folder didn't load",
  body: "Check your connection and try again.",
};

function folderErrorCopy(error, mediaBrowser) {
  const code = error?.graphQLErrors?.[0]?.extensions?.code;

  if (code === "CANVA_RATE_LIMITED") return CANVA_RATE_LIMITED;
  if (mediaBrowser === "canva") return CANVA_UNAVAILABLE;
  return FOLDER_UNAVAILABLE;
}

export default folderErrorCopy;
