import Select from "react-select";

function AccountSwitcher({
  accounts,
  selectedAccountId,
  setSelectedAccountId,
}) {
  const options = accounts.map((a) => ({ value: a.id, label: a.name }));

  const selectedOption = options.find((o) => o.value === selectedAccountId);

  return (
    <Select
      className="sml-business-select sml-w-1/2"
      classNamePrefix="sml-business-select-options"
      defaultValue={options[0]}
      value={selectedOption}
      onChange={(o) =>  setSelectedAccountId(o.value)}
      options={options}
    />
  );
}

export default AccountSwitcher;
