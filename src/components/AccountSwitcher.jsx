import { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import Select from 'react-select';

import useCurrentAccountId from '../hooks/useCurrentAccountId';
import useCurrentFolderId from '../hooks/useCurrentFolderId';
import useOptions from '../hooks/useOptions';
import useCurrentMediaBrowser from '../hooks/useCurrentMediaBrowser';

const QUERY = gql`
  query GetCurrentUserWithAccounts {
    currentUser {
      id
      role
      accounts {
        id
        name
        rootFolderId
      }
    }
  }
`;

function AccountSwitcher() {
  const { onSelectedAccountChange, defaultAccountId } = useOptions();
  const [currentAccountId, setCurrentAccountId] = useCurrentAccountId();
  const [, setCurrentBrowser] = useCurrentMediaBrowser();
  const [, setCurrentFolderId] = useCurrentFolderId();
  const { loading, data } = useQuery(QUERY);

  const accounts = data?.currentUser?.accounts || [];

  const defaultAccount = accounts.find((a) => a.id === defaultAccountId);

  const changeAccount = (newAccount) => {
    if (!newAccount?.id) return;
    setCurrentBrowser('account');
    setCurrentAccountId(newAccount.id);
    setCurrentFolderId(newAccount.rootFolderId);
    if (onSelectedAccountChange) onSelectedAccountChange(newAccount.id);
  };

  useEffect(() => {
    if (!currentAccountId) changeAccount(defaultAccount || accounts[0]);
  }, [accounts, defaultAccount]);

  const currentAccount = accounts.find((a) => a.id === currentAccountId);

  return (
    <Select
      className="sml-business-select sml-w-1/2"
      classNamePrefix="sml-business-select-options"
      isLoading={loading}
      options={accounts}
      value={currentAccount}
      getOptionValue={(option) => option.id}
      getOptionLabel={(option) => option.name}
      onChange={(option) => changeAccount(option)}
    />
  );
}

export default AccountSwitcher;
