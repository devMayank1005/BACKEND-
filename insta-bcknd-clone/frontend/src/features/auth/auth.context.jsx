import { createContext,useState,useEffect} from "react";
import { login, register, logout, getMe as getMeApi } from './services/auth.api' 
export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

   const handleLogin = async (username,password) => {
        const res = await login(username,password)
        if(res?.user){
            setUser(res.user)
        }
        return res
    }
    const handleRegister = async (username,email,password) => {
        const res = await register(username,email,password)
        if(res?.user){
            setUser(res.user)
        }
        return res
    }
    const handleLogout = async () => {
        await logout()
        setUser(null)
    }

    const getMe = async () => {
        try {
            const res = await getMeApi()
            if(res?.user){
                setUser(res.user)
            }else{
                setUser(null)
            }
        } catch (error) {
            setUser(null)
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        getMe()
    },[])   

 



    return (
        <AuthContext.Provider value={{user,loading,handleLogin,handleRegister,handleLogout,getMe}}>
            {children}
        </AuthContext.Provider>
    )       
}