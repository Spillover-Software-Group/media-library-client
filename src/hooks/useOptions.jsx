import { createContext, useContext } from 'react';

const context = createContext({});

const useOptions = () => useContext(context);

function OptionsProvider({ children, options = {} }) {
  return <context.Provider value={options}>{children}</context.Provider>;
}

export default useOptions;
export { OptionsProvider };
