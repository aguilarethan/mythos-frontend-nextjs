import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

export function useAuth() {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return authContext;
}