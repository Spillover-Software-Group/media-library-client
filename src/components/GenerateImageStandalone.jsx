import Wrapper from "../Wrapper";
import AccountSwitcher from "./AccountSwitcher";
import GenerateImage from "./MediaBrowser/GenerateImage";

function GenerateImageStandalone(props) {
  const { handleSelected } = props;

  const useImage = (image) => handleSelected([image]);

  return (
    <Wrapper {...props}>
      <div className="spillover-media-library sml-flex sml-flex-col sml-gap-4">
        <AccountSwitcher />
        <GenerateImage useImage={useImage} />
      </div>
    </Wrapper>
  );
}

export default GenerateImageStandalone;
