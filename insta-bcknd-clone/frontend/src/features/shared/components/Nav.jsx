
import React from 'react'
import "../nav.scss"
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'

const Nav = () => {
    const navigate = useNavigate()
    const { user, handleLogout } = useAuth()
    
    
  return (
    <nav className='nav-bar' >
        <a href="/" className="logo">Instagram</a>
        {user ? (
          <div className="nav-buttons">
            <button
             onClick={()=>{navigate("/create-post")}}
            >Create</button>
            <button
              onClick={async ()=>{
                await handleLogout()
                navigate('/login')
              }}
            >Logout</button>
          </div>
        ) : (
          <div className="nav-buttons">
            <button
              onClick={()=>{navigate('/login')}}
            >Log In</button>
          </div>
        )}
    </nav>
  )
}

export default Nav
