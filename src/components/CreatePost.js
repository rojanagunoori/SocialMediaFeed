
import React, { useState } from "react";
import Webcam from "react-webcam";
import { FaArrowLeft, FaCamera, FaFolderOpen } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import axios from "axios"; // Use axios for HTTP requests
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";


const REACT_APP_CLOUDINARY_URL="https://api.cloudinary.com/v1_1/dey2l6q0u/image/upload"//"https://api.cloudinary.com/v1_1/dey2l6q0u/image/upload"
const REACT_APP_CLOUDINARY_UPLOAD_PRESET="ml_default"

const CLOUDINARY_URL = REACT_APP_CLOUDINARY_URL//process.env.REACT_APP_CLOUDINARY_URL;
const CLOUDINARY_UPLOAD_PRESET = REACT_APP_CLOUDINARY_UPLOAD_PRESET//process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

//console.log(CLOUDINARY_URL);
//console.log(CLOUDINARY_UPLOAD_PRESET);

//const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload";
//const CLOUDINARY_UPLOAD_PRESET = "YOUR_UPLOAD_PRESET";

function CreatePost() {
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [capturedVideos, setCapturedVideos] = useState([]);
  const [postText, setPostText] = useState("");
  const [mediaInputType, setMediaInputType] = useState("none");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const navigate=useNavigate()

  const webcamRef = React.useRef(null);
  const videoRef = React.useRef(null);

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedPhotos([...capturedPhotos, imageSrc]);
  };

  const captureVideo = () => {
    if (videoRef.current) {
      const videoBlob = videoRef.current.captureStream();
      const videoURL = URL.createObjectURL(videoBlob);
      setCapturedVideos([...capturedVideos, videoURL]);
    }
  };

  const deleteMedia = (index, type) => {
    if (type === "photo") {
      setCapturedPhotos(capturedPhotos.filter((_, i) => i !== index));
    } else if (type === "video") {
      setCapturedVideos(capturedVideos.filter((_, i) => i !== index));
    }
  };

  const handleMediaOptionChange = (option) => {
    setMediaInputType(option);
  };

  const handleCreatePost = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser; // Get the current user
  
      if (!currentUser) {
        toast.error("You need to be logged in to create a post.", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }
      const mediaUrls = [];

      // Upload photos to Cloudinary
      for (const photo of capturedPhotos) {
        const formData = new FormData();
        formData.append("file", photo);
       // console.log("Photo ",photo)
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
       // console.log("CLOUDINARY_UPLOAD_PRESET ",CLOUDINARY_UPLOAD_PRESET,CLOUDINARY_URL)

        const response =await fetch(CLOUDINARY_URL,{
          method:"POST",
          body:formData
        })
     //   console.log("Upload successful:", response.data);
        const data = await response.json(); // Parse the response as JSON
//console.log("Upload successful:", data);
const photoUrl = data.secure_url; // Now `data` contains the expected `secure_url`
mediaUrls.push(photoUrl);
        
      }

      // Upload videos (if needed, you can modify to support video upload as well)
      for (const video of capturedVideos) {
        const formData = new FormData();
        formData.append("file", video);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("cloud_name","dey2l6q0u")

        const response = await axios.post(CLOUDINARY_URL, formData);
        const videoUrl = response.data.secure_url;
        mediaUrls.push(videoUrl);
      }

      // Save post data (assuming you are using Firestore for text data)
      const postRef = await addDoc(collection(db, "posts"), {
        text: postText,
        media: mediaUrls,  // Save media URLs from Cloudinary
        timestamp: new Date(),
        userId: currentUser.uid, 
      });
      toast.success("Post created successfully!"
        //, {position: toast.POSITION.TOP_RIGHT,} // Ensure this is correct
      );

     // alert("Post created successfully! Post ID: " + postRef.id);
      setPostText("");
      setCapturedPhotos([]);
      setCapturedVideos([]);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      //alert("Failed to create post. Please try again.");
    }
  };

  const handleBack=()=>{
    navigate(-1)
  }

  return (
    <div className="min-h-screen">
      <header className="p-4 flex items-center">
        <FaArrowLeft className="text-xl cursor-pointer mr-3" onClick={handleBack} />
        <h1 className="text-xl font-bold">New Post</h1>
      </header>
      <div className="p-4">
        <div className="border-2 border-[#D9D9D9] bg-[#D9D9D9] rounded-lg p-4 mb-4">
          <textarea
            className="w-full h-20 border-none bg-transparent outline-none resize-none"
            placeholder="What's on your mind?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="p-2">
        <div className="flex space-x-4">
          <button
            onClick={() => handleMediaOptionChange("file")}
            className="px-4 py-2 rounded-lg outline-none font-bold flex justify-center items-center"
          >
            <FaFolderOpen color="red" className="mr-1" /> Choose the Files
          </button>
          <button
            onClick={() => handleMediaOptionChange("camera")}
            className="px-4 py-2 rounded-lg outline-none font-bold flex justify-center items-center"
          >
            <FaCamera color="blue" className="mr-1" /> Camera
          </button>
        </div>
      </div>

      {mediaInputType === "camera" && (
        <div className="p-4">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={{
              facingMode: "user",
            }}
          />
          <button
            onClick={capturePhoto}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
          >
            Capture Photo
          </button>
        </div>
      )}

      {mediaInputType === "file" && (
        <div className="p-4">
          <input
            type="file"
            multiple
            accept="image/*, video/*"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              files.forEach((file) => {
                if (file.type.startsWith("image")) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setCapturedPhotos([...capturedPhotos, reader.result]);
                  };
                  reader.readAsDataURL(file);
                } else if (file.type.startsWith("video")) {
                  const videoURL = URL.createObjectURL(file);
                  setCapturedVideos([...capturedVideos, videoURL]);
                }
              });
            }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex flex-wrap space-x-4">
          {capturedPhotos.map((photo, index) => (
            <div key={index} className="relative mb-4">
              <img src={photo} alt={`Captured ${index}`} className="w-full max-w-md" />
              <button
                onClick={() => deleteMedia(index, "photo")}
                className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded-full shadow-md"
              >
                <IoMdClose />
              </button>
            </div>
          ))}

          {capturedVideos.map((video, index) => (
            <div key={index} className="relative mb-4">
              <video
                src={video}
                controls
                className="w-full max-w-md"
                loop
                muted
              ></video>
              <button
                onClick={() => deleteMedia(index, "video")}
                className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full shadow-md"
              >
                <IoMdClose />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 fixed bottom-0 left-0 right-0 text-center">
        <button
          onClick={handleCreatePost}
          className="bg-[#000000] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#000000]-600 text-center"
        >
          Create Post
        </button>
      </div>
    </div>
  );
}

export default CreatePost;



/*import React, { useState } from "react";
import Webcam from "react-webcam";
import {  FaArrowLeft, FaCamera, FaFolderOpen } from "react-icons/fa";
import { db, storage } from "../firebase/firebase"; 
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { IoMdClose } from "react-icons/io";

function CreatePost() {
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [capturedVideos, setCapturedVideos] = useState([]);
  const [postText, setPostText] = useState("");
  const [mediaInputType, setMediaInputType] = useState("none"); 
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);


  const webcamRef = React.useRef(null);
  const videoRef = React.useRef(null);

 
  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedPhotos([...capturedPhotos, imageSrc]);
  };

  
  const captureVideo = () => {
    if (videoRef.current) {
      const videoBlob = videoRef.current.captureStream();
      const videoURL = URL.createObjectURL(videoBlob);
      setCapturedVideos([...capturedVideos, videoURL]); 
    }
  };

  
  const deleteMedia = (index, type) => {
    if (type === "photo") {
      setCapturedPhotos(capturedPhotos.filter((_, i) => i !== index));
    } else if (type === "video") {
      setCapturedVideos(capturedVideos.filter((_, i) => i !== index));
    }
  };


  const handleMediaOptionChange = (option) => {
    setMediaInputType(option);
  };

  const handleCarouselNavigation = (direction) => {
    if (direction === "next") {
      setCurrentMediaIndex((prevIndex) => Math.min(prevIndex + 1, capturedPhotos.length + capturedVideos.length - 1));
    } else {
      setCurrentMediaIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  const renderCarouselItem = () => {
    const totalMedia = [...capturedPhotos, ...capturedVideos];
    if (totalMedia.length === 0) return null;

    const currentMedia = totalMedia[currentMediaIndex];
    const isPhoto = currentMedia.startsWith("data:image");
    return (
      <div className="relative">
        {isPhoto ? (
          <img src={currentMedia} alt="Media preview" className="w-full rounded-lg" />
        ) : (
          <video
            src={currentMedia}
            controls
            className="w-full rounded-lg"
            loop
            muted
          ></video>
        )}
        <button
          onClick={() => deleteMedia(currentMediaIndex, isPhoto ? "photo" : "video")}
          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full shadow-md"
        >
          <IoMdClose />
        </button>
      </div>
    );
  };

  const handleCreatePost = async () => {
    try {
      const mediaUrls = [];
  
      // Upload photos
      for (const photo of capturedPhotos) {
        const photoRef = ref(storage, `posts/images/${Date.now()}.jpg`);
        const response = await fetch(photo); // Convert base64 to Blob
        const blob = await response.blob(); // Convert the base64 image to a Blob object
        const uploadResult = await uploadBytes(photoRef, blob);
        const photoUrl = await getDownloadURL(uploadResult.ref); // Get the download URL for the uploaded photo
        mediaUrls.push(photoUrl); // Store the URL
      }
  
      // Upload videos
      for (const video of capturedVideos) {
        const videoRef = ref(storage, `posts/videos/${Date.now()}.mp4`);
        const response = await fetch(video); // Convert base64 to Blob
        const blob = await response.blob(); // Convert the base64 video to a Blob object
        const uploadResult = await uploadBytes(videoRef, blob);
        const videoUrl = await getDownloadURL(uploadResult.ref); // Get the download URL for the uploaded video
        mediaUrls.push(videoUrl); // Store the URL
      }
  
      // Save post data to Firestore
      const postRef = await addDoc(collection(db, "posts"), {
        text: postText,
        media: mediaUrls,  // Save the media URLs in Firestore
        timestamp: new Date(),
      });
  
      alert("Post created successfully! Post ID: " + postRef.id);
      setPostText("");  // Clear post text after successful upload
      setCapturedPhotos([]);  // Clear captured photos
      setCapturedVideos([]);  // Clear captured videos
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };
  

  const handleCreatePost1 = async () => {
    try {
      const mediaUrls = [];
  
      // Upload photos
      for (const photo of capturedPhotos) {
        const photoRef = ref(storage, `posts/images/${Date.now()}.jpg`);
        const response = await fetch(photo); // Convert base64 to Blob
        const blob = await response.blob();
        await uploadBytes(photoRef, blob);
        const photoUrl = await getDownloadURL(photoRef);
        mediaUrls.push(photoUrl);
      }
  
      // Upload videos
      for (const video of capturedVideos) {
        const videoRef = ref(storage, `posts/videos/${Date.now()}.mp4`);
        const response = await fetch(video); // Convert base64 to Blob
        const blob = await response.blob();
        await uploadBytes(videoRef, blob);
        const videoUrl = await getDownloadURL(videoRef);
        mediaUrls.push(videoUrl);
      }
  
      // Save post data to Firestore
      const postRef = await addDoc(collection(db, "posts"), {
        text: postText,
        media: mediaUrls,
        timestamp: new Date(),
      });
  
      alert("Post created successfully! Post ID: " + postRef.id);
      setPostText("");
      setCapturedPhotos([]);
      setCapturedVideos([]);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };
  

  return (
    <div className="min-h-screen ">
      <header className="  p-4 flex items-center ">
        <FaArrowLeft className="text-xl cursor-pointer mr-3" />
        <h1 className="text-xl font-bold">New Post</h1>
      </header>
      <div className="p-4">
       <div className="border-2 border-[#D9D9D9] bg-[#D9D9D9] rounded-lg p-4 mb-4">
       <textarea
            className="w-full h-20 border-none bg-transparent outline-none resize-none"
            placeholder="What's on your mind?"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        ></textarea>
       </div>
        
      </div>


      <div className="p-2">
        
        <div className="flex space-x-4">
     
         
          <button
            onClick={() => handleMediaOptionChange("file")}
            className=" px-4 py-2 rounded-lg  outline-none font-bold flex justify-center items-center"
          >

          <FaFolderOpen  color="red" className="mr-1"/>  Choose the Files
          </button>
          <button
            onClick={() => handleMediaOptionChange("camera")}
            className=" px-4 py-2 rounded-lg outline-none font-bold flex justify-center items-center"
          >
          <FaCamera   color="blue" className="mr-1"/>  Camera
          </button>
        </div>
      </div>

      {mediaInputType === "camera" && (
        <div className="p-4">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={{
              facingMode: "user",
            }}
          />
          <button
            onClick={capturePhoto}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
          >
            Capture Photo
          </button>
        </div>
      )}

     
      {mediaInputType === "file" && (
        <div className="p-4">
          <input
            type="file"
            multiple
            accept="image/*, video/*"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              files.forEach((file) => {
                if (file.type.startsWith("image")) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setCapturedPhotos([...capturedPhotos, reader.result]);
                  };
                  reader.readAsDataURL(file);
                } else if (file.type.startsWith("video")) {
                  const videoURL = URL.createObjectURL(file);
                  setCapturedVideos([...capturedVideos, videoURL]);
                }
              });
            }}
          />
        </div>
      )}


      <div className="p-4">
        <div className="flex flex-wrap space-x-4">
     
          {capturedPhotos.map((photo, index) => (
            <div key={index} className="relative mb-4">
              <img src={photo} alt={`Captured ${index}`} className="w-full max-w-md" />
              <button
                onClick={() => deleteMedia(index, "photo")}
                className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded-full shadow-md"
              >
                <IoMdClose/>
              </button>
            </div>
          ))}
  
          {capturedVideos.map((video, index) => (
            <div key={index} className="relative mb-4">
              <video
                src={video}
                controls
                className="w-full max-w-md"
                loop
                muted
              ></video>
              <button
                onClick={() => deleteMedia(index, "video")}
                className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full shadow-md"
              >
                 <IoMdClose/>
              </button>
            </div>
          ))}
        </div>
      </div>

    
      <div className="p-4 fixed bottom-0 left-0 right-0 text-center">
        <button
         onClick={handleCreatePost}
          className="bg-[#000000] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#000000]-600 text-center"
        >
          Create Post
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
*/