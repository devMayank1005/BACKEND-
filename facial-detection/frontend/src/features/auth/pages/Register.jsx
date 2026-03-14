import React from 'react'
import "../style/register.scss"
import FormGroup from '../components/FormGroup'
import { Link } from 'react-router'

const Register = () => {
  return (
    <main className='register-page'>
        <div className="form-container">
            <h1>Register</h1>
            <form>
              <FormGroup lable="Name" placeholder="Enter your name" />
                <FormGroup lable="Email" placeholder="Enter your email" />
                <FormGroup lable="Password" placeholder="Enter your password" />
                <button className='button' type='submit'>Register</button>                
                <div classNmae = "form-group">
                    <p>Already have an account? <a href="/login">Login</a></p>
                </div>
            </form>
        </div>
    </main>
  )
}

export default Register
