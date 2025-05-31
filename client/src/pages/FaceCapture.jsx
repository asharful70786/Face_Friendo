// src/components/FaceCapture.js
import React, { useRef, useEffect, useState } from 'react';
import Webcam from "react-webcam";
import * as faceapi from 'face-api.js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FiDownload, FiX, FiChevronLeft, FiChevronRight, FiUser } from 'react-icons/fi';

const FaceCapture = () => {
  const webcamRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [matches, setMatches] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('capture');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

      const imageBlob = await fetch(screenshot , {credentials: "include"}).then(res => res.blob());
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

  const downloadAllImages = async () => {
    try {
      const zip = new JSZip();
      const imgFolder = zip.folder("matched_faces");
      
      // Add each image to the zip
      await Promise.all(matches.map(async (match, index) => {
        const response = await fetch(getImageUrl(match.imageUrl) , {credentials: "include"});
        const blob = await response.blob();
        const fileName = `${match.name || 'matched_face'}_${index + 1}.jpg`;
        imgFolder.file(fileName, blob);
      }));
      
      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "matched_faces.zip");
    } catch (error) {
      console.error("Error downloading images:", error);
      alert("Failed to download images");
    }
  };

  const downloadImage = async (imageUrl, name, index) => {
    try {
      const response = await fetch(getImageUrl(imageUrl) , {credentials: "include"});
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${name || 'matched_face'}_${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Failed to download image");
    }
  };

  const getImageUrl = (imagePath) => {
    return `http://localhost:3000/${imagePath.replace(/^\/+/, '')}`;
  };

  const openImageModal = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const navigateImages = (direction) => {
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = matches.length - 1;
    if (newIndex >= matches.length) newIndex = 0;
    setCurrentIndex(newIndex);
    setSelectedImage(matches[newIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
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
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  <FiUser className="inline mr-2" />
                  Matched Results: {matches.length} {matches.length === 1 ? 'Image' : 'Images'} Found
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={downloadAllImages}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
                  >
                    <FiDownload className="mr-2" />
                    Download All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {matches.map((match, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-200 group relative"
                  >
                    <div 
                      className="w-full h-48 bg-gray-100 cursor-pointer overflow-hidden"
                      onClick={() => openImageModal(match, index)}
                    >
                      <img
                        src={getImageUrl(match.imageUrl)}
                        alt={match.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-indigo-700 truncate">
                        {match.name || 'Unknown Person'}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {match.distance ? `Confidence: ${(100 - match.distance * 100).toFixed(2)}%` : 'No confidence score'}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-gray-500">
                          #{index + 1}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadImage(match.imageUrl, match.name, index);
                          }}
                          className="text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-1 px-3 rounded-lg transition duration-200 flex items-center"
                        >
                          <FiDownload className="mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Modal */}
          {selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-4xl w-full max-h-screen overflow-auto">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedImage.name || 'Unknown Person'}
                  </h3>
                  <button
                    onClick={closeImageModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                <div className="relative">
                  <img
                    src={getImageUrl(selectedImage.imageUrl)}
                    alt={selectedImage.name}
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                  <button
                    onClick={() => navigateImages(-1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                  >
                    <FiChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => navigateImages(1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                  >
                    <FiChevronRight size={24} />
                  </button>
                </div>
                <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">
                      {selectedImage.distance ? `Confidence: ${(100 - selectedImage.distance * 100).toFixed(2)}%` : 'No confidence score'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Image {currentIndex + 1} of {matches.length}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadImage(selectedImage.imageUrl, selectedImage.name, currentIndex)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
                  >
                    <FiDownload className="mr-2" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceCapture;