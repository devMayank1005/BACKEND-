import React from 'react'
import  '../styles/form.scss'
import { Link } from 'react-router'
import axios from 'axios'
import { useState } from 'react'
const Login = () => {

  const  [username, setUsername] = useState('')
  const  [password, setPassword] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login',{
        username,
        password
      },{
        withCredentials: true
        
      })
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <main>
      <div className='container'>
        <h1>Login</h1>
        <form>
            <input
            onInput={(e)=>setUsername(e.target.value)}
             type='text' placeholder='Username' />
            <input 
            onInput={(e)=>setPassword(e.target.value)} 
            type='password' placeholder='Password' />
          <button type='submit'>Login</button>
        </form>
        <p>Don't have an account? <Link className='toogleAuthForm' to="/register">Register</Link></p>
      </div>
    </main>
  )
}

export default Login
