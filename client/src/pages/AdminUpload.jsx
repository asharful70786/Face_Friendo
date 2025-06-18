// AdminFaceUpload.jsx
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
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      toast.warning("Max 10 images allowed");
      return;
    }
    setSelectedFiles(files);
    imageRefs.current = files.map(() => React.createRef());
  };

  const handleUpload = async () => {
    if (!modelsLoaded) return toast.warning("Models still loading...");
    if (selectedFiles.length === 0) return toast.warning("Select some images first.");

    setLoading(true);
    toast.info("Uploading and processing faces...");

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
          });
        });
      }

      if (detectedFaces.length === 0) return toast.error("No faces detected");

      formData.append("faces", JSON.stringify(detectedFaces));

      const res = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      toast.success(`${data.count} face(s) saved.`);
      setFaces(detectedFaces);
      setSelectedFiles([]);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <label className="block font-semibold text-lg mb-2">Select Images (up to 10)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="file-input file-input-bordered file-input-primary w-full max-w-md"
        />
        <button
          className="btn btn-primary mt-4"
          onClick={handleUpload}
          disabled={loading || selectedFiles.length === 0 || !modelsLoaded}
        >
          {loading ? "Processing..." : "Upload & Register Faces"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {selectedFiles.map((file, idx) => (
          <div key={idx} className="border p-2 rounded shadow">
            <img
              ref={imageRefs.current[idx]}
              src={URL.createObjectURL(file)}
              alt={`selected-${idx}`}
              className="rounded w-full h-auto"
              crossOrigin="anonymous"
            />
            <p className="text-xs mt-1 truncate">{file.name}</p>
          </div>
        ))}
      </div>

      {faces.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Saved Faces</h3>
          <ul className="list-disc pl-6 text-sm">
            {faces.map((face, idx) => (
              <li key={idx}>{face.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminFaceUpload;
