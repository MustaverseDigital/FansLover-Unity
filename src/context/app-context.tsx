import { createContext, ReactNode, useContext } from "react";
import { TonClient } from "@ton/ton";
import { useTonClient } from "@/hooks/useTonClient";
type TAppProvider = {
  children: ReactNode;
};

type AppContextProviderValue = {
  tonClient?: TonClient;
};

const AppContext = createContext<AppContextProviderValue>({
  tonClient: undefined,
});
export const AppProvider = ({ children }: TAppProvider) => {
  const { client } = useTonClient();

  return (
    <AppContext.Provider value={{ tonClient: client }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
