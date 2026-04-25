import { createContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState("Arjun");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <UserContext.Provider
      value={{ username, isLoggedIn, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;