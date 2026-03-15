import React,{useState} from 'react'
import "../style/login.scss"
import FormGroup from '../components/FormGroup'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth';
import{useNavigate} from 'react-router';

const Login = () => {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');

    async function handleSubmit(e){
        e.preventDefault();
        await handleLogin({ email, password });
                    navigate('/'); // Redirect to home page after successful login

    }
  return (
    <main className='login-page'>
        <div className="form-container">
            <h1>Login</h1>
            <form onSubmit= {handleSubmit}>

                <FormGroup 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                lable="Email" placeholder="Enter your email" />

                <FormGroup
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                lable="Password" placeholder="Enter your password" />

                <button className='button' type='submit'>Login</button>                
                <div className = "form-group">

                    <p>Don't have an account? <a href="/register">Register</a></p>
                </div>

            </form>
        </div>
    </main>
  )
}

export default Login
