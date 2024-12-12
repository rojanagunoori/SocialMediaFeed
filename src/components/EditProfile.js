import React, { useEffect, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dey2l6q0u/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

const EditProfile = () => {
  const auth = getAuth();
  const navigate=useNavigate()
const user = auth.currentUser;
  const [profilePic, setProfilePic] = useState('https://via.placeholder.com/100');
  const [bannerPic, setBannerPic]=useState("https://images.freeimages.com/images/large-previews/b58/sunset-on-madeira-1-1363044.jpg")
  const [bio, setBio] = useState('');
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  //https://images.freeimages.com/images/large-previews/b58/sunset-on-madeira-1-1363044.jpg

  useEffect(() => {
    // Fetch user profile from Firestore (optional)
    const fetchUserProfile = async () => {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setName(userDoc.data().name || '');
        setBio(userDoc.data().bio || '');
        setProfilePic(userDoc.data().profilePic || 'https://via.placeholder.com/100');
        setBannerPic(userDoc.data().bannerPic || 'https://images.freeimages.com/images/large-previews/b58/sunset-on-madeira-1-1363044.jpg');
      }
    };
    
    if (auth.currentUser) {
      setUserId(auth.currentUser.uid);
      fetchUserProfile();
    }
  }, []);
  
  
  const handleProfilePicChange1 = (e) => {
    const file = e.target.files[0];
    if (file) {
      
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePicChange2 = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Display the selected image immediately
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePic(reader.result); // Update the preview immediately
      };
      reader.readAsDataURL(file);
  
      // Upload to Cloudinary
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
        const response = await axios.post(CLOUDINARY_URL, formData);
        setProfilePic(response.data.secure_url); // Update the state with the Cloudinary URL
      } catch (error) {
        console.error("Error uploading image: ", error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleBannerChange2 = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Display the selected image immediately
      const reader = new FileReader();
      reader.onload = () => {
        setBannerPic(reader.result); // Update the preview immediately
      };
      reader.readAsDataURL(file);
  
      // Upload to Cloudinary
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
        const response = await axios.post(CLOUDINARY_URL, formData);
        setBannerPic(response.data.secure_url); // Update the state with the Cloudinary URL
      } catch (error) {
        console.error("Error uploading image: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        
        // Upload to Cloudinary
        const response = await axios.post(CLOUDINARY_URL, formData);
        setProfilePic(response.data.secure_url); // Use Cloudinary URL
      } catch (error) {
        console.error("Error uploading image: ", error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        
        // Upload to Cloudinary
        const response = await axios.post(CLOUDINARY_URL, formData);
        setBannerPic(response.data.secure_url); // Use Cloudinary URL
      } catch (error) {
        console.error("Error uploading image: ", error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  

  const handleBannerChange1 = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBannerPic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfileChanges = async () => {
    const userId = user.uid;
    const userDocRef = doc(db, 'users', userId);
  
    // Check if the document exists
    const docSnap = await getDoc(userDocRef);
    console.log(docSnap)
  
    if (docSnap.exists()) {
      // Proceed with the update
      await updateDoc(userDocRef, {
        name,
        bio,
        profilePic,  // Cloudinary URL
        bannerPic,   // Cloudinary URL
      });
      toast.success("Profile updated successfully");
    } else {
      console.log("No such document!");
      // Optionally, create the document if it doesn't exist
      await setDoc(userDocRef, {
        name,
        bio,
        profilePic,
        bannerPic,
      });
    }
  };


  const saveProfileChanges1 = async () => {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      name,
      bio,
      profilePic,
      bannerPic,
    });
  };

  const handleBack=()=>{
    navigate(-1) 
  }

  return (
    <div className="w-full font-sans relative min-h-screen flex flex-col">
      {/* Banner Section */}
      <div
        className="relative bg-cover bg-center h-60"
        style={{ backgroundImage: `url(${bannerPic})` }}
      >
        <button onClick={handleBack} className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded"><IoMdArrowBack size={28}/></button>
        <label
          htmlFor="bannerEdit"
          className="absolute bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full cursor-pointer"
        >
          <FaPencilAlt className='m-1'/>
        </label>
        <input id="bannerEdit" type="file" accept="image/*" className="hidden" onChange={handleBannerChange}/>
        {/* Profile Picture */}
        <div className="absolute -bottom-12 left-1/4 transform -translate-x-1/2">
          <div className="relative">
            <img
              src={profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />
            <label
              htmlFor="profilePicInput"
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer"
            >
              <FaPencilAlt className='m-1'/>
            </label>
            <input
              id="profilePicInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePicChange}
            />
          </div>
        </div>
      </div>

      {/* Name and Bio Section */}
      <div className="mt-16 px-4 flex flex-col items-center w-full">
        {/* Name Field */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full text-lg font-bold text-center border-b border-gray-300 focus:outline-none"
        />
        {/* Bio Field */}
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full mt-4 border border-gray-300 rounded p-2 focus:outline-none"
          rows="3"
          placeholder="Write something about yourself..."
        />
      </div>

      {/* Save Button */}
      <div className="mt-auto fixed bottom-4 w-full flex justify-center">
        <button className="bg-blue-500 text-white px-6 py-2 rounded" onClick={saveProfileChanges} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  );
};

export default EditProfile;
