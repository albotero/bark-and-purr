import { createContext, useContext, useState } from "react"
import PropTypes from "prop-types";
import Swal from "sweetalert2";

const UserContext = createContext()

export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [token, setToken] = useState(false);

// Login
const login = async (email, pass) => {
  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password: pass
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Guarda el token en localStorage
    localStorage.setItem("token", data.token);
    setToken(true);

    return { success: true, user: data.user };
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: err.message };
  }
};



const register = async (name, lastName, email, birthday, password) => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            surname: name,
            last_name: lastName,
            email,
            birthday,
            password
          })
        })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Registration failed")
        }
      
      localStorage.setItem("token", data.token)
      setToken(true)
      Swal.fire({
        icon: "success",
        title: "Registration successful",
        text: "You have been registered successfully.",
        timer: 2000,
        showConfirmButton: true,
      })
      return { success: true, user: data }
    } catch (err) {
      console.error("Registration error:", err)
      return { success: false, message: err.message }
  }


}; 
  

const logout = () => {
  localStorage.removeItem("token")
  setToken(false)

  Swal.fire({
    icon: "success",
    title: "Logged out",
    text: "You have been logged out successfully.",
    timer: 2000,
    showConfirmButton: true,
  })
}

  
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
