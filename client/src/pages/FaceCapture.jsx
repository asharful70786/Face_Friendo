import  { useRef, useEffect, useState } from 'react';
import Webcam from "react-webcam";
import * as faceapi from 'face-api.js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import {FiX, FiCamera, FiTarget, FiCheckCircle } from 'react-icons/fi';
import SystemStats from './SystemStats';
import ImageModal from './ImageModal';
import SideBar from './SideBar';

const FaceCapture = () => {
  const webcamRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [matches, setMatches] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showCameraHelp, setShowCameraHelp] = useState(false);

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
      const response = await fetch("https://backend.face.ashraful.in/api/match-face", {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">


 

      {/* Camera Help Modal */}
      {showCameraHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowCameraHelp(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FiCamera className="mr-2 text-indigo-600" />
              Camera Setup Guide
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-0.5">
                  <FiCheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Lighting Conditions</h4>
                  <p className="text-sm text-gray-600">Ensure even lighting on your face without strong backlight</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-0.5">
                  <FiCheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Positioning</h4>
                  <p className="text-sm text-gray-600">Keep your face centered in the frame at arm's length</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-0.5">
                  <FiCheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Accessories</h4>
                  <p className="text-sm text-gray-600">Remove hats, sunglasses, or anything obscuring your face</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-medium text-gray-800 mb-2">Troubleshooting</h4>
                <p className="text-sm text-gray-600">
                  If the camera isn't working, try refreshing the page or checking your browser permissions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Camera and Detection Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Live Face Detection</h2>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${
                    loaded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
                    {loaded ? 'System Ready' : 'Initializing...'}
                  </div>
                </div>
              </div>
              
              <div className="relative w-full rounded-lg overflow-hidden bg-black">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  className="w-full h-auto"
                  videoConstraints={{
                    width: 1280,
                    height: 720,
                    facingMode: "user"
                  }}
                />

                {isProcessing && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
                    <div className="relative w-24 h-24 mb-4">
                      <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-3 border-4 border-t-purple-500 border-r-purple-500 border-b-transparent border-l-transparent rounded-full animate-spin [animation-delay:0.2s]"></div>
                      <div className="absolute inset-6 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin [animation-delay:0.4s]"></div>
                      <div className="absolute inset-9 border-4 border-t-pink-500 border-r-pink-500 border-b-transparent border-l-transparent rounded-full animate-spin [animation-delay:0.6s]"></div>
                    </div>
                    <div className="w-64 bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${scanProgress}%` }}
                      ></div>
                    </div>
                    <p className="mt-4 text-white text-sm font-medium tracking-wide">
                      Analyzing Facial Features... {scanProgress}%
                    </p>
                  </div>
                )}
              </div>

              <div className="p-5 bg-gray-50">
                <button
                  onClick={matchFace}
                  disabled={!loaded || isProcessing}
                  className={`w-full flex items-center justify-center space-x-3 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-md ${
                    loaded && !isProcessing
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:brightness-110"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FiTarget className="text-lg" />
                  <span>{isProcessing ? "Processing Face Data..." : "Start Facial Recognition Scan"}</span>
                </button>

                <div className="mt-4 text-center text-xs text-gray-500">
                  <p>For optimal results, ensure your face is clearly visible</p>
                  <p className="mt-1">
                    Need higher accuracy? <a href="mailto:asharfulmomin530@gmail.com" className="text-indigo-600 hover:underline">Contact support</a>
                  </p>
                </div>
              </div>
            </div>

            {/* System Stats */}
            < SystemStats/>
          
          </div>

          

          {/* Sidebar Section */}
          <SideBar
            matches={matches}
            loaded={loaded}
            isProcessing={isProcessing}
            openImageModal={openImageModal}
            downloadAllImages={downloadAllImages}
            matchFace={matchFace}
          />
        </div>
      </main>

      {/* Image Modal */}
     <ImageModal
      selectedImage={selectedImage}
      currentIndex={currentIndex}
      matches={matches}
      onClose={closeImageModal}
      onNavigate={navigateImages}
      onDownload={downloadImage}
    />
    </div>
  );
};

export default FaceCapture;