import React, { useEffect, useState, useRef } from "react";
import * as faceapi from "face-api.js";
import { toast } from "react-toastify";

const AdminFaceUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [faces, setFaces] = useState([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const imageRefs = useRef([]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        toast.info("Loading face detection models...");
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        toast.success("Face detection models loaded successfully!");
      } catch (err) {
        toast.error("Failed to load face detection models");
      }
    };
    loadModels();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files.length > 10) {
      toast.warning("Please select up to 10 images at a time for better performance.");
      return;
    }
    setSelectedFiles(Array.from(e.target.files));
    toast.info(`${e.target.files.length} image(s) selected.`);
  };

  const handleUpload = async () => {
    if (!modelsLoaded) {
      toast.warning("Face detection models are still loading. Please wait a moment.");
      return;
    }

    if (selectedFiles.length === 0) {
      toast.warning("Please select images before uploading.");
      return;
    }

    setLoading(true);
    toast.info("Uploading images...");
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("images", file));

      const uploadRes = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!uploadRes.ok) {
        toast.error("Failed to upload images to server.");
        throw new Error("Failed to upload images");
      }

      toast.success("Images uploaded successfully.");
      const uploadData = await uploadRes.json();
      const imagePaths = uploadData.imagePaths;

      const detectedFaces = [];

      toast.info("Detecting faces in the uploaded images...");
      for (let i = 0; i < selectedFiles.length; i++) {
        const img = imageRefs.current[i];

        const detections = await faceapi
          .detectAllFaces(img, new faceapi.SsdMobilenetv1Options())
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (detections.length === 0) {
          toast.error(`No face detected in ${selectedFiles[i].name}. This image will be skipped.`);
          continue;
        }

        for (let j = 0; j < detections.length; j++) {
          const descriptor = Array.from(detections[j].descriptor);
          detectedFaces.push({
            descriptor,
            imageUrl: imagePaths[i],
          });
        }
      }

      if (detectedFaces.length === 0) {
        toast.error("No valid faces detected in any of the uploaded images.");
        return;
      }

      toast.info("Saving detected face data...");
      const saveRes = await fetch("http://localhost:3000/api/save-bulk-face", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ faces: detectedFaces }),
      });

      if (!saveRes.ok) {
        toast.error("Failed to save face data.");
        throw new Error("Failed to save face data");
      }

      toast.success(`Successfully registered ${detectedFaces.length} face(s).`);
      setFaces(detectedFaces);
      setSelectedFiles([]);
    } catch (err) {
      console.error(err);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Face Registration Portal</h2>
        <p className="text-gray-600 mb-4">Upload images to register new faces in the recognition system</p>

        <div className="alert alert-warning mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="font-bold">Important Guidelines</h3>
            <div className="text-xs">
              <p>• Upload clear frontal face images for best results</p>
              <p>• Avoid images with multiple faces or obscured faces</p>
              <p>• Ensure good lighting and minimal shadows</p>
              <p>• Maximum 10 images per batch recommended</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="file-input file-input-bordered file-input-primary w-full"
            />
          </div>
          <button
            onClick={handleUpload}
            disabled={loading || selectedFiles.length === 0 || !modelsLoaded}
            className={`btn btn-primary ${loading ? 'loading' : ''} w-full sm:w-auto`}
          >
            {loading ? "Processing..." : "Register Faces"}
          </button>
        </div>

        {!modelsLoaded && (
          <div className="alert alert-info mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Face detection models are loading... Please wait.</span>
          </div>
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Selected Images ({selectedFiles.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="group relative">
                <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                  <img
                    ref={(el) => (imageRefs.current[idx] = el)}
                    src={URL.createObjectURL(file)}
                    alt={`preview-${idx}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    crossOrigin="anonymous"
                  />
                </div>
                <p className="text-xs mt-1 text-gray-600 truncate">{file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {faces.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Successfully Registered Faces</h3>
            <span className="badge badge-success">{faces.length} faces</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {faces.map((face, i) => (
              <div key={i} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 relative">
                  <img
                    src={`http://localhost:3000${face.imageUrl}`}
                    alt={face.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 bg-gray-50">
                  <p className="font-medium text-gray-800 truncate">{face.name}</p>
                  <p className="text-xs text-gray-500">ID: {i + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFaceUpload;
