import { useContext } from "react";
import { userContext } from "../context/userContext";

// Hook to use UserContext
const useUser = () => useContext(userContext);

export default useUser;
