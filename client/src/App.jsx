import "./App.css"
// import LogWithGoogle from "./pages/loginWithGoogle";
import {Routes, Route, Router} from 'react-router-dom';
import AboutUser from "./pages/AboutUser";
import PhoneAuth from "./pages/continueWithPhoneNumber";
  import { ToastContainer, toast } from 'react-toastify';
import EmailLogin from "./pages/ContinueWithEmail";
import FaceCapture from "./pages/FaceCapture";

function App() {
  return (
    <div className='text-3xl '>
 
<ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored" // or "dark"
  toastStyle={{
    fontSize: "1rem",
    borderRadius: "8px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.1)"
  }}
/>

      <Routes>
        <Route path="/" element={< FaceCapture/>} />
        <Route path="/about-user" element={<AboutUser/>} />
        <Route path="/login" element={<h1>Login</h1>} />
        <Route path="/register" element={<h1>Register</h1>} />
         <Route path="/login/phone" element={< PhoneAuth/>} />
         <Route path="/register/email" element={<EmailLogin/>} />
      </Routes>
    </div>
  )
}

export default App;