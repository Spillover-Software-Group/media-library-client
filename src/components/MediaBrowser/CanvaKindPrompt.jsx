import { useEffect, useRef } from "react";

import { MEDIA } from "../../media";
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";

// Sized in px, not the rem the widget's Tailwind scale uses: SENALYSIS sets a 10px root font, which
// shrinks every rem size to 62.5% there. These are the rem sizes as they render on a 16px root.
const BUTTON_SIZE = { fontSize: "12px", height: "40px", padding: "0 16px" };

// Asked each time a Canva design is opened for a host that takes both videos and pictures: Canva
// offers every design as either, so only the person knows which one they meant. It takes focus on
// its first choice, hands focus back when it closes, and Escape cancels it.
function CanvaKindPrompt({ design, kinds, choose, cancel }) {
  const ref = useRef();

  useEffect(() => {
    const focusedBefore = document.activeElement;
    ref.current.querySelector("button").focus();

    return () => focusedBefore?.focus?.();
  }, []);

  // Stopped here so a host modal around the widget does not close on the same Escape.
  const onKeyDown = (e) => {
    if (e.key !== "Escape") return;

    e.stopPropagation();
    cancel();
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Video or picture?"
      onKeyDown={onKeyDown}
      style={{ marginRight: "-8px", marginLeft: "-8px" }}
      className="sml-mb-[16px] sml-flex sml-flex-row sml-flex-wrap sml-items-center sml-gap-x-[16px] sml-gap-y-[8px] sml-border-b sml-p-[8px]"
    >
      <div className="sml-min-w-0 sml-grow">
        <p className="sml-m-0 sml-font-semibold sml-text-[14px] sml-leading-[1.5715]">
          Video or picture?
        </p>
        <p className="sml-m-0 sml-text-gray-600 sml-text-[12px] sml-leading-normal">
          Choose how to bring in "{design.name}" from Canva.
        </p>
      </div>

      <div className="sml-flex sml-shrink-0 sml-flex-row sml-gap-[8px] sml-whitespace-nowrap">
        {kinds.map((kind) => (
          <PrimaryButton
            key={kind}
            type="button"
            style={BUTTON_SIZE}
            onClick={() => choose(kind)}
          >
            {MEDIA[kind].label}
          </PrimaryButton>
        ))}
        <SecondaryButton style={BUTTON_SIZE} onClick={cancel}>
          Cancel
        </SecondaryButton>
      </div>
    </div>
  );
}

export default CanvaKindPrompt;
