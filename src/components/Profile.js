
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase/firebase'; // Assuming you have Firestore set up
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { IoMdArrowBack } from "react-icons/io";
import { FaHeart } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';

const Profile = () => {
  const navigate = useNavigate();
  const [bannerPic, setBannerPic]=useState("https://images.freeimages.com/images/large-previews/b58/sunset-on-madeira-1-1363044.jpg")
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentSlides, setCurrentSlides] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch user data and posts on component mount
  useEffect(() => {
    if (user) {
      const userId = user.uid;
      const userDocRef = doc(db, 'users', userId);
      
      // Fetch user data
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      });

      // Fetch user's posts
      const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
      getDocs(postsQuery).then((querySnapshot) => {
        const fetchedPosts = [];
        querySnapshot.forEach((doc) => {
          fetchedPosts.push({ id: doc.id, ...doc.data() });
        });
        setPosts(fetchedPosts);
        setCurrentSlides(fetchedPosts.map(() => 0)); // Initialize slide states
      });
    }
  }, [user]);

  const handlePrev = (postIndex) => {
    setCurrentSlides((prev) => {
      const updatedSlides = [...prev];
      updatedSlides[postIndex] =
        updatedSlides[postIndex] > 0 ? updatedSlides[postIndex] - 1 : posts[postIndex].media.length - 1;
      return updatedSlides;
    });
  };

  const handleNext = (postIndex) => {
    setCurrentSlides((prev) => {
      const updatedSlides = [...prev];
      updatedSlides[postIndex] =
        updatedSlides[postIndex] < posts[postIndex].media.length - 1 ? updatedSlides[postIndex] + 1 : 0;
      return updatedSlides;
    });
  };

  const handleEditProfile = () => {
    navigate('/editprofile');
  };

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      setPosts(posts.filter(post => post.id !== postId)); // Remove deleted post from UI
      toast.success('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete the post.');
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleBack=()=>{
    navigate(-1)
  }

  return (
    <div className="w-full font-sans">
      <div className="relative bg-cover bg-center h-72" style={{ backgroundImage: `url(${userData.bannerPic || bannerPic})` }}>
        <button className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded" onClick={handleBack}><IoMdArrowBack size={28}/></button>
        <div className="absolute bottom-[-40px] left-12 transform -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-white">
          <img src={userData.profilePic || 'https://via.placeholder.com/100'} alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="flex justify-end px-4 mt-4">
        <button onClick={handleEditProfile} className="border border-black text-black px-3 py-1 rounded">Edit Profile</button>
      </div>

      <div className="mt-8 px-4">
        <h2 className="text-2xl font-bold">{userData.name}</h2>
        <p className="text-gray-500">{userData.bio || 'No bio available.'}</p>
      </div>

      <div className="mt-8 px-4">
        <h3 className="text-lg font-bold mb-4">My Posts</h3>
        {posts.length==0?<p className='font-semibold text-center'>No Posts</p>:posts.map((post, postIndex) => (
          <div key={post.id} className="mb-6 border border-gray-200 rounded-lg p-4">
            <div className="relative">
              {post.media.map((media, index) => (
                <div
                  key={index}
                  className={`w-full h-64 ${currentSlides[postIndex] === index ? 'block' : 'hidden'}`}
                >
                  {media.endsWith('.mp4') ? (
                    <video src={media} controls className="w-full h-full object-cover" />
                  ) : (
                    <img src={media} alt={`Post media ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                  )}
                </div>
              ))}
              <div className="absolute inset-0 flex justify-between items-center">
                <button
                  className="bg-black bg-opacity-50 text-white p-2 rounded-full"
                  onClick={() => handlePrev(postIndex)}
                >
                  &lt;
                </button>
                <button
                  className="bg-black bg-opacity-50 text-white p-2 rounded-full"
                  onClick={() => handleNext(postIndex)}
                >
                  &gt;
                </button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 text-sm rounded">
                {currentSlides[postIndex] + 1}/{post.media.length}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-gray-800 mb-2">
                {post.text.length > 30 ? `${post.text.substring(0, 30)}...` : post.text}
              </p>
              <div className="flex items-center text-gray-500">
                <span className="text-red-500 text-xl mr-2"><FaHeart/></span>
                <span>{post.likes}</span>
              </div>
            </div>
            <div className="flex justify-end mt-2">
                <button 
                  onClick={() => handleDeletePost(post.id)} 
                  className="text-red-500 hover:text-red-700"
                >
                  <MdDelete/>
                </button>
              </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;



/*
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate=useNavigate()
  const posts = [
    {
      id: 1,
      text: 'This is my first post!',
      media: ['https://via.placeholder.com/300', 'https://via.placeholder.com/300/ff7f7f'],
      likes: 45,
    },
    {
      id: 2,
      text: 'Another day, another adventure!',
      media: ['https://via.placeholder.com/300/7f7fff'],
      likes: 32,
    },
  ];

  const [currentSlides, setCurrentSlides] = useState(posts.map(() => 0));

  const handlePrev = (postIndex) => {
    setCurrentSlides((prev) => {
      const updatedSlides = [...prev];
      updatedSlides[postIndex] =
        updatedSlides[postIndex] > 0 ? updatedSlides[postIndex] - 1 : posts[postIndex].media.length - 1;
      return updatedSlides;
    });
  };

  const handleNext = (postIndex) => {
    setCurrentSlides((prev) => {
      const updatedSlides = [...prev];
      updatedSlides[postIndex] =
        updatedSlides[postIndex] < posts[postIndex].media.length - 1 ? updatedSlides[postIndex] + 1 : 0;
      return updatedSlides;
    });
  };

  const handleEditProfile=()=>{
    navigate("/editprofile")
  }

  return (
    <div className="w-full font-sans">
      <div className="relative bg-cover bg-center h-72" style={{ backgroundImage: "url('https://images.freeimages.com/images/large-previews/b58/sunset-on-madeira-1-1363044.jpg')" }}>
        <button className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">Back</button>
        <div className="absolute bottom-[-40px] left-12 transform -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-white">
          <img src="https://via.placeholder.com/100" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="flex justify-end px-4 mt-4">
        <button onClick={handleEditProfile} className="border border-black text-black px-3 py-1 rounded">Edit Profile</button>
      </div>

      <div className="mt-8 px-4">
        <h2 className="text-2xl font-bold">John Doe</h2>
        <p className="text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <div className="mt-8 px-4">
        <h3 className="text-lg font-bold mb-4">My Posts</h3>
        {posts.map((post, postIndex) => (
          <div key={post.id} className="mb-6 border border-gray-200 rounded-lg p-4">
            <div className="relative">
              {post.media.map((media, index) => (
                <div
                  key={index}
                  className={`w-full h-64 ${currentSlides[postIndex] === index ? 'block' : 'hidden'}`}
                >
                  {media.endsWith('.mp4') ? (
                    <video src={media} controls className="w-full h-full object-cover" />
                  ) : (
                    <img src={media} alt={`Post media ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                  )}
                </div>
              ))}
              <div className="absolute inset-0 flex justify-between items-center">
                <button
                  className="bg-black bg-opacity-50 text-white p-2 rounded-full"
                  onClick={() => handlePrev(postIndex)}
                >
                  &lt;
                </button>
                <button
                  className="bg-black bg-opacity-50 text-white p-2 rounded-full"
                  onClick={() => handleNext(postIndex)}
                >
                  &gt;
                </button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 text-sm rounded">
                {currentSlides[postIndex] + 1}/{post.media.length}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-gray-800 mb-2">
                {post.text.length > 30 ? `${post.text.substring(0, 30)}...` : post.text}
              </p>
              <div className="flex items-center text-gray-500">
                <span className="text-red-500 text-xl mr-2">❤️</span>
                <span>{post.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
*/