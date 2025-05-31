import "./App.css";
import { Routes, Route } from "react-router-dom";
import AboutUser from "./pages/AboutUser";
import PhoneAuth from "./pages/continueWithPhoneNumber";
import { ToastContainer } from "react-toastify";
import EmailLogin from "./pages/ContinueWithEmail";
import FaceCapture from "./pages/FaceCapture";
import AdminFaceUpload from "./pages/AdminUpload";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ import


function App() {
  return (
    <AuthProvider>
      <div className="text-3xl">
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
          theme="colored"
          toastStyle={{
            fontSize: "1rem",
            borderRadius: "8px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
          }}
        />
        <Navbar />
        <Routes>
          {/* 🛡️ Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/login/phone" element={<PhoneAuth />} />
          <Route path="/register/email" element={<EmailLogin />} />

          {/* 🔐 Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <FaceCapture />
              </ProtectedRoute>
            }
          />

          
          <Route
             path="/admin-upload"
             element={
             <ProtectedRoute requireAdmin={true}>
            <AdminFaceUpload />
             </ProtectedRoute>
              }
             />
          <Route
            path="/about-user"
            element={
              <ProtectedRoute>
                <AboutUser />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
