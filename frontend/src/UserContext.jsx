import { createContext, useEffect, useState } from "react";
import api from "./api/api";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Check if user is logged in via the cookie
    if (!user) {
      api.get("/auth/profile").then(({ data }) => {
        setUser(data);
        setReady(true);
      }).catch(() => {
        setReady(true); 
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}