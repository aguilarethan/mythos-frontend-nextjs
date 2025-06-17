"use client"

import { createContext, useEffect, useState } from "react";
import { getAccount } from "@/services/account/account-service";
import { Account } from "@/services/account/account-interfaces";

interface AccountContextType {
  account: Account | null;
  setAccount: (account: Account | null) => void;
  isLoading: boolean;
}

export const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAccount()
      .then(setAccount)
      .catch(() => setAccount(null))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AccountContext.Provider value={{ account, setAccount, isLoading }}>
      {children}
    </AccountContext.Provider>
  );
};