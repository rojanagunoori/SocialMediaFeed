import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css"
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import SwiperCore, { Pagination } from 'swiper';
import { FaDiscord, FaFacebook, FaHeart, FaInstagram, FaReddit, FaRegCopy, FaShare, FaTelegram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { IoIosClose } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';


//SwiperCore.use([Pagination]); 
//https://images.freeimages.com/images/large-previews/c9a/sunset-on-madeira-4-1363028.jpg

const Feed = ({ user }) => {
    const [liked, setLiked] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showShareModal, setShowShareModal] = useState(false)
    const navigate=useNavigate()
    const [posts, setPosts] = useState([])
/**[
        {
            id: 1,
            userName: 'John Doe',
            userProfilePic: 'https://via.placeholder.com/50',
            postTime: '2 hours ago',
            text: 'This is a sample post text.',
            images: ['https://via.placeholder.com/400x300', 'https://via.placeholder.com/400x300', 'https://via.placeholder.com/400x300'],
            liked: false,
            likeCount: 4,
            uniqueColor: ''
        },
        {
            id: 2,
            userName: 'Jane Smith',
            userProfilePic: 'https://via.placeholder.com/50',
            postTime: '4 hours ago',
            text: 'Here is another post with a different background color!',
            images: ['https://via.placeholder.com/400x300', 'https://via.placeholder.com/400x300'],
            liked: false,
            likeCount: 20,
            uniqueColor: ''
        },
    ] */
    const lightColors = [
        '#E0F7FA',
        '#FFF9C4',
        '#FFEBEE',
        '#F1F8E9',
        '#F3E5F5',
        '#FFECB3',
        '#FFF3E0',
        '#C8E6C9',
    ];

    useEffect(() => {
        const fetchPosts = async () => {
          const querySnapshot = await getDocs(collection(db, "posts"));
          console.log(querySnapshot)
          const fetchedPosts = [];
          querySnapshot.forEach((doc) => {
            fetchedPosts.push({ id: doc.id, ...doc.data() });
          });
          console.log(fetchedPosts)
          setPosts(fetchedPosts);
        };
        fetchPosts();
      }, []);
    
      
    

    const generateRandomLightColor = () => {
        //const letters='0123456789ABCDFF';
        const letters = '89ABCDEF';
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)]//Math.random()*6
        }
        return color;
    }

    const assignUniqueColors = () => {
        return posts.map(post => ({
            ...post,
            // uniqueColor:lightColors[Math.floor(Math.random()*lightColors.length)]
            uniqueColor: generateRandomLightColor()
        }))
    }

    const handleDotClick = (index) => {
        setActiveIndex(index);
    };

    const handleLike = (postId) => {
        setPosts((prevPosts) =>
            prevPosts.map(post =>
                post.id === postId ? { ...post, liked: !post.liked } : post
            ))
    }

    const handleShare = () => {
        setShowShareModal(true)
    }

    const handleCloseModal = () => {
        setShowShareModal(false)


    }

    const handleViewProfile=()=>{
        navigate("/profile")
    }

    const updatedPosts = assignUniqueColors();

    return (
        <div className='min-h-screen py-8 px-4'>
            <div className='flex items-center mb-6' onClick={handleViewProfile}>
                <img src={user.photoURL || "https://via.placeholder.com/50"}
                    alt='Profile'
                    className='w-14 h-14 rounded-full border-2 border-gray-300'
                />
                <div className='ml-4'>
                    <p className='text-lg text-gray-500'>Welcome back,</p>
                    <h2 className='text-2xl font-bold'>{user?.displayName}</h2>
                </div>
            </div>
            <h1 className='text-3xl font-semibold mb-6'>Feeds</h1>
            <div className='space-y-6'>
                {updatedPosts.length == 0 ? <p className='text-center font-semibold'>No Posts</p>
                    :
                    (
                        updatedPosts.map(post => (
                            <div
                                key={post.id}
                                style={{ backgroundColor: post.uniqueColor }}
                                className='bg-white rounded-lg shadow-lg p-4'
                            >
                                <div className='flex items-center mb-4'>
                                    <img src={post.userProfilePic}
                                        alt="User Profile"
                                        className='w-12 h-12 rounded-full border-2 border-gray-300'
                                    />
                                    <div className='ml-4'>
                                        <h3 className='font-semibold'>{post.userName}</h3>
                                        <p className='text-sm text-gray-500'>{post.postTime}</p>
                                    </div>
                                </div>
                                <p className='mb-4 text-lg'>{post.text}</p>
                                <div className='mb-4'>
                                    <Swiper
                                        spaceBetween={10}
                                        slidesPerView={1}
                                        pagination={{
                                            clickable: true,
                                            type: 'bullets',
                                        }}
                                        loop={true}
                                        className="swiper-container"

                                    //modules={[Pagination]}

                                    >{post?.media.map((image, index) => (
                                        <SwiperSlide key={index}>
                                            <img src={image}
                                                alt={`Post media ${index}`}
                                                className='w-full h-64 oject-cover rounded-lg'
                                            />
                                        </SwiperSlide>
                                    ))}

                                    </Swiper>
                                    <div className='flex justify-center mt-4'>
                                        {post.media.map((_, index) => (
                                            <div
                                                key={index}
                                                className={`dot mx-2 w-3 h-3 rounded-full cursor-pointer 
                        ${index === activeIndex ? 'bg-blue-500' : 'bg-gray-400'}`}
                                                onClick={() => handleDotClick(index)} // Handle dot click
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className='flex justify-between items-center'>
                                    <div className='flex items-center'>
                                        <FaHeart onClick={() => handleLike(post.id)}
                                            className={`text-xl cursor-pointer ${post.liked ? "text-[#D95B7F]" : "text-gray-500"}`} />

                                        <span className='ml-2 text-sm'>{post.likeCount}</span>
                                    </div>
                                    <div className='flex items-center bg-gray-300 rounded-xl p-2' onClick={handleShare}>
                                        <FaShare className='text-xl text-gray-500 cursor-pointer' />
                                        <span className='ml-2 text-sm'>Share</span>
                                    </div>
                                </div>


                            </div>

                        ))
                    )
                }

            </div>

            {showShareModal && (
                <div className='fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50'>
                    <div className='bg-white rounded-lg p-6 '>
                        <div className='flex justify-between items-center mb-4 '>
                            <h2 className='text-2xl font-semibold mb-4'>Share post</h2>
                            <button className='px-4 py-2 text-gray-500 rounded-lg'
                                onClick={handleCloseModal}><IoIosClose className='text-gray-500 text-4xl cursor-pointer' /></button>

                        </div>
                        <div className='grid grid-cols-3 gap-4 mb-4'>
                            <div className='flex flex-col items-center'>
                                <div className='bg-gray-200 rounded-3xl p-2'>
                                    <FaTwitter className='text-blue-500 text-2xl cursor-pointer ' />
                                </div>
                                <span className='text-sm'>Twitter</span>
                            </div>


                            <div className='flex flex-col items-center'>
                                <div className='bg-gray-200 rounded-3xl p-2'>
                                    <FaFacebook className='text-blue-500 text-2xl cursor-pointer ' />
                                </div>
                                <span className='text-sm'>Facebook</span>
                            </div>

                            <div className='flex flex-col items-center'>
                                <div className='bg-gray-200 rounded-3xl p-2'>
                                    <FaReddit className='text-blue-500 text-2xl cursor-pointer ' />
                                </div>
                                <span className='text-sm'>Reddit</span>
                            </div>
                            <div className='flex flex-col items-center'>
                                <div className='bg-gray-200 rounded-3xl p-2'>
                                    <FaDiscord className='text-blue-500 text-2xl cursor-pointer ' />
                                </div>
                                <span className='text-sm'>Discord</span>
                            </div>
                            <div className='flex flex-col items-center'>
                                <div className='bg-gray-200 rounded-3xl p-2'>
                                    <FaWhatsapp className='text-blue-500 text-2xl cursor-pointer ' />
                                </div>
                                <span className='text-sm'>WhatsApp</span>
                            </div>
                            <div className='flex flex-col items-center'>
                                <div className='bg-gray-200 rounded-3xl p-2'>
                                    <FaTelegram className='text-blue-500 text-2xl cursor-pointer ' />
                                </div>
                                <span className='text-sm'>Telegram</span>
                            </div>
                            <div className='flex flex-col items-center'>
                                <div className='bg-gray-200 rounded-3xl p-2'>
                                    <FaInstagram className='text-blue-500 text-2xl cursor-pointer ' />
                                </div>
                                <span className='text-sm'>Instagram</span>
                            </div>





                        </div>
                        <div>
                        <h1 className='text-lg'>Page Link</h1>
    <div className='flex items-center border-b-2 mb-4'>
        
    <input value="https://arnav/feed"
                                type='text'
                                className='w-full p-2 text-sm'
                                placeholder='Enter page link...'
                            />
                            <FaRegCopy className='text-gray-500 text-lg ml-2 cursor-pointer' />
        </div>

                        </div>
                    </div>

                </div>
            )}


        </div>
    )
}

export default Feed