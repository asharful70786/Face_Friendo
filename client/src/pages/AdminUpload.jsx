import React, { useEffect, useState, useRef } from "react";
import * as faceapi from "face-api.js";
import { toast } from "react-toastify";
import { FiUpload, FiUserPlus, FiImage, FiCheckCircle, FiLoader, FiInfo } from "react-icons/fi";

const AdminFaceUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [faces, setFaces] = useState([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  const imageRefs = useRef([]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        toast.success("AI models loaded and ready for face detection");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load face detection models");
      }
    };
    loadModels();
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      toast.warning("Maximum 10 images allowed per upload");
      return;
    }
    setSelectedFiles(files);
    imageRefs.current = files.map(() => React.createRef());
  };

  const handleUpload = async () => {
    if (!modelsLoaded) return toast.warning("AI models are still initializing...");
    if (selectedFiles.length === 0) return toast.warning("Please select images first");

    setLoading(true);
    setProgress(0);
    toast.info("Processing images for facial recognition...");

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("images", file));

      const detectedFaces = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const img = imageRefs.current[i].current;

        await new Promise((resolve, reject) => {
          if (img.complete) return resolve();
          img.onload = resolve;
          img.onerror = reject;
        });

        setProgress(Math.floor((i / selectedFiles.length) * 80));

        const detections = await faceapi
          .detectAllFaces(img, new faceapi.SsdMobilenetv1Options())
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (detections.length === 0) {
          toast.warn(`No faces detected in ${selectedFiles[i].name}`);
          continue;
        }

        detections.forEach((detection) => {
          detectedFaces.push({
            descriptor: Array.from(detection.descriptor),
            imageIndex: i,
            name: `Person-${detectedFaces.length + 1}`,
            landmarks: faceapi.utils.round(detection.landmarks.positions),
            detectionScore: detection.detection.score.toFixed(2),
          });
        });
      }

      if (detectedFaces.length === 0) {
        toast.error("No faces detected in any of the images");
        return;
      }
    const descriptorBlob = new Blob([JSON.stringify(detectedFaces)], { type: "application/json" });
     formData.append("faces", descriptorBlob, "faces.json");


      // formData.append("faces", JSON.stringify(detectedFaces));
      setProgress(90);

      const res = await fetch("https://backend.face.ashraful.in/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("Server rejected the upload");

      const data = await res.json();
      setProgress(100);
      toast.success(
        <div>
          <p className="font-medium">Successfully registered {data.count} face(s)</p>
          <p className="text-sm">Added to facial recognition database</p>
        </div>
      );
      setFaces(detectedFaces);
      setSelectedFiles([]);
    } catch (err) {
      console.error(err);
      toast.error(
        <div>
          <p className="font-medium">Upload failed</p>
          <p className="text-sm">{err.message}</p>
        </div>
      );
    } finally {
      setTimeout(() => setProgress(0), 1000);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Face Registration Portal</h1>
            <p className="text-sm text-gray-600">Upload new faces to be recognized</p>
          </div>
         
        </div>

  
        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FiUserPlus className="mr-2" />
              Register New Faces
            </h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Images (JPEG/PNG, max 10)
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                        <div className="flex flex-col items-center justify-center">
                          <FiUpload className="w-10 h-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            Drag & drop images here or click to browse
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {selectedFiles.length > 0
                              ? `${selectedFiles.length} file(s) selected`
                              : "No files selected"}
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <button
                    onClick={handleUpload}
                    disabled={loading || selectedFiles.length === 0 || !modelsLoaded}
                    className={`w-full py-3 px-6 rounded-lg font-medium shadow-md transition-all flex items-center justify-center ${
                      loading
                        ? "bg-blue-400 text-white cursor-wait"
                        : selectedFiles.length === 0 || !modelsLoaded
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg"
                    }`}
                  >
                    {loading ? (
                      <>
                        <FiLoader className="animate-spin mr-2" />
                        Processing {progress}%
                      </>
                    ) : (
                      <>
                        <FiUserPlus className="mr-2" />
                        Register Faces
                      </>
                    )}
                  </button>
                </div>

                {!modelsLoaded && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiLoader className="h-5 w-5 text-yellow-400 animate-spin" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          AI models are still loading. Please wait before uploading.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Section */}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Image Preview</h3>
                {selectedFiles.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                      >
                        <img
                          ref={imageRefs.current[idx]}
                          src={URL.createObjectURL(file)}
                          alt={`preview-${idx}`}
                          className="w-full h-32 object-cover"
                          crossOrigin="anonymous"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <p className="text-white text-xs truncate">{file.name}</p>
                        </div>
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                          {file.type.split("/")[1].toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center bg-gray-50">
                    <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-700">No images selected</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Selected images will appear here for preview
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {faces.length > 0 && (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-600">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <FiCheckCircle className="mr-2" />
                  Registration Results
                </h2>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs text-white">
                  {faces.length} face(s) registered
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Detection Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Landmark Points
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source Image
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {faces.map((face, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {face.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${face.detectionScore * 100}%` }}
                              ></div>
                            </div>
                            {face.detectionScore}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {face.landmarks.length} points
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {selectedFiles[face.imageIndex]?.name || "Unknown"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFaceUpload;