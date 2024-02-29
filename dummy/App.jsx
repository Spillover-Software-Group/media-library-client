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
        ownerId={'12346'}
        defaultAccountId={accountId}
        onSelectedAccountChange={onSelectedAccountChange}
        autoSelect={true}
      />

      <hr />
      <br />

      <MediaLibrary
        mode="development"
        handleSelected={handleSelected}
        ownerId={'12346'}
        defaultAccountId={accountId}
        onSelectedAccountChange={onSelectedAccountChange}
        autoSelect={true}
      />
    </div>
  );
}

export default App;
