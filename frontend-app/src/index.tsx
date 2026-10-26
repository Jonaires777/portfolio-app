import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import NewFornecedor from './components/pages/NewFornecedor';
import EditFornecedor from './components/pages/EditFornecedor';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import ForgotPassword from './components/pages/ForgotPassword';
import ResetPassword from './components/pages/ResetPassword';
import OAuthCallback from './components/pages/OAuthCallback';
import RequireAuth from './components/common/RequireAuth';
import { AuthProvider } from './contexts/AuthContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/create",
    element: <RequireAuth><NewFornecedor /></RequireAuth>
  },
  {
    path: "/edit/:id",
    element: <RequireAuth><EditFornecedor /></RequireAuth>
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  },
  {
    path: "/oauth/callback",
    element: <OAuthCallback />
  },
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
