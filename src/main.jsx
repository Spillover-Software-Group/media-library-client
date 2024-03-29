import MediaLibraryContainer from "./components/MediaLibraryContainer";
import GenerateImageStandalone from "./components/GenerateImageStandalone";
import UploadAreaStandalone from "./components/UploadAreaStandalone";
import Wrapper from "./Wrapper";
import { AuthProvider } from "./hooks/useAuth";

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
