import { useState } from "react";

import MediaLibrary from "../src/main";
import GenerateImageStandalone from "../src/components/GenerateImageStandalone";
import UploadArea from "../src/components/UploadAreaStandalone";

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

      <div style={{ height: "200px", width: "800px" }}>
        <UploadArea
          mode="development"
          handleUploaded={handleSelected}
          ownerId={'12346'}
          // spilloverBusinessId={'12346'} Apps should use this.
        />
      </div>

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
