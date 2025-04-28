import { createContext, useState } from "react";
import axios from "axios";

// Create the context
const userContext = createContext();

//Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: null,
    email: null,
    id: null,
  });
  const [token, setToken] = useState(localStorage.getItem("jwt_token") || null);

  //Login Function
  const login = (userData, token) => {
    setUser({ name: userData.name, email: userData.email, id: userData.id });
    setToken(token);
    localStorage.setItem("jwt_token", token);
  };

  //Logout Function
  const logout = () => {
    setUser({ name: null, email: null, id: null });
    setToken(null);
    localStorage.removeItem("jwt_token");
  };

  //Function to handle login using the backend
  const loginRequest = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login", //Backend endpoint
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      const { token, user } = response.data;
      login(user, token);
    } catch (error) {
      console.error("Error de login:", error);
    }
  };

  //Function to fetch the user profile
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
    }
  };
  return (
    <userContext.Provider
      value={{ user, token, login, logout, loginRequest, fetchUserProfile }}
    >
      {children}
    </userContext.Provider>
  );
};
export default userContext;
