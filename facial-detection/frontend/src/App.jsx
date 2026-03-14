import{RouterProvider} from 'react-router';
import {router} from './app.route';
import"./features/shared/styles/global.scss"

function App () {
  return (
    <RouterProvider router={router}>

    </RouterProvider>
  );
};

export default App