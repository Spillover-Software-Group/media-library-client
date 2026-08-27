import GenerateImageStandalone from "./components/GenerateImageStandalone";
import MediaLibraryContainer from "./components/MediaLibraryContainer";
import UploadAreaStandalone from "./components/UploadAreaStandalone";
import { AuthProvider } from "./hooks/useAuth";
import Wrapper from "./Wrapper";

function MediaLibrary(props) {
  return (
    // If `ownerId` changes, the current token will be invalidated
    // and a new one will be requested.
    // This is so that our auth is in sync with the parent app's auth.
    // This could be a userId or a token, for example.
    <AuthProvider mode={props.mode} ownerId={props.ownerId}>
      <Wrapper {...props}>
        <MediaLibraryContainer />
      </Wrapper>
    </AuthProvider>
  );
}

export default MediaLibrary;
export { GenerateImageStandalone, UploadAreaStandalone };
