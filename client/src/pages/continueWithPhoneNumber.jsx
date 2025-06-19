import "../App.css";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const BaseUrl = "http://localhost:3000";

const PhoneAuth = () => {
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
  const inputRefs = useRef({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isPhoneLocked && name === "phone") return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const firstInput = Object.keys(inputRefs.current)[0];
    if (firstInput && inputRefs.current[firstInput]) {
      inputRefs.current[firstInput].focus();
    }
  }, [step]);

  const trackClick = (eventName) => {
    console.log(`Event: ${eventName}`);
  };

  const sendOtp = async () => {
    if (!form.phone) return toast.error("Please enter a phone number.");
    trackClick("Send OTP Clicked");
    const res = await fetch(`${BaseUrl}/user/phone/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: form.countryCode + form.phone }),
    });
    const data = await res.json();
    if (data.success) {
      setStep("enter-otp");
      setIsPhoneLocked(true);
      toast.success(data.message || "OTP sent successfully");
    } else {
      toast.error(data.error || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    if (!form.otp) return toast.error("Please enter the OTP.");
    trackClick("Verify OTP Clicked");
    const res = await fetch(`${BaseUrl}/user/phone/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: form.countryCode + form.phone,
        otp: form.otp,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("OTP verified, please complete registration");
      setStep("register");
    } else {
      toast.error(data.error || "OTP verification failed");
    }
  };

  const registerUser = async () => {
    trackClick("Register User Clicked");
    const fullPhone = form.countryCode + form.phone;
    if (!form.name || !form.password || !fullPhone) {
      toast.error("All fields are required.");
      return;
    }
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
      navigate("/");
    } else {
      toast.error(data.message || "Registration failed");
    }
  };

  const loginWithNumber = async () => {
    trackClick("Login Clicked");
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
      toast.success("Logged in!");
      navigate("/");
    } else {
      toast.error(data.error || "Login failed");
    }
  };

  const Input = ({ label, name, type = "text", ...props }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-black">{label}</label>
      <input
        ref={(el) => (inputRefs.current[name] = el)}
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        disabled={isPhoneLocked && name === "phone"}
        className={`w-full px-4 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isPhoneLocked && name === "phone" ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
        {...props}
      />
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-xl space-y-6">
      {step === "choose" && (
        <div className="space-y-4 text-center">
          <h2 className="block text-sm font-medium text-black">
            Login or Register With Phone Number
          </h2>
          <button
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
            onClick={() => setStep("send-otp")}
          >
            Register
          </button>
          <button
            className="bg-gray-700 text-white w-full py-2 rounded hover:bg-gray-800 transition"
            onClick={() => setStep("login")}
          >
            Login
          </button>
        </div>
      )}

      {step === "send-otp" && (
        <div className="space-y-4">
          <Input label="Phone Number" name="phone" type="tel" />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            onClick={sendOtp}
          >
            Send OTP
          </button>
        </div>
      )}

      {step === "enter-otp" && (
        <div className="space-y-4">
          <Input label="OTP Code" name="otp" placeholder="Enter the OTP" />
          <button
            className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition"
            onClick={verifyOtp}
          >
            Verify OTP
          </button>
        </div>
      )}

      {step === "register" && (
        <div className="space-y-4">
          <Input label="Your Name" name="name" placeholder="Full Name" />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Create a password"
          />
          <button
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            onClick={registerUser}
          >
            Complete Registration
          </button>
        </div>
      )}

      {step === "login" && (
        <div className="space-y-4">
          <Input label="Phone Number" name="phone" type="tel" />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Your Password"
          />
          <button
            className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition"
            onClick={loginWithNumber}
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default PhoneAuth;
