"use client";

import { GoogleOneTap } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function GoogleOneTapClient() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null; // Don't render until client is hydrated

  return <GoogleOneTap />;
}