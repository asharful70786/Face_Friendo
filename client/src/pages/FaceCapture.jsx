// src/components/FaceCapture.js

import React, { useRef, useEffect, useState } from 'react';
import Webcam from "react-webcam";
import * as faceapi from 'face-api.js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import {
  FiDownload, FiX, FiChevronLeft, FiChevronRight, FiUser, FiCamera,
  FiShield, FiZap, FiEye, FiCheck, FiAlertCircle, FiDatabase, FiLock
} from 'react-icons/fi';

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
    if (matches.length === 0) return;
    
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
      toast.success("All images downloaded successfully!");
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
      toast.success("Image downloaded successfully!");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Main Interface */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden p-8 space-y-8">
          {/* Camera Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FiCamera className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">Live Camera Feed</h3>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${loaded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {loaded ? (<><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block mr-2"></div> System Ready</>) : (<><div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse inline-block mr-2"></div> Initializing</>)}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <Webcam 
                ref={webcamRef} 
                audio={false} 
                width={480} 
                height={360} 
                screenshotFormat="image/jpeg" 
                className="rounded-2xl shadow-xl w-full" 
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center rounded-2xl">
                  <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-white font-semibold text-lg">Analyzing Face...</p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-3">Camera Guidelines</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-700">
                  <FiUser className="w-5 h-5 text-blue-500" /> 
                  <span>Face directly towards camera</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <FiZap className="w-5 h-5 text-blue-500" /> 
                  <span>Good lighting condition</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <FiDatabase className="w-5 h-5 text-blue-500" /> 
                  <span>Ensure database availability</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <FiLock className="w-5 h-5 text-blue-500" /> 
                  <span>Stable internet connection</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={matchFace} 
                disabled={!loaded || isProcessing} 
                className={`px-8 py-3 rounded-full font-semibold text-white text-lg shadow-lg transition ${
                  loaded 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Scan & Match Face'}
              </button>
            </div>
          </div>

          {/* Matched Results Section */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <FiUser className="w-6 h-6 text-indigo-600" />
                <h3 className="text-2xl font-bold text-gray-900">Matched Results</h3>
              </div>
              {matches.length > 0 && (
                <button 
                  onClick={downloadAllImages}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full transition"
                >
                  <FiDownload className="w-4 h-4" />
                  <span>Download All</span>
                </button>
              )}
            </div>

            {matches.length > 0 ? (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <FiCheck className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-800">Match Found!</h4>
                      <p className="text-sm text-green-700">
                        {matches.length} potential {matches.length > 1 ? 'matches' : 'match'} identified
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {matches.map((match, index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
                      <div 
                        className="relative cursor-pointer h-40" 
                        onClick={() => openImageModal(match, index)}
                      >
                        <img 
                          src={getImageUrl(match.imageUrl)} 
                          alt={`Matched face ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                          <div>
                            <p className="font-medium text-white">{match.name || 'Unknown'}</p>
                            <p className="text-xs text-white/90">
                              {match.confidence ? `${(match.confidence * 100).toFixed(1)}% match` : 'Match found'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <button
                          onClick={() => downloadImage(match.imageUrl, match.name, index)}
                          className="w-full flex items-center justify-center space-x-2 py-2 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition"
                        >
                          <FiDownload className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiEye className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="font-medium text-gray-700 mb-2">No matches yet</h4>
                <p className="text-sm text-gray-500">
                  Scan your face using the camera above to find matches in our database
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
          <div className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <button 
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition"
            >
              <FiX className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex items-center justify-between absolute top-0 left-0 right-0 px-4 py-3 bg-white/90 z-10">
              <h3 className="font-semibold text-gray-900">{selectedImage.name || 'Matched Face'}</h3>
              {selectedImage.confidence && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                  {(selectedImage.confidence * 100).toFixed(1)}% match
                </span>
              )}
            </div>

            <div className="relative h-[70vh] flex items-center justify-center">
              <img 
                src={getImageUrl(selectedImage.imageUrl)} 
                alt="Selected matched face"
                className="max-w-full max-h-full object-contain"
              />

              <button 
                onClick={() => navigateImages(-1)}
                className="absolute left-4 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition"
              >
                <FiChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button 
                onClick={() => navigateImages(1)}
                className="absolute right-4 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition"
              >
                <FiChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <div className="p-4 border-t flex justify-between items-center">
              <div>
                {selectedImage.timestamp && (
                  <p className="text-sm text-gray-600">
                    Last seen: {new Date(selectedImage.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
              <button
                onClick={() => downloadImage(selectedImage.imageUrl, selectedImage.name, currentIndex)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
              >
                <FiDownload className="w-5 h-5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceCapture;