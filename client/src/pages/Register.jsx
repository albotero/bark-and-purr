import { useState } from "react"
import Swal from "sweetalert2"
import { useUser } from "../context/UserContext"
import {useNavigate,  Link } from "react-router-dom";


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

  const { register, setToken } = useUser()

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };
    const navigate = useNavigate(); 
    const handleSubmit = async (e) => {
        

        e.preventDefault();

        if (
            formData.name.trim() === "" ||
            formData.lastName.trim() === "" ||
            formData.email.trim() === "" ||
            formData.birthday.trim() === "" ||
            formData.pass.trim() === "" ||
            formData.confirmPass.trim() === ""
        ) {
            Swal.fire({
                title: "Error!",
                text: "You must complete all the fields.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        if (formData.pass !== formData.confirmPass) {
            Swal.fire({
                title: "Error!",
                text: "Passwords do not match.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        if (!formData.acceptTerms) {
            Swal.fire({
              title: "Error!",
              text: "You must accept the Terms and Privacy Policy.",
              icon: "error",
              confirmButtonText: "OK",
            });
            return;
        }

        try {
            await register(formData.name, formData.lastName, formData.email, formData.birthday, formData.pass);
            Swal.fire({
                title: "Success!",
                text: "Registration completed successfully.",
                icon: "success",
                confirmButtonText: "OK",
              }).then((result) => {
                if (result.isConfirmed) {
                  setToken(true);
                  navigate("/"); 
                }              
            });
        } catch {
            setToken(false);
            Swal.fire({
                title: "Error!",
                text: "There was a problem with your registration. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
          <div className="p-5 border rounded" style={{ backgroundColor: "white", width: "100%", maxWidth: "600px" }}>
            <h2 className="text-center mb-4">Register</h2>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="name" className="form-label">Name</label>
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
                  <label htmlFor="lastName" className="form-label">Last Name</label>
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
                  <label htmlFor="email" className="form-label">Email address</label>
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
                  <label htmlFor="birthday" className="form-label">Birthday</label>
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
                  <label htmlFor="pass" className="form-label">Password</label>
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
                  <label htmlFor="confirmPass" className="form-label">Repeat Password</label>
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
                  I accept <Link to="/terms">T&amp;C</Link> and <Link to="/privacy">privacy policy</Link>
                </label>
              </div>
    
              <button type="submit" className="btn btn-primary w-100 mb-2">
                Register
              </button>
    
              <div className="text-center">
                Already registered? <Link to="/login">Sign in</Link>
              </div>
            </form>
          </div>
        </div>
      );
};

export default RegisterForm

