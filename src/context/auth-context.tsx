"use client"

import { ReactNode, createContext, useEffect, useState } from "react"
import { checkAuth } from "@/services/auth/auth-service"

interface AuthContextType {
    isLoggedIn: boolean
    setIsLoggedIn: (value: boolean) => void
    isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth()
            .then(() => setIsLoggedIn(true))
            .catch(() => setIsLoggedIn(false))
            .finally(() => setIsLoading(false))
    }, [])

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}
