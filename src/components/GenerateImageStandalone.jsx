import Wrapper from "../Wrapper";
import AccountSwitcher from "./AccountSwitcher";
import GenerateImage from "./MediaBrowser/GenerateImage";
import { AuthProvider } from "../hooks/useAuth";

function GenerateImageStandalone(props) {
  const { handleSelected } = props;

  const useImage = (image) => handleSelected([image]);

  return (
    // If `ownerId` changes, the current token will be invalidated
    // and a new one will be requested.
    // This is so that our auth is in sync with the parent app's auth.
    // This could be a userId or a token, for example.
    <AuthProvider ownerId={props.ownerId}>
      <Wrapper {...props}>
        <div className="spillover-media-library sml-flex sml-flex-col sml-gap-4">
          <AccountSwitcher />
          <GenerateImage useImage={useImage} />
        </div>
      </Wrapper>
    </AuthProvider>
  );
}

export default GenerateImageStandalone;
