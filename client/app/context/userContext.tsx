"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  userId: string | null;
  setUserId: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserIdState] = useState<string | null>(null);

  useEffect(() => {
    // Load userId from localStorage on mount
    const storedId = localStorage.getItem("userId");
    if (storedId) setUserIdState(storedId);
  }, []);

  const setUserId = (id: string) => {
    localStorage.setItem("userId", id); // persist
    setUserIdState(id);
  };

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
