import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { appRoutes } from './router/routes';

import './styles/global.css';

const router = createBrowserRouter(appRoutes);

export function App() {
  return <RouterProvider router={router} />;
}
