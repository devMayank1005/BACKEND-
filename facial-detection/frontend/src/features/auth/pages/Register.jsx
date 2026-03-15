import React, { useState } from "react";
import "../style/register.scss";
import FormGroup from "../components/FormGroup";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Register = () => {

  const { handleRegister } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await handleRegister({
        username: name,
        email,
        password,
      });

      // redirect to home page after successful registration
      navigate("/");

    } catch (error) {
      console.error("Registration error:", error);
    }
  }

  return (
    <main className="register-page">
      <div className="form-container">
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>

          <FormGroup
            label="Name"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
          />

          <FormGroup
            label="Email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormGroup
            label="Password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="button" type="submit">
            Register
          </button>

          <div className="form-group">
            <p>
              Already have an account?{" "}
              <Link to="/login">Login</Link>
            </p>
          </div>

        </form>
      </div>
    </main>
  );
};

export default Register;

