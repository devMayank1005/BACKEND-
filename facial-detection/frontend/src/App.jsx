import{RouterProvider} from 'react-router';
import {router} from './app.route';
import"./features/shared/styles/global.scss"
import { AuthProvider } from './features/auth/auth.context';  

function App () {
  return (
    <AuthProvider>
    <RouterProvider router={router}>
    </RouterProvider>
    </AuthProvider>
  );
};

export default App