import React from 'react';

import MediaLibrary from '../src/main';

function App() {
  const handleSelected = async (selectedFiles) => {
    console.log('Selected file:', selectedFiles);

    for (const f of selectedFiles) {
      const r = await fetch(f.url);
      console.log(await r.blob());
    }
  };

  return (
    <div className="sml-h-screen">
      <MediaLibrary
        mode="development"
        handleSelected={handleSelected}
        senalysisToken="45e6c524-4f85-439c-b2ea-b9de1e30d4e3"
      />
    </div>
  );
}

export default App;
