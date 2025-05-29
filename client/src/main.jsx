import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
//<GoogleOAuthProvider clientId="<your_client_id>">...</GoogleOAuthProvider>;
createRoot(document.getElementById('root')).render(

    <BrowserRouter>
    <GoogleOAuthProvider clientId="894244013404-shsv1ml0rgs7f5lqtgk6smksm6br8p0t.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
  </BrowserRouter>
)
