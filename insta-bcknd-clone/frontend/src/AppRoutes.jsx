import {BrowserRouter, Routes, Route} from 'react-router-dom'
import LoginForm from './features/auth/pages/Login'
import RegisterForm from './features/auth/pages/Register'

function AppRoutes() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginForm />} />
        <Route path='/register' element={<RegisterForm />} />
      </Routes>
    </BrowserRouter>
  )}

export default AppRoutes
