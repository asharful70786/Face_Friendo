// src/components/FaceCapture.js
import React, { useRef, useEffect, useState } from 'react';
import Webcam from "react-webcam";
import * as faceapi from 'face-api.js';
import MatchedFaces from './MatchedFaces';


const FaceCapture = () => {
  const webcamRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [matches, setMatches] = useState([]);

  // Load face-api.js models on mount
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
      setLoaded(true);
    };
    loadModels();
  }, []);

  const capture = async () => {
    const video = webcamRef.current.video;
    const screenshot = webcamRef.current.getScreenshot();

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      alert("No face detected!");
      return;
    }

    const descriptor = Array.from(detection.descriptor);
    const name = prompt("Enter your name:");

    if (!name) {
      alert("Name is required");
      return;
    }

    const imageBlob = await fetch(screenshot ,{  credentials: "include", method: "GET"} ).then(res => res.blob());
    const formData = new FormData();
    formData.append("image", imageBlob, "face.jpg");
    formData.append("name", name);
    formData.append("descriptor", JSON.stringify(descriptor));

    try {
      const response = await fetch("http://localhost:3000/api/save-face", {
          credentials: "include",
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        alert("Face saved successfully!");
      } else {
        alert(`Failed to save: ${data.message}`);
      }
    } catch (error) {
      console.error("Error saving face:", error);
      alert("Something went wrong!");
    }
  };

  const matchFace = async () => {
    const video = webcamRef.current.video;
    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      alert("No face detected!");
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
    } else {
      alert("No similar face found.");
      setMatches([]);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Face Capture</h2>

      <Webcam
        ref={webcamRef}
        audio={false}
        width={350}
        height={280}
        screenshotFormat="image/jpeg"
        style={{ borderRadius: "10px", border: "2px solid #ccc" }}
      />

      <div style={{ marginTop: "20px" }}>
        {loaded ? (
          <>
            <button className="btn btn-primary" onClick={capture}>Capture & Upload</button>
            <br /><br />
            <button className="btn btn-success" onClick={matchFace}>Match Face</button>
          </>
        ) : (
          <p>Loading Models...</p>
        )}
      </div>
    {  MatchedFaces({matches})
}
{/* {matches.length > 0 && (
  <div style={{ marginTop: "30px" }}>
    <h3>Matched Faces:</h3>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
      {matches.map((match, index) => (
        <div key={index} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "10px" }}>
          <img
           src={`http://localhost:3000/${match.imageUrl.replace(/^\/+/, '')}`}
            alt={match.name}
            width="200"
         />
          <p><strong>{match.name}</strong></p>
          <p>Distance: {match.distance.toFixed(4)}</p>
        </div>
      ))}
    </div>
  </div>
)} */}

    </div>
  );
};

export default FaceCapture;
