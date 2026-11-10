import { CANVA_UNAUTHORIZED } from "../../../components/MediaBrowser/folderErrorCopy";

// What a person is told when a design cannot be brought in from Canva. The export job's own error
// (errorCode) says why Canva failed it; a Canva call that fails outright carries its code on the
// GraphQL error instead.
const SENTENCES = {
  CANVA_LICENSE_REQUIRED:
    "This design uses premium content your Canva plan doesn't include. Remove it in Canva or upgrade your plan, then try again.",
  CANVA_APPROVAL_REQUIRED:
    "This design needs to be approved in Canva before it can be used. Get it approved in Canva, then try again.",
  CANVA_EXPORT_FAILED:
    "Canva couldn't export this design. Try again in a moment.",
  CANVA_RATE_LIMITED:
    "Canva is limiting how often we can export designs. Try again in a minute.",
  CANVA_UNAUTHORIZED: CANVA_UNAUTHORIZED.body,
  SAVE_FAILED:
    "We couldn't save this design on your My Media folder. Try again in a moment.",
  TIMED_OUT:
    "Canva is taking too long to export this design. Try again in a moment.",
};

const FALLBACK =
  "We couldn't get this design from Canva. Try again in a moment.";

// A failed export job, or one given up on, as an error with the code its sentence is listed under.
class CanvaExportError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

const exportErrorSentence = (error) =>
  SENTENCES[error?.code ?? error?.graphQLErrors?.[0]?.extensions?.code] ??
  FALLBACK;

export { CanvaExportError, exportErrorSentence };
