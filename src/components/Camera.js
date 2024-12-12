import React, { useState, useRef } from "react";

function CameraCapture() {
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    if (!videoRef?.current) {
      console.error("Video element not found.");
      return;
    }
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use 'user' for the front camera
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCameraActive(true);
    } catch (err) {
      console.error("Camera error:", err.message || err.name);
      alert("Camera access is not supported or allowed.");
    }
  };
  
  

  const startCamera1 = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, 
      });
      videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Camera access is not supported or allowed.");
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    // Set canvas dimensions to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the image data from the canvas
    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);

    // Stop the camera
    const stream = video.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  return (
    <div className="bg-gray-100">
      {/* Start Camera Button */}
      {!cameraActive && !capturedImage && (
        <button
          onClick={startCamera}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
        >
          Open Camera
        </button>
      )}

      {/* Live Camera View */}
      {cameraActive && (
        <div className="flex flex-col items-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-64 bg-black"
          ></video>
          <button
            onClick={capturePhoto}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
          >
            Capture Photo
          </button>
        </div>
      )}

      {/* Captured Image Preview */}
      {capturedImage && (
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-bold mt-4">Captured Image:</h2>
          <img
            src={capturedImage}
            alt="Captured"
            className="w-64 h-64 object-cover rounded-lg shadow-md"
          />
          <button
            onClick={() => setCapturedImage(null)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            Retake Photo
          </button>
        </div>
      )}

      {/* Hidden Canvas for Capturing the Image */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}

export default CameraCapture;
