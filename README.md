## 🚀 What It Does

**Face Laxious**  is a face recognition web app designed for photographers and travel agencies. owner can upload event photos, while users simply log in and scan their face via webcam. The app uses face-api.js to convert the scan into a 128-length descriptor and matches it with descriptors stored in the database, instantly showing users all photos they appear in—no manual search needed. 

No more manual searching — just scan and get your pictures.



## 💡 Why I Built This Project

One day, a friend of mine who is a professional photographer shared a common problem — clients constantly ask for *their* photos from a huge collection after an event. Imagine dealing with 10+ people, all requesting individual images. It becomes time-consuming and frustrating.

That conversation planted a seed in my mind:  
**What if users could simply scan their face and instantly retrieve all photos that feature them?**  
The idea was to let only the admin upload photos while users could match and access their own pictures through face recognition.

I started researching and came across `face-api.js`, a powerful library for face detection and recognition in the browser. It was a bit confusing at first, but with some deep learning and experimentation, I figured out how to load models and implement matching effectively.

This project not only solves a practical problem for photographers and their clients but also explores how real-time AI can save hours of manual work.

That's how **Face Laxious** was born.

## 🚀 Features

- **User Authentication System**
  - Email-based registration with OTP verification
  - Secure password validation with strength requirements
  - JWT-based authentication
  - Password hashing with bcrypt

- **Face Recognition Integration**
  - Powered by face-api.js
  - Real-time face detection and recognition
  - Support for multiple face recognition models

- **Modern Tech Stack**
  - Frontend: React with Vite for fast development
  - Backend: Node.js with Express
  - Database integration for user management
  - Restful API architecture

## 🛠️ Tech Stack

### 🌐 Frontend
- **face-api.js** – Face detection and recognition in the browser
- **React Webcam** – Access webcam input for face scanning
- **Tailwind CSS + DaisyUI** – Utility-first CSS framework and component library for styling
- **Framer Motion** – Animation library for modern UI transitions
- **React Router DOM** – For client-side routing
- **React Toastify** – Notifications and alerts
- **JSZip & File Saver** – Download photos in ZIP format
- **Lucide React & React Icons** – Icon libraries
- **ESLint** – Linting and code quality check

### 🧠 Backend
- **Multer** – Middleware for file uploads (images)
- **bcrypt** – Secure password hashing
- **Helmet** – Secure HTTP headers
- **Express Rate Limit** – Prevent brute-force attacks
- **OTP System**
  - Email-based OTP verification using `nodemailer` 
  - Integration-ready with **Twilio** for phone-based OTP (optional/extendable)
- **Google OAuth** – One tab login 

### 2. Install dependencies


### 3. Environment Setup

Create `.env` files in both server and client directories with necessary environment variables:

**Server (.env):**
```
MONGO_DB_URI=your-database_connection_string
NODE_MAILER_PASSWORD=your-nodeMailerPAss
COOKIE_SECRET=Your-credentials-secret
GOOGLE_CLIENT_ID=your-oogle-clientId
GOOGLE_CLIENT_SECRET=youGoogle-client_secret
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-TWILIO_AUTH_TOKEN
TWILIO_VERIFY_SID=your-TWILIO_VERIFY_SID
```

### 4. Run the application

**Start the backend server:**
```bash
cd server
npm start
npm run dev / node --watch app.js 
```

**Start the frontend development server:**
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:3000` (backend).

## 📁 Project Structure

```
face-laxious/
├── client/ # Frontend (React)
│ ├── public/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ │ ├── AuthContext.jsx
│ │ │ ├── Footer.jsx
│ │ │ ├── Navbar.jsx
│ │ │ └── ProtectedRoute.jsx
│ │ ├── pages/
│ │ │ ├── AboutUser.jsx
│ │ │ ├── AdminUpload.jsx
│ │ │ ├── ContinueWithEmail.jsx
│ │ │ ├── ContinueWithPhoneNumber.jsx
│ │ │ ├── FaceCapture.jsx
│ │ │ ├── Login.jsx
│ │ │ ├── LoginWithGoogle.jsx
│ │ │ ├── MatchedFaces.jsx
│ │ │ └── RegisterEmail.jsx
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ ├── App.css
│ │ └── index.css
│ ├── index.html
│ ├── package.json
│ ├── package-lock.json
│ └── .gitignore

├── server/ # Backend (Node.js + Express)
│ ├── Config/
│ │ ├── db.js
│ │ └── setup.js
│ ├── Controllers/
│ │ ├── authController.js
│ │ ├── faceController.js
│ │ └── userController.js
│ ├── MiddleWares/
│ ├── Models/
│ │ ├── otpModel.js
│ │ ├── sessionModel.js
│ │ ├── UserFace.js
│ │ └── userModel.js
│ ├── Routes/
│ │ ├── authRoutes.js
│ │ ├── FaceRoutes.js
│ │ ├── fileRoutesByAdmin.js
│ │ └── userRoutes.js
│ ├── Services/
│ │ ├── loginWithGoogle.js
│ │ └── sendMailOtp.js
│ ├── utils/
│ │ ├── normalizeNumber.js
│ │ └── sessionHandler.js
│ ├── public/uploads/ # Uploaded face images
│ ├── app.js
│ ├── .env
│ ├── package.json
│ └── package-lock.json

├── README.md
```

## 🔐 Authentication Flow

Users can authenticate using **Email**, **Phone Number**, or **Google One-Tap Login**.


| Method         | Flow                                                                 |
|----------------|----------------------------------------------------------------------|
| **Email**      | Enter name, email, password → OTP sent to email → Verify → Done     |
| **Phone**      | Enter phone number → OTP via SMS → Verify → Done                    |
| **Google**     | Click "Login with Google" → One-tap sign-in → Done                   |


## 🎯 Face Recognition Features

- Real-time face detection using webcam
- Face recognition model integration
- Support for multiple face recognition algorithms
- Optimized models for web performance

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 API Endpoints

### 🔐 Authentication
- `POST /auth/google-login` — Login with Google
- `POST /user/register/email` — Send OTP to email for registration
- `POST /user/phone/login/number` — Login using phone number with OTP

### 🧠 Face Recognition
- `POST /api/match-face` — Match user's face and return all related images

## 🐛 Known Issues

- Face recognition models need to be downloaded on first use
- Camera permissions required for face detection features


## 🙏 Acknowledgments

- [face-api.js](https://github.com/justadudewhohacks/face-api.js) for face recognition capabilities


## 📞 Support

If you have any questions, feedback, or need help — I'm just a click away:

🌐 **Website:** [ashraful.in](https://www.ashraful.in)  
📸 **Instagram:** [@codercamp2024](https://www.instagram.com/codercamp2024/)

---

⭐️ **If you love my work, don't forget to give this repo a star!**  
Your support means a lot and keeps me motivated 💙

