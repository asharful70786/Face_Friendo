import { useEffect, useState } from "react";

const AboutUser = () => {
  const [userData, setUserData] = useState(null);

  async function getDetails() {
    try {
      const response = await fetch("http://localhost:3000/auth/user-info", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setUserData(data.message);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Text Content */}
          <div className="text-center md:text-left space-y-4">
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
              Welcome Back,{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                {userData?.name || "User"}
              </span>
              !
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Here’s your personalized dashboard. Stay productive and inspired.
            </p>
            {userData?.email && (
              <p className="text-md text-indigo-500 dark:text-indigo-300">
                Email: {userData.email}
              </p>
            )}
          </div>

          {/* Profile Picture */}
          <div className="w-40 h-40 rounded-full border-4 border-indigo-500 shadow-lg overflow-hidden">
            <img
              src={
                userData?.photo ||
                "https://tse4.mm.bing.net/th?id=OIP.Kk4i-k-7bOfsgPv0SJtj5AHaHa&pid=Api&P=0&h=180"
              }
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 text-center">
            <h2 className="text-xl font-semibold text-indigo-600">Tasks</h2>
            <p className="text-gray-600 dark:text-gray-400">
              View your pending items.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 text-center">
            <h2 className="text-xl font-semibold text-indigo-600">Messages</h2>
            <p className="text-gray-600 dark:text-gray-400">
              You have no new messages.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 text-center">
            <h2 className="text-xl font-semibold text-indigo-600">Settings</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Update your preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUser;
