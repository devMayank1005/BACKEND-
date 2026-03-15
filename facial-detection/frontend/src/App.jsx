import{RouterProvider} from 'react-router';
import {router} from './app.route';
import"./features/shared/styles/global.scss"
import { AuthProvider } from './features/auth/auth.context';  
import { SongContextProvider } from './features/home/song.context';

function App () {
  return (
    <AuthProvider>
      <SongContextProvider>
    <RouterProvider router={router}>
    </RouterProvider>
    </SongContextProvider>
    </AuthProvider>
  );
};

export default App