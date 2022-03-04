import React from 'react';

import MediaLibrary from '../src';

const businessList = [
  {
    id: 'TEST_SPILLOVER_ID',
    name: 'Spillover',
  },
  {
    id: 2,
    name: 'Test',
  },
];

function App() {
  return <MediaLibrary businessList={businessList} />;
}

export default App;
