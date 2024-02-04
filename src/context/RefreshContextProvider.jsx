import { createContext, useState } from "react";

export const RefreshContext = createContext(null);
const RefreshContextProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(0);

  return (
    <RefreshContext.Provider value={{ refresh, setRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

export default RefreshContextProvider;
