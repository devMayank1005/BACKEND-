import React, { useState } from 'react'
import '../styles/form.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Login = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const { handleLogin } = useAuth()

  async function handleSubmit(e){
    e.preventDefault()

    try {

      const res = await handleLogin(username, password)

      if(!res) return

      console.log("Login success", res)

      // redirect to home page
      navigate('/')

    } catch (error) {

      console.log(error.response?.data?.message)

    }
  }

  return (
    <main>
      <div className='form-container'>
        <div className="logo">Instagram</div>
        <div className="form-title">Sign up to see photos and videos from your friends.</div>

        <form onSubmit={handleSubmit}>

          <input
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
          />

          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button type='submit' className="button">Log In</button>

        </form>

        <div className="divider">
          <span>OR</span>
        </div>
        
        <div className="facebook-login">
          Log in with Facebook
        </div>
        
        <div className="forgot-password">
          Forgot password?
        </div>
      </div>
      
      <div className="signup-link">
        <span>
          Don't have an account? <Link to="/register">Sign up</Link>
        </span>
      </div>
    </main>
  )
}

export default Login