import { useState } from "react"
import Swal from "sweetalert2"
import { useUser } from "../context/UserContext"
import { useNavigate, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    birthday: "",
    pass: "",
    confirmPass: "",
    acceptTerms: false,
  })

  const { t } = useTranslation("auth")
  const { register, setToken } = useUser()
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      formData.name.trim() === "" ||
      formData.lastName.trim() === "" ||
      formData.email.trim() === "" ||
      formData.birthday.trim() === "" ||
      formData.pass.trim() === "" ||
      formData.confirmPass.trim() === ""
    ) {
      Swal.fire({
        title: t("alert.error"),
        text: t("alert.complete_fields"),
        icon: "error",
        confirmButtonText: t("alert.ok"),
      })
      return
    }

    if (formData.pass !== formData.confirmPass) {
      Swal.fire({
        title: t("alert.error"),
        text: t("alert.passwords_dont_match"),
        icon: "error",
        confirmButtonText: t("alert.ok"),
      })
      return
    }

    if (!formData.acceptTerms) {
      Swal.fire({
        title: t("alert.error"),
        text: t("alert.accept_terms_privacy"),
        icon: "error",
        confirmButtonText: t("alert.ok"),
      })
      return
    }

    try {
      await register(formData.name, formData.lastName, formData.email, formData.birthday, formData.pass)
      Swal.fire({
        title: t("alert.success"),
        text: t("alert.register_completed"),
        icon: "success",
        confirmButtonText: t("alert.ok"),
      }).then((result) => {
        if (result.isConfirmed) {
          setToken(true)
          navigate("/")
        }
      })
    } catch {
      setToken(false)
      Swal.fire({
        title: t("alert.error"),
        text: t("alert.register_error"),
        icon: "error",
        confirmButtonText: t("alert.ok"),
      })
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="p-5 border rounded" style={{ backgroundColor: "white", width: "100%", maxWidth: "600px" }}>
        <h2 className="text-center mb-4">{t("register")}</h2>
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col">
              <label htmlFor="name" className="form-label">
                {t("form.name")}
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <label htmlFor="lastName" className="form-label">
                {t("form.lastname")}
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                className="form-control"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
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
            <div className="col">
              <label htmlFor="birthday" className="form-label">
                {t("form.birthday")}
              </label>
              <input
                type="date"
                name="birthday"
                id="birthday"
                className="form-control"
                value={formData.birthday}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label htmlFor="pass" className="form-label">
                {t("form.password")}
              </label>
              <input
                type="password"
                name="pass"
                id="pass"
                className="form-control"
                value={formData.pass}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <label htmlFor="confirmPass" className="form-label">
                {t("form.repeat_password")}
              </label>
              <input
                type="password"
                name="confirmPass"
                id="confirmPass"
                className="form-control"
                value={formData.confirmPass}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="acceptTerms">
              {t("form.accept")}
              <Link to="/terms">{t("form.tc")}</Link>
              {t("form.and")}
              <Link to="/privacy">{t("form.privacy")}</Link>
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-2">
            {t("register")}
          </button>

          <div className="text-center mt-2">
            {t("form.already_registered")}
            <Link to="/login" className="ms-2">
              {t("login")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterForm
