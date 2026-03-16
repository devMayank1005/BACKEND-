import React, { useState } from "react";
import "../style/login.scss";
import FormGroup from "../components/FormGroup";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        await handleLogin({ email, password });
        navigate("/");
    }

  return (
    <main className="login-page">
        <div className="form-container">
            <div className="auth-header">
                <span className="auth-header__eyebrow">Welcome Back</span>
                <h1>Sign in to Moodify</h1>
                <p>Access your mood-based music space with your email and password.</p>
            </div>

            <form onSubmit= {handleSubmit}>

                <FormGroup 
                id="login-email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email Address"
                type="email"
                autoComplete="email"
                placeholder="name@example.com" />

                <FormGroup
                id="login-password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password" />

                <button className='button' type='submit'>Sign In</button>

                <div className="form-group form-group--footer">
                    <p>Don&apos;t have an account?</p>
                    <Link to="/register">Create one</Link>
                </div>

            </form>
        </div>
    </main>
  );
};

export default Login;
