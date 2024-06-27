import React,{useState,useEffect} from "react";
import {Link} from 'react-router-dom'
import axios from "axios";

import { useNavigate } from 'react-router-dom'; 
const Navbar=()=>{
    

    
      const navigate = useNavigate();
    
      const handleLogout = () => {
        
        localStorage.removeItem('Profile');
        localStorage.removeItem('UserDetails');
        
    
        
        navigate('/login');
      };
    
    

      
      const [isLoggedIn, setIsLoggedIn] = useState(false);
      const [profileData, setProfileData] = useState(null);
      const token = JSON.parse(localStorage.getItem('Profile'));
      const checkAuthenticationAndFetchProfile = () => {
          
          console.log(token);
          if (token) {
              axios.get('http://localhost:5000/verifyToken', {
                  headers: {
                      Authorization: `Bearer ${token.token}`
                  }
              }).then(response => {
                  // If token is valid, set isLoggedIn to true
                  setIsLoggedIn(true);
                  // Fetch profile data
                  axios
            .get("http://localhost:5000/singleUser", {
              headers: { Authorization: `Bearer ${token.token}` },
            })

                    .then(response => {
                        // Set profile data in state
                        setProfileData(response.data);
                    }).catch(error => {
                        console.error("Error fetching profile data:", error);
                    });
              }).catch(error => {
                  // If token is invalid, log out user and remove token from local storage
                  setIsLoggedIn(false);
                  localStorage.removeItem('Profile');
                  localStorage.removeItem('UserDetails');
                  // Clear profile data
                  setProfileData(null);
              });
          } else {  
              // If no token found, set isLoggedIn to false and clear profile data
              setIsLoggedIn(false);
              setProfileData(null);
          }
      };

      console.log(profileData)
  
      
  
      useEffect(() => {
          
          checkAuthenticationAndFetchProfile();
      }, []);
      console.log(profileData,"Navbar");



    return (
        <nav class="fixed z-10 w-screen bg-white border-gray-200 dark:bg-gray-900/90 backdrop-blur-[7px]">
        <div class=" max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
            
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Task Manager</span>
        </a>
        <div class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        {profileData  ? (
          <>
          
          <a href="/Profile"   className=" pl-4 tracking-wider text-white cursor-pointer md:hover:text-blue-500">
          {profileData.Name.charAt(0).toUpperCase() + profileData.Name.slice(1).toLowerCase()}
          </a>
          <a href="/"  className="text-white px-5 md:hover:text-blue-500" onClick={handleLogout}>Logout</a>
          
        </>
      ) : (
        <a href="/"  className="text-white  md:hover:text-blue-500">Sign IN</a>
      )}


            
        </div>
        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
          <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0   ">
            <li>
              <a href="/Home" class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
            </li>
            <li>
              <a href="/#about" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
            </li>
            <li>
              <a href="/seller-dashboard" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-90 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Task </a>
            </li>
            <li>
              <a href="/profile" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Profile</a>
            </li>
            <li>
              <a href="/#contact" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
            </li>
          </ul>
        </div>
        </div>
      </nav>
    )
}

export default Navbar