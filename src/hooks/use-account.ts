import { useContext } from "react";
import { AccountContext } from "@/context/account-context";

export function useAccount() {
    const accountContext = useContext(AccountContext);
    if (!accountContext) {
        throw new Error("useAccount debe ser usado dentro de un AccountProvider");
    }
    return accountContext;
}
