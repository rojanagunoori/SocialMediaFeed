import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';
import { FaGoogle } from "react-icons/fa";
import { auth, db } from '../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Login = ({ setUser }) => {
    const [loading, setLoading] = useState(false);

    const handleGoggleLogin = async () => {
        const provider = new GoogleAuthProvider();
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                await setDoc(userRef, {
                    name: user.displayName,
                    email: user.email,
                    profilePicture: user.photoURL || 'https://www.example.com/default-profile-pic.png',
                    createdAt: new Date()
                });
            }

            setUser(user);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const galleryImages1 = [
        "https://via.placeholder.com/300x400.png?text=Image1",
        "https://via.placeholder.com/300x200.png?text=Image2",
        "https://via.placeholder.com/200x300.png?text=Image3",
        "https://via.placeholder.com/400x300.png?text=Image4",
        "https://via.placeholder.com/300x300.png?text=Image5",
        "https://via.placeholder.com/300x500.png?text=Image6",
        "https://via.placeholder.com/400x400.png?text=Image7"
    ];
    const galleryImages = [
        "https://cdn.pixabay.com/photo/2019/11/03/20/11/portrait-4599553_1280.jpg",
        "https://cdn.pixabay.com/photo/2016/03/26/22/13/man-1281562_1280.jpg",
        "https://cdn.pixabay.com/photo/2020/10/05/08/04/boys-5628502_1280.jpg",
        "https://cdn.pixabay.com/photo/2017/12/01/08/02/paint-2990357_1280.jpg",
        "https://cdn.pixabay.com/photo/2019/05/04/15/24/woman-4178302_1280.jpg",
        "https://cdn.pixabay.com/photo/2019/06/03/05/07/portrait-4248098_1280.jpg",
        "https://cdn.pixabay.com/photo/2019/08/01/05/59/girl-4376755_1280.jpg"
    ];

    return (
        <div className='h-screen w-full'>
            {/* Gallery Section */}
            <div className='relative p-0 flex flex-wrap'>
                {galleryImages.map((src, index) => {
                    const randomHeight = 150 + Math.random() * 150; // Random height between 150px and 300px

                    return (
                        <div
                            key={index}
                            className='overflow-hidden flex-grow'
                            style={{
                                flexBasis: 'calc(33.333% - 4px)', // Images fill 1/3 of the row with small gaps
                                margin: '2px', // Gap between images
                                height: `${randomHeight}px`
                            }}
                        >
                            <img
                                src={src}
                                alt={`Gallery ${index + 1}`}
                                className='w-full h-full object-cover'
                            />
                        </div>
                    );
                })}
            </div>

            {/* Login Section */}
            <div className='fixed flex flex-col justify-center items-center bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-md'>
                <div className='flex'>
                    <img
                        src="https://e4caps.com/cdn/shop/files/FP34327211S-1.jpg"
                        alt="Vibenap"
                        className="mb-4 w-10"
                    />
                    <h1 className="text-xl font-semibold text-center p-1">Vibenap</h1>
                </div>
                <div className="mb-2 text-center">
                    <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">Moments that matter, Share Forever</p>
                </div>

                <button
                    onClick={handleGoggleLogin}
                    className='flex items-center justify-center p-4 bg-[#292929] text-white rounded-full w-64 mb-5'
                    disabled={loading}
                >
                    <FaGoogle className="mr-2" /> {loading ? "Logging in..." : "Continue with Google"}
                </button>
            </div>
        </div>
    );
};

export default Login;
