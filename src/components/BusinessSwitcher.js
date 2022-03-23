import React from "react";
import Select from "react-select";

function BusinessSwitcher({
  businessList,
  selectedBusinessId,
  setSelectedBusinessId,
}) {
  const businessToOption = () => {
    if (businessList && businessList.length > 0) {
      return businessList.map((b) => ({
        value: b.id,
        label: b.label,
      }));
    }

    return [];
  };

  const businessOptions = businessToOption();

  const selectedOption = businessOptions.find(
    (option) => option.value === selectedBusinessId
  );

  const changeBusiness = (option) => {
    console.log("DEBUG_OPTION_SELECTED: ", option);
    if (option) {
      setSelectedBusinessId(option.value);
    }
  };

  return (
    <Select
      className="business-select w-1/2"
      classNamePrefix="business-select-options"
      defaultValue={businessOptions[0]}
      value={selectedOption}
      onChange={changeBusiness}
      options={businessOptions}
    />
  );
}

export default BusinessSwitcher;
