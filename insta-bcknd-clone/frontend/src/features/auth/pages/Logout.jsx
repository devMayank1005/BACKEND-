import { useNavigate } from 'react-router-dom'
import { logout } from '../../auth/services/auth.api'

const Logout = () => {
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Logout
