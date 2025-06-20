

function Loading() {
    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        {/* Animated gradient circle with pulse effect */}
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-80 animate-pulse"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-blue-400 animate-spin" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>

        {/* Text with animated dots */}
        <div className="flex items-center justify-center space-x-1">
          <h2 className="text-2xl font-medium text-white">Checking session</h2>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>

        {/* Subtle progress bar */}
        <div className="mt-6 w-48 mx-auto bg-slate-700 rounded-full h-1.5">
          <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-1.5 rounded-full animate-progress"></div>
        </div>

        {/* Status text */}
        <p className="mt-4 text-sm text-slate-400">Securely verifying your credentials</p>
      </div>

      {/* Add this to your global CSS or Tailwind config */}
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}


export default Loading