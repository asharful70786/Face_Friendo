import { useEffect, useState } from "react";

const AboutUser = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="animate-pulse text-amber-600 text-xl">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          {/* Profile Picture */}
          <div className="relative w-48 h-48 rounded-full border-4 border-amber-500 shadow-xl overflow-hidden group">
            <img
              src={
                userData?.photo ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="User Profile"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-amber-500 bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* User Info */}
          <div className="text-center md:text-left space-y-4 flex-1">
            <h1 className="text-5xl font-bold text-gray-800">
              {userData?.name || "User"}
            </h1>
            <p className="text-xl text-amber-700 font-medium">
              {userData?.title || "Member"}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
              <div className="bg-white bg-opacity-80 px-6 py-3 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-amber-700 font-medium">{userData?.email || "Not provided"}</p>
              </div>
              
              {userData?.phone && (
                <div className="bg-white bg-opacity-80 px-6 py-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-amber-700 font-medium">{userData.phone}</p>
                </div>
              )}
              
              {userData?.location && (
                <div className="bg-white bg-opacity-80 px-6 py-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-amber-700 font-medium">{userData.location}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed User Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Details Card */}
          <div className="bg-white bg-opacity-90 rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-amber-600 mb-6 pb-2 border-b border-amber-100">
              Personal Details
            </h2>
            <div className="space-y-4">
              {userData?.birthDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Birth Date</span>
                  <span className="font-medium">{userData.birthDate}</span>
                </div>
              )}
              
              {userData?.gender && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Gender</span>
                  <span className="font-medium">{userData.gender}</span>
                </div>
              )}
              
              {userData?.nationality && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Nationality</span>
                  <span className="font-medium">{userData.nationality}</span>
                </div>
              )}
              
              {userData?.languages && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Languages</span>
                  <span className="font-medium">{userData.languages.join(", ")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Professional Details Card */}
          <div className="bg-white bg-opacity-90 rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-amber-600 mb-6 pb-2 border-b border-amber-100">
              Professional Information
            </h2>
            <div className="space-y-4">
              {userData?.company && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Company</span>
                  <span className="font-medium">{userData.company}</span>
                </div>
              )}
              
              {userData?.department && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Department</span>
                  <span className="font-medium">{userData.department}</span>
                </div>
              )}
              
              {userData?.position && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Position</span>
                  <span className="font-medium">{userData.position}</span>
                </div>
              )}
              
              {userData?.skills && (
                <div className="flex flex-col">
                  <span className="text-gray-500 mb-2">Skills</span>
                  <div className="flex flex-wrap gap-2">
                    {userData.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {userData?.bio && (
          <div className="mt-8 bg-white bg-opacity-90 rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-amber-600 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed">{userData.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUser;