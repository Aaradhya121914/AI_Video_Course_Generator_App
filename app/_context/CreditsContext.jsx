'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

const CreditsContext = createContext();

export function CreditsProvider({ children }) {
  const { user } = useUser();
  const [currentCredits, setCurrentCredits] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add a trigger to force refresh

  const refreshCredits = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    try {
      const response = await fetch('/api/get-user-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.primaryEmailAddress.emailAddress }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentCredits(data.credits);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  // Fetch credits on mount or when refreshTrigger changes
  useEffect(() => {
    refreshCredits();
  }, [user?.primaryEmailAddress?.emailAddress, refreshTrigger]);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1); // Increment to trigger refresh
  };

  return (
    <CreditsContext.Provider value={{ currentCredits, refreshCredits, triggerRefresh }}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  return useContext(CreditsContext);
}