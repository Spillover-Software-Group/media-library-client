import MediaLibraryContainer from "./components/MediaLibraryContainer";
import GenerateImageStandalone from "./components/GenerateImageStandalone";
import Wrapper from "./Wrapper";

function MediaLibrary(props) {
  return (
    <Wrapper {...props}>
      <MediaLibraryContainer />
    </Wrapper>
  );
}

export default MediaLibrary;
export { GenerateImageStandalone };
