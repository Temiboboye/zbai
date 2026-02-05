"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { CreditProvider } from "@/contexts/CreditContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <CreditProvider>
                {children}
            </CreditProvider>
        </AuthProvider>
    );
}
