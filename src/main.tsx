import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import FeedbackForm from './pages/FeedbackForm.tsx';
import Feedbacks from './pages/Feedbacks.tsx';
import Login from './pages/Login.tsx';
import Root from './pages/Root.tsx';
import Users from './pages/Users.tsx';
import Instructions from './pages/Instructions.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'feedbacks',
        element: <Feedbacks />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: '/instructions',
        element: <Instructions />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forms',
    element: <FeedbackForm />,
  },

  {
    path: '*',
    element: <div>404 Not Found</div>,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
