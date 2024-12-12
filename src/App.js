import {BrowserRouter as Router,Route,Switch, Routes, useNavigate} from "react-router-dom"

import './App.css';
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./components/Login";
import CreatePost from "./components/CreatePost";

import { auth } from "./firebase/firebase";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import { FaPlus } from "react-icons/fa";

function App() {

  const [user,setUser]=useState(null)
  //const navigate=useNavigate()

  useEffect(() => {
    const unsubscribe=onAuthStateChanged(auth,(user)=>{
      setUser(user)
    })
   return ()=>unsubscribe();
  },[])
  

  const handleaddPostClick=()=>{
   // navigate("/createpost")
  }

  return (
  <Router>
    <div className=" bg-yellow">
      {!user?(
        <Login setUser={setUser}/>
      ):(
        <>
       
        <main className="max-w-3xl mx-auto py-4">
          <Routes>
          <Route path="/" element={<Feed user={user}/>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/createpost" element={<CreatePost />} />
          </Routes>
        </main>
        <div onClick={() => window.location.href = '/createpost'}
        //onClick={handleaddPostClick}
        className="fixed bottom-4 right-4 bg-black text-white z-10 rounded-full p-4 shadow-lg cursor-pointer transition-all hover:bg-opacity-80">
<FaPlus className="text-2xl"/>
        </div>
        </>
      )}

    </div>
  </Router>
  );
}

export default App;
