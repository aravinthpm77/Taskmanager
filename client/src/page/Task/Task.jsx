import React,{useState,useEffect} from "react";
import axios from 'axios';
import Navbar from "../../components/navbar/Navbar";
import {toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router";
const Task =()=>{

    const navigate = useNavigate();


    const[title,setTaskTitle]=useState('');
    const[desc,setTaskDesc]=useState('');

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
      


    const handleSubmit = async (e) => {
        e.preventDefault();
        const userID=profileData.s_no;
        console.log(userID);
        console.log(title,userID, desc, "TaskDetails");

        try {
            const response = await axios.post('http://localhost:5000/Task', {userID,title,desc }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            toast.success("Task Created");
            
            
            navigate('/Home');
        } catch (error) {
            console.error('Posting Error', error);
            toast.error("Error in Creating");
        }
    }
    return(
        <div>
            <Navbar/>
            
            <div class="flex pt-20 items-center justify-center p-12 bg-black/30">
    
                <div class="mx-auto w-full max-w-[550px] ">
                    <form onSubmit={handleSubmit}>
                        <div class="mb-5">
                            <label for="name" class="mb-3 block text-base font-medium text-[#07074D]">
                            Task Name
                            </label>
                            <input type="text" name="name" id="name" placeholder="Task Name" onChange={(e)=>{setTaskTitle(e.target.value)}}
                                class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                        </div>
                        
                        <div class="mb-5">
                            <label for="email" class="mb-3 block text-base font-medium text-[#07074D]">
                                Task Description
                            </label>
                            <input type="text" name="email" id="email" placeholder="Enter Task description" onChange={(e)=>{setTaskDesc(e.target.value)}}
                                class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md" />
                        </div>
                        

                        

                        <div className="mt-14">
                            <button
                                class="hover:shadow-form w-full rounded-md bg-[#6A64F1] hover:bg-[#4944b4] py-3 px-8 text-center text-base font-semibold text-white outline-none">
                                Create a Task
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
        </div>
    )
}
export default Task;