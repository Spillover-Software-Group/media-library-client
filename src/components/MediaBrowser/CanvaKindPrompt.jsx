import { MEDIA } from "../../media";
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";

// Asked each time a Canva design is opened for a host that takes both videos and pictures: Canva
// offers every design as either, so only the person knows which one they meant.
function CanvaKindPrompt({ design, kinds, choose, cancel }) {
  return (
    <div
      role="dialog"
      aria-label="Video or picture?"
      style={{ marginRight: "-8px", marginLeft: "-8px" }}
      className="sml-mb-4 sml-flex sml-flex-row sml-flex-wrap sml-items-center sml-gap-x-4 sml-gap-y-2 sml-border-b sml-p-2"
    >
      <div className="sml-min-w-0 sml-grow">
        <p className="sml-m-0 sml-font-semibold sml-text-sm">
          Video or picture?
        </p>
        <p className="sml-m-0 sml-text-gray-600 sml-text-xs">
          Choose how to bring in "{design.name}" from Canva.
        </p>
      </div>

      <div className="sml-flex sml-shrink-0 sml-flex-row sml-gap-2 sml-whitespace-nowrap">
        {kinds.map((kind) => (
          <PrimaryButton key={kind} type="button" onClick={() => choose(kind)}>
            {MEDIA[kind].label}
          </PrimaryButton>
        ))}
        <SecondaryButton onClick={cancel}>Cancel</SecondaryButton>
      </div>
    </div>
  );
}

export default CanvaKindPrompt;
