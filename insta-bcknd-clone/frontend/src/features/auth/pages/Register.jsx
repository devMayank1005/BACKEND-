import React from 'react'
import '../styles/form.scss'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'

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
      <div className="form-container">
        <div className="logo">Instagram</div>
        <div className="form-title">Sign up to see photos and videos from your friends.</div>
        
        <form onSubmit={handleSubmit}>
          <input 
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            type='text' 
            placeholder='Username'
          />

          <input 
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            type='email' 
            placeholder='Email'
          />

          <input 
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            type='password' 
            placeholder='Password'
          />

          <button type='submit' className="button">Sign up</button>
        </form>
      </div>
      
      <div className="signup-link">
        <span>
          Have an account? <Link to="/login">Log in</Link>
        </span>
      </div>
    </main>
  )
}

export default Register