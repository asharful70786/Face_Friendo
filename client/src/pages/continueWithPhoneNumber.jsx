import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../components/AuthContext";

const BaseUrl = "http://localhost:3000";

const PhoneAuth = () => {
   const { checkAuth } = useAuth();
  const [step, setStep] = useState("choose");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    phone: "",
    name: "",
    otp: "",
    password: "",
    countryCode: "+91",
  });
  const [isPhoneLocked, setIsPhoneLocked] = useState(false);
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isPhoneLocked && name === "phone") return;

    if (name === "phone") {
      if (/^\d{0,10}$/.test(value)) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const sendOtp = async () => {
    if (!form.phone) return toast.error("Please enter a phone number.");
    try {
      const res = await fetch(`${BaseUrl}/user/phone/send-otp`, {
       credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.countryCode + form.phone }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "OTP sent successfully");
        setIsPhoneLocked(true);
        setStep("enter-otp");
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Something went wrong while sending OTP");
    }
  };

  const verifyOtp = async () => {
    if (!form.otp) return toast.error("Please enter the OTP.");
    try {
      const res = await fetch(`${BaseUrl}/user/phone/verify-otp`, {
       credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.countryCode + form.phone, otp: form.otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP verified, please complete registration");
        setStep("register");
      } else {
        toast.error(data.error || "OTP verification failed");
      }
    } catch (error) {
      toast.error("Something went wrong while verifying OTP");
    }
  };

  const registerUser = async () => {
    const fullPhone = form.countryCode + form.phone;
    if (!form.name || !form.password) {
      toast.error("All fields are required.");
      return;
    }
    try {
      const res = await fetch(`${BaseUrl}/user/phone/register`, {
      credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: fullPhone,
          name: form.name,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Registered and logged in!");
        await checkAuth();
        navigate("/");
           toast.warning("acc , created  - Phone login failed. Try Google login instead.", {
         autoClose: 8000, // 8 seconds
          pauseOnHover: true,
          closeOnClick: true,
          draggable: true,
       });
       alert("acc , created  - Phone login failed. Try Google login instead")
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Something went wrong during registration");
    }
  };

  const loginWithNumber = async () => {
    try {
      const res = await fetch(`${BaseUrl}/user/phone/login/number`, {
       credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: form.countryCode + form.phone,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
       
        await checkAuth();
        navigate("/");
        //  toast.success("Logged in!");
         toast.warning("Phone login failed. Try Google login instead.", {
         autoClose: 8000, // 8 seconds
          pauseOnHover: true,
          closeOnClick: true,
          draggable: true,
       });
       alert("Phone login failed. Try Google login instead")

      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      toast.error("Something went wrong during login");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 bg-slate-900 text-white p-8 rounded-2xl shadow-2xl border border-slate-700 space-y-8">
      <h2 className="text-3xl font-bold text-center mb-4">Phone Authentication</h2>

      {step === "choose" && (
        <div className="space-y-4 text-center">
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white w-full py-3 rounded-xl" onClick={() => setStep("send-otp")}>Register</button>
          <button className="bg-slate-700 hover:bg-slate-800 text-white w-full py-3 rounded-xl" onClick={() => setStep("login")}>Login</button>
        </div>
      )}

      {step === "send-otp" && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} inputMode="numeric" maxLength={10} disabled={isPhoneLocked} className={`w-full px-4 py-3 bg-slate-800/50 border-2 rounded-xl text-white focus:outline-none ${isPhoneLocked ? "bg-slate-700 cursor-not-allowed" : ""}`} placeholder="Enter your phone number" />
          <button onClick={sendOtp} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-xl">Send OTP</button>
        </div>
      )}

      {step === "enter-otp" && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">OTP Code *</label>
          <input type="text" name="otp" value={form.otp} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800/50 border-2 rounded-xl text-white focus:outline-none" placeholder="Enter the OTP" />
          <button onClick={verifyOtp} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl">Verify OTP</button>
        </div>
      )}

      {step === "register" && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800/50 border-2 rounded-xl text-white focus:outline-none" placeholder="Your full name" />
          <label className="block text-sm font-medium text-slate-300 mb-2">Password *</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800/50 border-2 rounded-xl text-white focus:outline-none" placeholder="Create a password" />
          <button onClick={registerUser} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl">Complete Registration</button>
        </div>
      )}

      {step === "login" && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} inputMode="numeric" maxLength={10} className="w-full px-4 py-3 bg-slate-800/50 border-2 rounded-xl text-white focus:outline-none" placeholder="Enter your phone number" />
          <label className="block text-sm font-medium text-slate-300 mb-2">Password *</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800/50 border-2 rounded-xl text-white focus:outline-none" placeholder="Your Password" />
          <button onClick={loginWithNumber} className="w-full bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-xl">Login</button>
        </div>
      )}
    </div>
  );
};

export default PhoneAuth;
