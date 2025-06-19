import { useState } from "react";
import {  toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


const EmailAuth = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleEmailSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/user/register/email", {
          credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      });
      const data = await res.json();
      setMessage(data.message);
      toast.success(data.message);
      if (res.ok) setStep(2);
    } catch (err) {
      setMessage("Failed to send OTP");
      toast.error("Failed to send OTP");
    }
    setLoading(false);
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/user/verify/email-otp", {
          credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      });
      const data = await res.json();
      setMessage(data.message);
      toast.success(data.message);
      if (res.ok) setStep(3);
    } catch (err) {
      setMessage("OTP verification failed");
      toast.error("OTP verification failed");
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/user/register/user-email", {
          credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      setMessage(data.message);
      toast.success(data.message);
      if (res.ok) setStep(4);
    } catch (err) {
      setMessage("Registration failed");
      toast.error("Registration failed");
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/user/email-login", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      setMessage(data.message);
      if (res.ok) {
        setMessage("Login successful");
        toast.success("Login successful");
          navigate("/");
      }
    } catch (err) {
      setMessage("Login failed");
      toast.error("Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-xl shadow-md bg-base-200">
      <h2 className="text-2xl font-bold mb-6 text-center">Email Auth Flow</h2>

      {step === 1 && (
        <form onSubmit={handleEmailSend} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="input input-bordered w-full"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="input input-bordered w-full"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleOtpVerify} className="space-y-4">
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            className="input input-bordered w-full"
            value={formData.otp}
            onChange={handleChange}
            required
          />
          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            className="input input-bordered w-full"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button className="btn btn-success w-full" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      )}

      {step === 4 && (
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered w-full"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button className="btn btn-accent w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      )}

      {message && (
        <div className="mt-4 text-sm font-medium text-center">{message}</div>
      )}
    </div>
  );
};

export default EmailAuth;
