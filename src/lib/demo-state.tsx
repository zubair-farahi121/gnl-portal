"use client";

import { createContext, useContext, useEffect, useState } from "react";

type DemoState = {
  verified: boolean;
  setVerified: (v: boolean) => void;
  reset: () => void;
};

const Ctx = createContext<DemoState | null>(null);
const KEY = "gnl-demo-verified";

export function DemoStateProvider({ children }: { children: React.ReactNode }) {
  const [verified, setVerifiedState] = useState(false);

  useEffect(() => {
    try {
      setVerifiedState(sessionStorage.getItem(KEY) === "1");
    } catch {
      /* private mode — the demo still works, it just does not persist across reloads */
    }
  }, []);

  const setVerified = (v: boolean) => {
    setVerifiedState(v);
    try {
      sessionStorage.setItem(KEY, v ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  return (
    <Ctx.Provider
      value={{ verified, setVerified, reset: () => setVerified(false) }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useDemoState() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDemoState must be used inside DemoStateProvider");
  return v;
}
