import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
//<GoogleOAuthProvider clientId="<your_client_id>">...</GoogleOAuthProvider>;
createRoot(document.getElementById('root')).render(

    <BrowserRouter>
    <GoogleOAuthProvider clientId="875149967848-fn9v6r86bjcopfevdo2mvs69raq6rioi.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
  </BrowserRouter>
)
