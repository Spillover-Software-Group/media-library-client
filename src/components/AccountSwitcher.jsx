import { useEffect } from "react";
import Select from "react-select";
import useAccounts from "../hooks/useAccounts";
import useCurrentAccountId from "../hooks/useCurrentAccountId";
import useCurrentFolderId from "../hooks/useCurrentFolderId";
import useCurrentMediaBrowser from "../hooks/useCurrentMediaBrowser";
import useOptions from "../hooks/useOptions";

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

  // Keyed on which account it would pick, not on the accounts list: Apollo hands back a new list
  // whenever any field of any account changes in its cache (a Canva profile name arriving, say),
  // and switching again then would throw the user out of the browser they were in.
  const startingAccount = defaultAccount || accounts[0];
  useEffect(() => {
    changeAccount(startingAccount);
  }, [startingAccount?.id]);

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
