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
        engageToken="I_dAWfcx5IcwF4bewGrwtp7lJr3UMVX3xg0AMSAxvTc"
        defaultAccountId={accountId}
        onSelectedAccountChange={onSelectedAccountChange}
        autoSelect={true}
      />
    </div>
  );
}

export default App;
