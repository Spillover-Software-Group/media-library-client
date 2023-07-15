import { useState } from "react";

import MediaLibrary from "../src/main";

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
    <div className="wrapper">
      <MediaLibrary
        mode="development"
        handleSelected={handleSelected}
        engageToken="GYXmlEIP2WT_RwvN9UHFFxZxSMpi2lLOryhUz8heBt4"
        defaultAccountId={accountId}
        onSelectedAccountChange={onSelectedAccountChange}
        autoSelect={true}
        // marketType={"hvac"}
      />
    </div>
  );
}

export default App;
