import { useState } from "react"
import Swal from "sweetalert2"
import { useUser } from "../context/UserContext"
import { useNavigate, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

const Login = () => {
  const [formData, setFormData] = useState({
    // Test credentials
    email: "test@example.com",
    pass: "123456",
  })

  const { t } = useTranslation("auth")
  const { login, setToken } = useUser()
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
        title: t("alert.error"),
        text: t("alert.complete_fields"),
        icon: "error",
        confirmButtonText: t("alert.ok"),
      })
      return
    }

    const result = await login(formData.email, formData.pass)

    if (result.success) {
      Swal.fire({
        title: t("alert.success"),
        text: t("alert.login_completed"),
        icon: "success",
        confirmButtonText: t("alert.go_home"),
      }).then(() => {
        setToken(true)
        navigate("/")
      })
    } else {
      Swal.fire({
        title: t("alert.error"),
        text: result.message || t("alert.wrong_credentials"),
        icon: "error",
        confirmButtonText: t("alert.ok"),
      })
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="p-5 border rounded" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">{t("login")}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              {t("form.email")}
            </label>
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
            <label htmlFor="pass" className="form-label mb-0">
              {t("form.password")}
            </label>
            <Link to="/forgot-password" className="small" style={{ fontSize: "0.9em" }}>
              {t("form.forgot_password")}
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
              {t("form.remember_me")}
            </label>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            {t("login")}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
