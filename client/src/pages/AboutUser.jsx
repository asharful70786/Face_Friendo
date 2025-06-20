import { useEffect, useState } from "react";
import { User, Mail, Shield, Edit } from "lucide-react";

const AboutUser = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getDetails() {
    try {
      const response = await fetch("https://backend.face.ashraful.in/auth/user-info", {
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
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDetails();
  }, []);

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderator':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'user':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors duration-200">
              <Edit size={18} />
            </button>
          </div>

          {/* Profile Info */}
          <div className="relative px-6 sm:px-8 pb-8">
            <div className="flex justify-center -mt-16 mb-6">
              <div className="relative">
                <div className="w-28 sm:w-32 h-28 sm:h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                  <img
                    src={userData.picture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-green-500 border-4 border-white rounded-full"></div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">{userData?.name || "User"}</h1>
                <div className="flex justify-center">
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border ${getRoleBadgeColor(userData?.role)}`}>
                    <Shield size={16} />
                    {userData?.role?.toUpperCase() || "MEMBER"}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="max-w-md mx-auto w-full">
                <div className="bg-slate-50 rounded-xl p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center justify-center gap-2">
                    <User size={20} />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                      <Mail className="text-blue-500" size={18} />
                      <span className="text-slate-700 font-medium text-sm sm:text-base">{userData?.email || "No email provided"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200">
                  Edit Profile
                </button>
                <button className="w-full sm:w-auto px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg shadow-md transition-colors duration-200">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Account Status */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              Account Status
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-medium border border-yellow-300 shadow-sm">
                Coming Soon
              </span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Member Since</span>
                <span className="text-slate-800 font-medium">2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Last Login</span>
                <span className="text-slate-800 font-medium">Today</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              Quick Actions
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-medium border border-yellow-300 shadow-sm">
                Coming Soon
              </span>
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors duration-200">
                <div className="font-medium text-slate-800">Change Password</div>
                <div className="text-sm text-slate-500">Update your account password</div>
              </button>
              <button className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors duration-200">
                <div className="font-medium text-slate-800">Privacy Settings</div>
                <div className="text-sm text-slate-500">Manage your privacy preferences</div>
              </button>
              <button className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors duration-200">
                <div className="font-medium text-slate-800">Download Data</div>
                <div className="text-sm text-slate-500">Export your account data</div>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUser;
