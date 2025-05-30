import React, { useEffect, useState, useRef } from "react";
import * as faceapi from "face-api.js";

const AdminFaceUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [faces, setFaces] = useState([]);

  const imageRefs = useRef([]);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
    };
    loadModels();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("images", file));

      // Upload images first
      const uploadRes = await fetch("http://localhost:3000/api/upload", {
        credentials: "include",
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      const imagePaths = uploadData.imagePaths;

      const detectedFaces = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const img = imageRefs.current[i];

        const detection = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          const descriptor = Array.from(detection.descriptor);
          const name = prompt(`Enter name for image ${selectedFiles[i].name}`);
console.log(descriptor)
          detectedFaces.push({
            name,
            descriptor,
            imageUrl: imagePaths[i],
          });
        }
      }

      // Send descriptors + imageUrls to backend
      await fetch("http://localhost:3000/api/save-bulk-face", {
          credentials: "include",
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ faces: detectedFaces }),
      });

      alert("Upload and face save completed!");
      setFaces(detectedFaces);
      setSelectedFiles([]);
    } catch (err) {
      console.error(err);
      alert("Failed to upload faces");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Face Uploader</h2>

      <input
        type="file" 
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="file-input file-input-bordered w-full max-w-sm"
      />

      {selectedFiles.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="bg-white p-2 rounded shadow">
                <img
                  ref={(el) => (imageRefs.current[idx] = el)}
                  src={URL.createObjectURL(file)}
                  alt={`preview-${idx}`}
                  className="rounded w-full h-40 object-cover"
                  crossOrigin="anonymous"
                />
                <p className="text-sm mt-1 truncate">{file.name}</p>
              </div>
            ))}
          </div>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="btn btn-primary mt-4"
          >
            {loading ? "Processing..." : "Upload & Save Faces"}
          </button>
        </>
      )}

      {faces.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-3">Uploaded Faces:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {faces.map((face, i) => (
              <div
                key={i}
                className="bg-base-200 p-3 rounded shadow text-center"
              >
                <img
                  src={`http://localhost:3000${face.imageUrl}`}
                  alt={face.name}
                  className="rounded w-full h-40 object-cover"
                />
                <p className="mt-2 font-semibold">{face.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFaceUpload;
