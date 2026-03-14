import React from 'react'
import "../style/login.scss"
import FormGroup from '../components/FormGroup'
import { Link } from 'react-router'

const Login = () => {
  return (
    <main className='login-page'>
        <div className="form-container">
            <h1>Login</h1>
            <form>
                <FormGroup lable="Email" placeholder="Enter your email" />
                <FormGroup lable="Password" placeholder="Enter your password" />
                <button className='button' type='submit'>Login</button>                
                <div classNmae = "form-group">
                    <p>Don't have an account? <a href="/register">Register</a></p>
                </div>
            </form>
        </div>
    </main>
  )
}

export default Login
