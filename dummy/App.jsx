import React from 'react';

import MediaLibrary from '../src';

const businessList = [
  {
    id: 'TEST_SPILLOVER_ID',
    label: 'Spillover',
  },
  {
    id: 2,
    label: 'Test',
  },
];

function App() {
  return <MediaLibrary businessList={businessList} />;
}

export default App;
