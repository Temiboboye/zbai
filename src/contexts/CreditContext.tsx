'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface CreditContextType {
    balance: number;
    loading: boolean;
    refreshBalance: () => Promise<void>;
    deductCredits: (amount: number) => void;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export function CreditProvider({ children }: { children: ReactNode }) {
    const { token, isAuthenticated } = useAuth();
    const [balance, setBalance] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchBalance = async () => {
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch('/api/credits/balance', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setBalance(data.credits_remaining || 0);
            }
        } catch (error) {
            console.error('Failed to fetch balance:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshBalance = async () => {
        await fetchBalance();
    };

    const deductCredits = (amount: number) => {
        setBalance(prev => Math.max(0, prev - amount));
    };

    useEffect(() => {
        if (isAuthenticated && token) {
            fetchBalance();
        }
    }, [isAuthenticated, token]);

    return (
        <CreditContext.Provider value={{ balance, loading, refreshBalance, deductCredits }}>
            {children}
        </CreditContext.Provider>
    );
}

export function useCredits() {
    const context = useContext(CreditContext);
    if (context === undefined) {
        throw new Error('useCredits must be used within a CreditProvider');
    }
    return context;
}
