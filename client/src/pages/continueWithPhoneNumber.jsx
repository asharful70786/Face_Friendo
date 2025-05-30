import "../App.css";
import { useState } from "react";
import { toast } from "react-toastify";

const BaseUrl = "http://localhost:3000";

const PhoneAuth = () => {
  const [step, setStep] = useState("choose"); // choose | send-otp | verify-otp | login
  const [isLogin, setIsLogin] = useState(true); // true => login, false => register
  const [form, setForm] = useState({
    phone: "",
    email: "",
    name: "",
    code: "",
    countryCode: "+91",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    const res = await fetch(`${BaseUrl}/user/phone/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: form.countryCode + form.phone,
        email: form.email,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setStep("verify-otp");
      toast.success(data.message);
    } else {
      toast.error(data.error);
    }
  };

  const verifyOtpAndRegister = async () => {
    const res = await fetch(`${BaseUrl}/user/phone/verify-otp`, {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        phone: form.countryCode + form.phone,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("Registered and logged in!");
    } else {
      toast.error(data.error);
    }
  };

  const loginWithNumber = async () => {
    const res = await fetch(`${BaseUrl}/user/phone/login/number`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: form.countryCode + form.phone,
        email: form.email,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("Logged in!");
    } else {
      toast.error(data.error);
    }
  };

  const Input = ({ label, name, type = "text", ...props }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-black">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        className="w-full px-4 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-xl space-y-6">
      {step === "choose" && (
        <div className="space-y-4 text-center">
          <h2 className="block text-sm font-medium text-black">Welcome</h2>
          <button
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
            onClick={() => {
              setIsLogin(false);
              setStep("send-otp");
            }}
          >
            Register
          </button>
          <button
            className="bg-gray-700 text-white w-full py-2 rounded hover:bg-gray-800 transition"
            onClick={() => {
              setIsLogin(true);
              setStep("login");
            }}
          >
            Login
          </button>
        </div>
      )}

      {step === "send-otp" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-black">Phone Number</label>
            <div className="flex">
              <select
                name="countryCode"
                onChange={handleChange}
                value={form.countryCode}
                className="border border-gray-300 px-2 rounded-l-md focus:outline-none text-black"
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+880">🇧🇩 +880</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
              </select>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                placeholder="Phone number"
                onChange={handleChange}
                className="w-full px-4 py-2 text-black border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
          />

          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            onClick={sendOtp}
          >
            Send OTP
          </button>
        </div>
      )}

      {step === "verify-otp" && (
        <div className="space-y-4">
          <Input label="OTP Code" name="code" placeholder="Enter the OTP" />
          <Input label="Your Name" name="name" placeholder="Full Name" />
          <button
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            onClick={verifyOtpAndRegister}
          >
            Verify & Register
          </button>
        </div>
      )}

      {step === "login" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-black">Phone Number</label>
            <div className="flex">
              <select
                name="countryCode"
                onChange={handleChange}
                value={form.countryCode}
                className="border block px-2 rounded-l-md focus:outline-none text-black"
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+880">🇧🇩 +880</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
              </select>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                placeholder="Phone number"
                onChange={handleChange}
                className="w-full px-4 py-2 text-black border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>
          </div>

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
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
