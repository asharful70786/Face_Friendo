// src/components/FaceCapture.js
import React, { useRef, useEffect, useState } from 'react';
import Webcam from "react-webcam";
import * as faceapi from 'face-api.js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {toast } from 'react-toastify';
import { FiDownload, FiX, FiChevronLeft, FiChevronRight, FiUser } from 'react-icons/fi';

const FaceCapture = () => {
  const webcamRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [matches, setMatches] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
        toast.error("Failed to load face detection models");        
      }
    };
    loadModels();
  }, []);

  const matchFace = async () => {
    setIsProcessing(true);
    try {
      const video = webcamRef.current.video;
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        toast.error("No face detected! Please position your face in the frame.");
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
        toast.success("Face matched successfully!");
        setMatches(result.matches);
      } else {
        toast.error("No matching face found in our database.");
        setMatches([]);
      }
    } catch (error) {
      console.error("Error matching face:", error);
      toast.error("An error occurred during face matching");
         } finally {
      setIsProcessing(false);
    }
  };

  const downloadAllImages = async () => {
    try {
      const zip = new JSZip();
      const imgFolder = zip.folder("matched_faces");

      await Promise.all(matches.map(async (match, index) => {
        const response = await fetch(getImageUrl(match.imageUrl), { credentials: "include" });
        const blob = await response.blob();
        const fileName = `${match.name || 'matched_face'}_${index + 1}.jpg`;
        imgFolder.file(fileName, blob);
      }));

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "matched_faces.zip");
    } catch (error) {
      console.error("Error downloading images:", error);
      toast.error("Failed to download images");
      }
  };

  const downloadImage = async (imageUrl, name, index) => {
    try {
      const response = await fetch(getImageUrl(imageUrl), { credentials: "include" });
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
      toast.error("Failed to download image");
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
            <h1 className="text-3xl font-bold text-indigo-700 mb-2">Identify Face – Instant & Secure Facial Recognition</h1>
            <p className="text-gray-600">Get Your All Picture by Scan your Face</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
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

            <div className="w-full md:w-1/2">
              <div className="bg-gray-50 rounded-lg p-6 h-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Identify Face</h3>
                <p className="text-gray-600 mb-6">Capture your face and match it with our database</p>
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
            </div>
          </div>

          {matches.length > 0 && (
            <div className="mt-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  <FiUser className="inline mr-2" />
                  Matched Results: {matches.length} {matches.length === 1 ? 'Image' : 'Images'} Found
                </h3>
                <button
                  onClick={downloadAllImages}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <FiDownload className="mr-2" />
                  Download All
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {matches.map((match, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition-shadow duration-200 group relative">
                    <div className="w-full h-48 bg-gray-100 cursor-pointer overflow-hidden" onClick={() => openImageModal(match, index)}>
                      <img
                        src={getImageUrl(match.imageUrl)}
                        alt={match.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found'; }}
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-indigo-700 truncate">{match.name || 'Unknown Person'}</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {match.distance ? `Confidence: ${(100 - match.distance * 100).toFixed(2)}%` : 'No confidence score'}
                      </p>
                      <button
                        onClick={() => downloadImage(match.imageUrl, match.name, index)}
                        className="mt-2 text-sm text-indigo-600 hover:underline"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Modal */}
          {selectedImage && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
              <div className="relative bg-white rounded-xl p-6 shadow-2xl max-w-lg w-full">
                <button className="absolute top-2 right-2 text-gray-600 hover:text-red-600" onClick={closeImageModal}>
                  <FiX size={24} />
                </button>
                <img src={getImageUrl(selectedImage.imageUrl)} alt={selectedImage.name} className="w-full h-auto rounded-lg" />
                <div className="mt-4 flex justify-between items-center">
                  <button onClick={() => navigateImages(-1)} className="text-indigo-600 hover:underline flex items-center">
                    <FiChevronLeft /> Previous
                  </button>
                  <button onClick={() => navigateImages(1)} className="text-indigo-600 hover:underline flex items-center">
                    Next <FiChevronRight />
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
