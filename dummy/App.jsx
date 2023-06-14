import { useState } from "react";

import MediaLibrary from "../src/main";

function App() {
  const [accountId, setAccountId] = useState(null);

  const handleSelected = async (selectedFiles) => {
    console.log("Selected file:", selectedFiles);

    for (const f of selectedFiles) {
      const r = await fetch(f.url);
      console.log(await r.blob());
    }
  };

  const onSelectedAccountChange = (newAccountId) => {
    console.log("Changed account", newAccountId);
    setAccountId(newAccountId);
  };

  return (
    <div className="wrapper">
      <MediaLibrary
        mode="development"
        handleSelected={handleSelected}
        engageToken="pwyOYJyE3qIGR8go-dpgTGJAbFzzzxUSmC0xQxiC9oY"
        defaultAccountId={accountId}
        onSelectedAccountChange={onSelectedAccountChange}
        autoSelect={true}
        marketType={"hvac"}
      />
    </div>
  );
}

export default App;
