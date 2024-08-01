import { useEffect } from "react";
import Select from "react-select";

import useCurrentAccountId from "../hooks/useCurrentAccountId";
import useCurrentFolderId from "../hooks/useCurrentFolderId";
import useOptions from "../hooks/useOptions";
import useCurrentMediaBrowser from "../hooks/useCurrentMediaBrowser";
import useAccounts from "../hooks/useAccounts";

function AccountSwitcher() {
  const {
    showAccountSelector,
    onSelectedAccountChange,
    defaultAccountId,
    spilloverBusinessId,
    senalysisBusinessId,
  } = useOptions();

  const [, setCurrentAccountId] = useCurrentAccountId();
  const [, setCurrentBrowser] = useCurrentMediaBrowser();
  const [, setCurrentFolderId] = useCurrentFolderId();
  const { accounts, currentAccount } = useAccounts();

  const defaultAccount = accounts.find((a) => {
    if (spilloverBusinessId) {
      return a.spilloverId === spilloverBusinessId;
    } else if (senalysisBusinessId) {
      return a.senalysisBusinessId === senalysisBusinessId;
    } else {
      return a.id === defaultAccountId;
    }
  });

  const changeAccount = (newAccount) => {
    if (!newAccount?.id) return;
    setCurrentBrowser("account");
    setCurrentAccountId(newAccount.id);
    setCurrentFolderId(newAccount.rootFolderId);
    if (onSelectedAccountChange) onSelectedAccountChange(newAccount.id);
  };

  useEffect(() => {
    changeAccount(defaultAccount || accounts[0]);
  }, [accounts, defaultAccount, spilloverBusinessId, senalysisBusinessId]);

  return (
    showAccountSelector &&
    accounts.length > 1 && (
      <Select
        className="sml-business-select sml-w-1/2"
        classNamePrefix="sml-business-select-options"
        options={accounts}
        value={currentAccount}
        getOptionValue={(option) => option.id}
        getOptionLabel={(option) => option.name}
        onChange={(option) => changeAccount(option)}
      />
    )
  );
}

export default AccountSwitcher;
