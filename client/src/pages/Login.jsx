import React from 'react';
import PhoneAuth from './continueWithPhoneNumber';
import EmailLogin from './ContinueWithEmail';
import LogWithGoogle from  "./loginWithGoogle";


function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-[#1f2937] to-gray-800 text-white px-4">
      <div className="w-full max-w-2xl bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-700">
        
        {/* Google Login Section */}
        <div className="flex justify-center">
          <LogWithGoogle />
        </div>

        {/* Divider */}
        <div className="divider text-white">or</div>

        {/* Phone Auth Section */}
        <div className="bg-base-200 bg-opacity-20 p-4 rounded-xl shadow-inner">
          <h2 className="text-lg font-bold mb-2 text-center">Login / Register with Phone Number</h2>
          <PhoneAuth />
        </div>

        {/* Divider */}
        <div className="divider text-white">or</div>

        {/* Email Auth Section */}
        <div className="bg-base-200 bg-opacity-20 p-4 rounded-xl shadow-inner">
          <h2 className="text-lg font-bold mb-2 text-center">Email Auth Flow</h2>
          < EmailLogin />
          
      
        </div>

      </div>
    </div>
  );
}

export default Login;
