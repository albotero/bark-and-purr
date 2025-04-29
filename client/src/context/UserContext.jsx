import { createContext, useContext, useState } from "react"
import PropTypes from "prop-types";

const UserContext = createContext()

export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [token, setToken] = useState(false);

  const login = async (email, pass) => {

    if (email === "test@example.com" && pass === "123456") {
      setToken(true);
      return { success: true };
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  };


  const register = async (name, lastName, email, birthday, password) => {
    console.log("Registering user:", { name, lastName, email, birthday, password });
    // Cuando construyamos la API debemos poner la lógica acá
    return { success: true };
  }; 
  

  const logout = () => {
    setToken(false); 
  };
  

  
  const context = {
    token,
    setToken, 
    login,
    register,
    logout
  };
  

  return (
    <UserContext.Provider value={context}>
      {children}
    </UserContext.Provider>
  );
};


UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserProvider;
