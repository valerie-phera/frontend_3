import { createContext, useContext, useEffect, useState } from "react";

const HistoryContext = createContext(undefined);

export const HistoryProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem("phScannerHistory");
      const parsed = raw ? JSON.parse(raw) : [];
      return parsed.map((it, i) => ({
        ...it,
        itemId: it.itemId || `legacy-${i}-${it.createdAt ?? 0}`,
      }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("phScannerHistory", JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addResults = (results) => {
    if (!results || results.length === 0) return;

    const flattened = results.map((r, i) => ({
      ...r,
      createdAt: r.createdAt ?? Date.now(),
      itemId: `item-${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`,
    }));

    setItems((prev) => [...flattened, ...prev]);
  };

  const removeItem = (itemId) => {
    setItems((prev) => prev.filter((it) => it.itemId !== itemId));
  };

  return (
    <HistoryContext.Provider value={{ items, addResults, removeItem }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const ctx = useContext(HistoryContext);
  if (!ctx) {
    throw new Error("useHistory must be used within HistoryProvider");
  }
  return ctx;
};

