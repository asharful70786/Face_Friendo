import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth }  from "../components/AuthContext";


function LogWithGoogle() {
  const BASE_URL = "https://backend.face.ashraful.in";
   const navigate = useNavigate();
   const { checkAuth } = useAuth();


  return (
    <>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            const response = await fetch(`${BASE_URL}/auth/google-login`, {
              credentials: "include",
              method: "POST",
              body: JSON.stringify({ token: credentialResponse.credential }),
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) {
              console.error("Failed to log in via Google");

            } else {
              const data = await response.json();
              console.log("Login success:", data);
              await checkAuth();
              navigate("/");
            }
          } catch (error) {
            console.error("Error during Google login:", error);
          }
        }}
        useOneTap
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </>
  );
}

export default LogWithGoogle;