import React from 'react'
import '../styles/form.scss'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Register = () => {

  const [username, setUsername] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const { handleRegister } = useAuth()

  async function handleSubmit(e){
    e.preventDefault()

    try{
      const res = await handleRegister(username,email,password)
      console.log(res)
    }
    catch(err){
      console.log(err)
    }
  }

  return (
    <main>
      <div className="form-container"></div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input 
          onInput={(e)=>setUsername(e.target.value)}
          type='text' 
          placeholder='Username'
        />

        <input 
          onInput={(e)=>setEmail(e.target.value)}
          type='email' 
          placeholder='Email'
        />

        <input 
          onInput={(e)=>setPassword(e.target.value)}
          type='password' 
          placeholder='Password'
        />

        <button type='submit'>Register</button>
      </form>

      <p>
        Already have an account? 
        <Link className='toggleAuthForm' to="/login">Login</Link>
      </p>

    </main>
  )
}

export default Register