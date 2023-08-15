import { useState } from "react";

import MediaLibrary from "../src/main";
import GenerateImageStandalone from "../src/components/GenerateImageStandalone";

function App() {
  const [accountId, setAccountId] = useState(null);

  const handleSelected = async (selectedFiles) => {
    console.log("Selected file:", selectedFiles);

    for (const f of selectedFiles) {
      window.open(f.url);
      const r = await fetch(f.url);
      console.log(await r.blob());
    }
  };

  const onSelectedAccountChange = (newAccountId) => {
    console.log("Changed account", newAccountId);
    setAccountId(newAccountId);
  };

  return (
    <div className="wrapper sml-p-4">
      <GenerateImageStandalone
        mode="development"
        handleSelected={handleSelected}
        // engageToken="3chzVB-rNvukfRSmQgR7jYbZHrv0Ue17jZl7CCy9oZc"
        senalysisToken={"test"}
        defaultAccountId={accountId}
        onSelectedAccountChange={onSelectedAccountChange}
        autoSelect={true}
        // marketType={"hvac"}
      />

      <hr />
      <br />

      <MediaLibrary
        mode="development"
        handleSelected={handleSelected}
        // engageToken="3chzVB-rNvukfRSmQgR7jYbZHrv0Ue17jZl7CCy9oZc"
        senalysisToken={"test"}
        defaultAccountId={accountId}
        onSelectedAccountChange={onSelectedAccountChange}
        autoSelect={true}
        // marketType={"hvac"}
      />
    </div>
  );
}

export default App;
