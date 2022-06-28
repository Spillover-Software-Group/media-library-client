import React, { useEffect, useMemo, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { ToastContainer } from 'react-toastify';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import AccountSwitcher from './AccountSwitcher';
import Sidebar from './Sidebar';
import AccountMediaBrowser from './mediaBrowsers/AccountMediaBrowser';
import GlobalMediaBrowser from './mediaBrowsers/GlobalMediaBrowser';
import DeletedMediaBrowser from './mediaBrowsers/DeletedMediaBrowser';
import FavoritesMediaBrowser from './mediaBrowsers/FavoritesMediaBrowser';

import 'react-toastify/dist/ReactToastify.min.css';

const libraries = [
  {
    key: 'account',
    name: 'My Media',
    icon: 'home',
  },
  {
    key: 'global',
    name: 'Global',
    icon: 'globe',
  },
  {
    key: 'favorites',
    name: 'Favorites',
    icon: 'heart',
  },
  {
    key: 'deleted',
    name: 'Deleted',
    icon: 'trash',
  },
];

const QUERY = gql`
  query GetCurrentUserWithAccounts {
    currentUser {
      id
      role
      accounts {
        id
        name
      }
    }
  }
`;

function MediaLibraryContainer({
  handleSelected,
  selectableFileTypes,
  maxSelectableSize,
  maxSelectableFiles,
  icons = {},
}) {
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [activeLibrary, setActiveLibrary] = useState(libraries[0]);
  const { loading, data } = useQuery(QUERY);

  useEffect(() => {
    if (!selectedAccountId) setSelectedAccountId(data?.currentUser?.accounts[0]?.id);
  }, [data?.currentUser?.accounts]);

  const browser = useMemo(() => {
    // Using selectedAccountId as the component key makes sure
    // its state (e.g.: currentFolderId) is clean when we switch accounts.
    // SEE: https://medium.com/@albertogasparin/forcing-state-reset-on-a-react-component-by-using-the-key-prop-14b36cd7448e
    switch (activeLibrary.key) {
      case 'account':
        return (
          <AccountMediaBrowser
            key={selectedAccountId}
            accountId={selectedAccountId}
            handleSelected={handleSelected}
            selectableFileTypes={selectableFileTypes}
            maxSelectableSize={maxSelectableSize}
            maxSelectableFiles={maxSelectableFiles}
          />
        );

      case 'global':
        return (
          <GlobalMediaBrowser
            key={selectedAccountId}
            handleSelected={handleSelected}
            selectableFileTypes={selectableFileTypes}
            maxSelectableSize={maxSelectableSize}
            maxSelectableFiles={maxSelectableFiles}
          />
        );

      case 'favorites':
        return (
          <FavoritesMediaBrowser
            key={selectedAccountId}
            accountId={selectedAccountId}
            handleSelected={handleSelected}
            selectableFileTypes={selectableFileTypes}
            maxSelectableSize={maxSelectableSize}
            maxSelectableFiles={maxSelectableFiles}
          />
        );

      case 'deleted':
        return (
          <DeletedMediaBrowser
            key={selectedAccountId}
            accountId={selectedAccountId}
          />
        );

      default:
        break;
    }
  }, [
    activeLibrary.key,
    selectedAccountId,
    handleSelected,
    selectableFileTypes,
    maxSelectableSize,
    maxSelectableFiles,
  ]);

  if (loading || !selectedAccountId) return (<p>Loading...</p>);

  const { accounts } = data.currentUser;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="spillover-media-library sml-flex sml-h-full sml-justify-center sml-items-center">
        <div className="sml-w-full sml-h-full sml-flex">
          <Sidebar
            libraries={libraries}
            icons={icons}
            activeLibrary={activeLibrary}
            setActiveLibrary={setActiveLibrary}
          />

          <div className="sml-w-full sml-h-full">
            <div className="sml-flex sml-bg-gray-50 sml-flex-col sml-w-full sml-pb-0.5 sml-border-b sml-border-spillover-color3 sml-h-14">
              <div className="sml-flex sml-justify-evenly sml-py-2">
                <AccountSwitcher
                  accounts={accounts}
                  selectedAccountId={selectedAccountId}
                  setSelectedAccountId={setSelectedAccountId}
                />
              </div>
            </div>

            <div className="sml-p-2 sml-h-[calc(100%_-_4rem)]">
              { browser }
            </div>
          </div>

          <ToastContainer position="bottom-right" autoClose={2500} />
        </div>
      </div>
    </DndProvider>
  );
}

export default MediaLibraryContainer;
