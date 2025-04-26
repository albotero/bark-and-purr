import { createContext, useContext } from "react"

const userContext = createContext()

const userProvider = ({ children }) => {
  const context = {}
  return <userContext.Provider value={context}>{children}</userContext.Provider>
}

export const useUser = () => useContext(userContext)

export default userProvider
