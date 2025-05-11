import { Navigate } from "react-router-dom"
import { useUser } from "../context/UserContext"
import Swal from "sweetalert2"

const ProtectedRoute = ({ children }) => {
  const { token } = useUser()

  if (!token) {

    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
