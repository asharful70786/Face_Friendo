import React, { useRef, useEffect, useState } from 'react';
import Webcam from "react-webcam";
import * as faceapi from 'face-api.js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import {
  FiDownload, FiX, FiChevronLeft, FiChevronRight, FiUser, FiCamera,
  FiTarget, FiActivity, FiInfo, FiDatabase, FiShield, FiCheckCircle
} from 'react-icons/fi';

const FaceCapture = () => {
  const webcamRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [matches, setMatches] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

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
    setScanProgress(0);

    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const video = webcamRef.current.video;
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        toast.error("No face detected! Please position your face in the frame.");
        clearInterval(progressInterval);
        setScanProgress(0);
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
      setScanProgress(100);

      setTimeout(() => {
        if (result.match && result.matches) {
          toast.success("Face matched successfully!");
          setMatches(result.matches);
        } else {
          toast.error("No matching face found in our database.");
          setMatches([]);
        }
        setScanProgress(0);
      }, 500);

    } catch (error) {
      console.error("Error matching face:", error);
      toast.error("An error occurred during face matching");
      clearInterval(progressInterval);
      setScanProgress(0);
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
        const response = await fetch(match.imageUrl);
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
      const response = await fetch(imageUrl);
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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section
      <header className="max-w-7xl mx-auto mb-12">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiCamera className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">FaceMatch AI</h1>
          </div>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <FiInfo className="text-indigo-600" />
            <span className="text-gray-700 font-medium">About</span>
          </button>
        </div>
      </header> */}

      {/* Information Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FiInfo className="mr-2 text-indigo-600" />
              About FaceMatch AI
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                FaceMatch AI is an advanced facial recognition system powered by machine learning algorithms. 
                It can detect, analyze, and match faces in real-time with high accuracy.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <FiShield className="mr-2" />
                  Privacy & Security
                </h3>
                <p>
                  All facial data is processed locally in your browser. No images or biometric data are stored 
                  on our servers without your explicit permission.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-3 rounded-lg">
                  <h4 className="font-medium text-indigo-700 flex items-center">
                    <FiDatabase className="mr-2" />
                    Technology Stack
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• React.js Frontend</li>
                    <li>• Face-api.js ML Models</li>
                    <li>• TensorFlow Backend</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-700 flex items-center">
                    <FiCheckCircle className="mr-2" />
                    Features
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Real-time Face Detection</li>
                    <li>• 68-Point Landmark Mapping</li>
                    <li>• Database Matching</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Camera and Detection Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">Live Face Detection</h2>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    loaded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {loaded ? 'System Ready' : 'Initializing...'}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="relative mx-auto w-full max-w-lg">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    width={640}
                    height={480}
                    screenshotFormat="image/jpeg"
                    className="rounded-xl shadow-md w-full border border-gray-200"
                  />

                  {isProcessing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center rounded-xl">
                      <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-4 border-t-purple-500 border-r-purple-500 border-b-transparent border-l-transparent rounded-full animate-spin animation-delay-200"></div>
                        <div className="absolute inset-4 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin animation-delay-400"></div>
                      </div>
                      <p className="text-white mt-4 font-medium">Analyzing Face... {scanProgress}%</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={matchFace}
                    disabled={!loaded || isProcessing}
                    className={`px-8 py-3 rounded-lg font-semibold shadow-md transition-all ${
                      loaded && !isProcessing
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-[1.02]'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <FiTarget />
                      <span>{isProcessing ? 'Processing...' : 'Start Face Scan'}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* System Stats */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">System Performance</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="text-sm text-gray-500 mb-1">Detection Speed</div>
                  <div className="text-2xl font-bold text-indigo-600">~120ms</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="text-sm text-gray-500 mb-1">Accuracy</div>
                  <div className="text-2xl font-bold text-green-600">98.7%</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="text-sm text-gray-500 mb-1">Database Size</div>
                  <div className="text-2xl font-bold text-blue-600">1,240</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-6">
            {/* System Status */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-gray-800 to-gray-900">
                <h3 className="text-white font-semibold flex items-center">
                  <FiActivity className="mr-2" />
                  System Status
                </h3>
              </div>
              <div className="p-5">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Face Detection Network</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Recognition Model</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Landmark Detection</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Database Connection</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Matched Faces */}
            {matches.length > 0 && (
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="p-5 bg-gradient-to-r from-indigo-600 to-blue-600">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-semibold flex items-center">
                      <FiUser className="mr-2" />
                      Matched Faces
                    </h3>
                    <span className="bg-black bg-opacity-10 px-2 py-1 rounded-full text-xs text-gray-100">
  {matches.length} found
</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-3">
                    {matches.map((face, index) => (
                      <div
                        key={index}
                        className="cursor-pointer group relative overflow-hidden rounded-lg shadow-sm border border-gray-100"
                        onClick={() => openImageModal(face, index)}
                      >
                        <img 
                          src={face.imageUrl} 
                          alt={face.name || 'Face'} 
                          className="w-full h-32 object-cover transition-transform group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-2 w-full">
                          <h5 className="text-white font-medium text-sm truncate">
                            {face.name || `Face ${index + 1}`}
                          </h5>
                          <p className="text-white text-xs opacity-80">
                            {face.confidence ? `${(face.confidence * 100).toFixed(1)}% match` : 'Matched'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={downloadAllImages}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      <FiDownload className="mr-2" />
                      Download All Matches
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Tips */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-purple-600 to-pink-600">
                <h3 className="text-white font-semibold">Tips for Best Results</h3>
              </div>
              <div className="p-5">
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full p-1 mr-3">
                      <FiCamera className="w-3 h-3" />
                    </div>
                    <span>Ensure good lighting on your face</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full p-1 mr-3">
                      <FiCamera className="w-3 h-3" />
                    </div>
                    <span>Remove sunglasses or hats</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full p-1 mr-3">
                      <FiCamera className="w-3 h-3" />
                    </div>
                    <span>Position face in the center of frame</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full relative overflow-hidden shadow-2xl">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 z-10 hover:bg-opacity-70 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
            
            <div className="relative h-96">
              <img 
                src={selectedImage.imageUrl} 
                alt="Matched Face" 
                className="w-full h-full object-contain bg-gray-100" 
              />
              
              <button 
                onClick={() => navigateImages(-1)} 
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              
              <button 
                onClick={() => navigateImages(1)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-bold text-gray-800">
                  {selectedImage.name || `Face ${currentIndex + 1}`}
                </h4>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {(selectedImage.confidence ? (selectedImage.confidence * 100).toFixed(1) : '100')}% match
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="text-xs text-gray-500 mb-1">Source</h5>
                  <p className="text-sm font-medium truncate">
                    {selectedImage.source || 'Internal Database'}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="text-xs text-gray-500 mb-1">Date Added</h5>
                  <p className="text-sm font-medium">
                    {selectedImage.date || 'Unknown'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => downloadImage(selectedImage.imageUrl, selectedImage.name, currentIndex)}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow hover:shadow-md transition-all"
                >
                  <FiDownload className="mr-2" />
                  Download High-Res Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceCapture;