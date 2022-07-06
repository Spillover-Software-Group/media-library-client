import { useState } from 'react';

import MediaLibrary from '../src/main';

function App() {
  const [accountId, setAccountId] = useState('Z2lkOi8vYXBpL0FjY291bnQvMTAw');

  const handleSelected = async (selectedFiles) => {
    console.log('Selected file:', selectedFiles);

    for (const f of selectedFiles) {
      const r = await fetch(f.url);
      console.log(await r.blob());
    }
  };

  const onSelectedAccountChange = (newAccountId) => {
    console.log('Changed account', newAccountId);
    setAccountId(newAccountId);
  };

  return (
    <div className="wrapper">
      <MediaLibrary
        mode="development"
        handleSelected={handleSelected}
        senalysisToken="e6857c66-0626-4251-b82a-081d8ec98183"
        defaultAccountId={accountId}
        onSelectedAccountChange={onSelectedAccountChange}
      />
    </div>
  );
}

export default App;
