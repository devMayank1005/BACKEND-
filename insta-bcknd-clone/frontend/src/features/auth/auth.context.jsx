import { createContext,useState,useEffect} from "react";
import {login,register,logout} from './services/auth.api'

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

   const handleLogin = async (username,password) => {
        const res = await login(username,password)
        setUser(res.user)
    }
    const handleRegister = async (username,email,password) => {
        const res = await register(username,email,password)
        setUser(res.user)
    }
    const handleLogout = async () => {
        await logout()
        setUser(null)
    }

 



    return (
        <AuthContext.Provider value={{user,loading,handleLogin,handleRegister,handleLogout}}>
            {children}
        </AuthContext.Provider>
    )       
}