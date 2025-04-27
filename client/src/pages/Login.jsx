import { useState } from "react"
import Swal from "sweetalert2"
import { useUser } from "../context/UserContext"
import { useNavigate, Link } from "react-router-dom"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    pass: "",
  })

  const { login , setToken} = useUser()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.email.trim() === "" || formData.pass.trim() === "") {
      Swal.fire({
        title: "Error!",
        text: "Please complete all required fields",
        icon: "error",
        confirmButtonText: "OK",
      })
      return
    }

    const result = await login(formData.email, formData.pass)

    if (result.success) {
        Swal.fire({
          title: "Success!",
          text: "Login completed successfully",
          icon: "success",
          confirmButtonText: "Go to Home",
        }).then(() => {
          setToken(true); 
          navigate("/");
        });
      
    } else {
      Swal.fire({
        title: "Error!",
        text: result.message || "Incorrect email or password. Please try again",
        icon: "error",
        confirmButtonText: "OK",
      })
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" >
      <div className="p-5 border rounded" style={{ backgroundColor: "white", width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2 d-flex justify-content-between align-items-center">
            <label htmlFor="pass" className="form-label mb-0">Password</label>
            <Link to="/forgot-password" className="small" style={{ fontSize: "0.9em" }}>
              Forgot password?
            </Link>
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="pass"
              id="pass"
              className="form-control"
              value={formData.pass}
              onChange={handleChange}
            />
          </div>
          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" id="rememberMe" />
            <label className="form-check-label" htmlFor="rememberMe">
              Remember me
            </label>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
