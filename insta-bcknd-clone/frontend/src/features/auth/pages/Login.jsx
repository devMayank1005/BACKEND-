import React, { useState } from 'react'
import '../styles/form.scss'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../auth/services/auth.api'

const Login = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()

    try {

      const res = await login(username, password)

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
      <div className='container'>
        <h1>Login</h1>

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

          <button type='submit'>Login</button>

        </form>

        <p>
          Don't have an account?
          <Link className='toggleAuthForm' to="/register">
            Register
          </Link>
        </p>

      </div>
    </main>
  )
}

export default Login