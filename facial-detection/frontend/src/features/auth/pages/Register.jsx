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
        <div className="auth-header">
          <span className="auth-header__eyebrow">Get Started</span>
          <h1>Create your account</h1>
          <p>Set up your Moodify profile to start locking moods and discovering playlists.</p>
        </div>

        <form onSubmit={handleSubmit}>

          <FormGroup
            id="register-username"
            name="username"
            value={name}
            label="Name"
            type="text"
            autoComplete="username"
            placeholder="Enter your full name"
            onChange={(e) => setName(e.target.value)}
          />

          <FormGroup
            id="register-email"
            name="email"
            value={email}
            label="Email Address"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormGroup
            id="register-password"
            name="password"
            value={password}
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="button" type="submit">
            Create Account
          </button>

          <div className="form-group form-group--footer">
            <p>Already have an account?</p>
            <Link to="/login">Sign in</Link>
          </div>

        </form>
      </div>
    </main>
  );
};

export default Register;

