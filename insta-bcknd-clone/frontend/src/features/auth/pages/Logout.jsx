import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Logout = () => {
    const navigate = useNavigate()
    const { handleLogout } = useAuth()

    const onLogout = async () => {
        try {
            await handleLogout()
            navigate('/login')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <button onClick={onLogout}>Logout</button>
        </div>
    )
}

export default Logout
