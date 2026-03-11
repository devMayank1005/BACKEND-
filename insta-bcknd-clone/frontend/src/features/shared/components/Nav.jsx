
import React from 'react'
import "../nav.scss"
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'

const Nav = () => {
    const navigate = useNavigate()
    const { user, handleLogout } = useAuth()
    
    
  return (
    <nav className='nav-bar' >
        <p>Insta</p>
        {user ? (
          <div>
            <button
             onClick={()=>{navigate("/create-post")}}
             className='button primary-button' >new post</button>
            <button
              onClick={async ()=>{
                await handleLogout()
                navigate('/login')
              }}
              className='button' >logout</button>
          </div>
        ) : (
          <button
            onClick={()=>{navigate('/login')}}
            className='button primary-button' >login</button>
        )}
    </nav>
  )
}

export default Nav
