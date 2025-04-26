import { useState } from "react"
import Swal from "sweetalert2"
import { useUser } from "../context/UserContext"

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pass: "",
    confirmPass: "",
  })

  const { register, setToken } = useUser()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            formData.name.trim() === "" ||
            formData.email.trim() === "" ||
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

        try {
            await register(formData.name, formData.email, formData.pass);
            Swal.fire({
                title: "Success!",
                text: "Registration completed successfully.",
                icon: "success",
                confirmButtonText: "OK",
            }).then((result) => {
                if (result.isConfirmed) {
                    setToken(true);
                }
            });
        } catch {
            Swal.fire({
                title: "Error!",
                text: "There was a problem with your registration. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="register-form container mt-5 p-4 border rounded">
            <div className="form-group mb-3">
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group mb-3">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group mb-3">
                <label htmlFor="pass">Password:</label>
                <input
                    type="password"
                    name="pass"
                    id="pass"
                    className="form-control"
                    value={formData.pass}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group mb-3">
                <label htmlFor="confirmPass">Confirm Password:</label>
                <input
                    type="password"
                    name="confirmPass"
                    id="confirmPass"
                    className="form-control"
                    value={formData.confirmPass}
                    onChange={handleChange}
                />
            </div>
            <button type="submit" className="btn btn-primary w-100">
                Register
            </button>
        </form>
    );
};

export default RegisterForm

