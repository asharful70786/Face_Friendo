// src/components/FaceCapture.js
import React, { useRef, useEffect, useState } from 'react';
import Webcam from "react-webcam";
import * as faceapi from 'face-api.js';
import MatchedFaces from './MatchedFaces';

const FaceCapture = () => {
  const webcamRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [matches, setMatches] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('capture');

  // Load face-api.js models on mount
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        setLoaded(true);
      } catch (error) {
        console.error("Error loading models:", error);
        alert("Failed to load face detection models");
      }
    };
    loadModels();
  }, []);

  const capture = async () => {
    setIsProcessing(true);
    try {
      const video = webcamRef.current.video;
      const screenshot = webcamRef.current.getScreenshot();

      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        alert("No face detected! Please ensure your face is clearly visible.");
        return;
      }

      const descriptor = Array.from(detection.descriptor);
      const name = prompt("Enter your name for registration:");

      if (!name) {
        alert("Name is required for registration");
        return;
      }

      const imageBlob = await fetch(screenshot, { credentials: "include", method: "GET" }).then(res => res.blob());
      const formData = new FormData();
      formData.append("image", imageBlob, "face.jpg");
      formData.append("name", name);
      formData.append("descriptor", JSON.stringify(descriptor));

      const response = await fetch("http://localhost:3000/api/save-face", {
        credentials: "include",
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Success! ${name}'s face has been registered.`);
      } else {
        alert(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error saving face:", error);
      alert("An error occurred during registration");
    } finally {
      setIsProcessing(false);
    }
  };

  const matchFace = async () => {
    setIsProcessing(true);
    try {
      const video = webcamRef.current.video;
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        alert("No face detected! Please position your face in the frame.");
        return;
      }

      const descriptor = Array.from(detection.descriptor);

      const response = await fetch("http://localhost:3000/api/match-face", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descriptor }),
      });

      const result = await response.json();

      if (result.match && result.matches) {
        setMatches(result.matches);
        setActiveTab('matches');
      } else {
        alert("No matching face found in our database.");
        setMatches([]);
      }
    } catch (error) {
      console.error("Error matching face:", error);
      alert("An error occurred during face matching");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-700 mb-2">Face Recognition System</h1>
            <p className="text-gray-600">Register or identify faces using advanced facial recognition</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Webcam Section */}
            <div className="w-full md:w-1/2">
              <div className="relative rounded-lg overflow-hidden border-4 border-indigo-200 shadow-lg">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  width={350}
                  height={280}
                  screenshotFormat="image/jpeg"
                  className="w-full h-auto"
                />
                {!loaded && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-2"></div>
                      <p>Loading face detection models...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls Section */}
            <div className="w-full md:w-1/2">
              <div className="bg-gray-50 rounded-lg p-6 h-full">
                <div className="flex border-b border-gray-200 mb-6">
                  <button
                    className={`py-2 px-4 font-medium ${activeTab === 'capture' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('capture')}
                  >
                    Register Face
                  </button>
                  <button
                    className={`py-2 px-4 font-medium ${activeTab === 'match' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('match')}
                  >
                    Identify Face
                  </button>
                </div>

                {activeTab === 'capture' ? (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Register New Face</h3>
                    <p className="text-gray-600 mb-6">Capture your face to register in our system for future identification.</p>
                    <button
                      onClick={capture}
                      disabled={!loaded || isProcessing}
                      className={`w-full py-3 px-4 rounded-lg font-medium text-white ${!loaded || isProcessing ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} transition duration-200 flex items-center justify-center`}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Capture & Register'
                      )}
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Identify Face</h3>
                    <p className="text-gray-600 mb-6">Check if your face matches any registered faces in our system.</p>
                    <button
                      onClick={matchFace}
                      disabled={!loaded || isProcessing}
                      className={`w-full py-3 px-4 rounded-lg font-medium text-white ${!loaded || isProcessing ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} transition duration-200 flex items-center justify-center`}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Scanning...
                        </>
                      ) : (
                        'Identify Face'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Matches Section */}
          {matches.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Match Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                    <div className="p-4">
                      <img
                        src={`http://localhost:3000/${match.imageUrl.replace(/^\/+/, '')}`}
                        alt={match.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-gray-800">{match.name}</h4>
                        <div className="mt-2">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                            Confidence: {(1 - match.distance).toFixed(4)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceCapture;