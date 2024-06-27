import React, { useState ,useRef } from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const Auth = ()=>{
    const [isSignup,setIsSignup]=useState(false);
    const[name,setName]=useState('');
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const [formSubmitted,setFormSubmitted]=useState(false);
    const formRef=useRef(null);
    const navigate = useNavigate();
    
    const handleSwitch =()=>{
        setIsSignup(!isSignup);
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(name, email, password, "Email Details");

        try {
            if (isSignup) {
                await handleSignup();
            } else {
                await handleLogin();
            }
        } catch (error) {
            console.error('Authentication Error', error);
        }
    }
    const handleSignup = async () => {
        try {
            const response = await axios.post('https://taskmanager-yrc9.onrender.com/auth', { name, email, password }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            toast.success("Created Successfully");
            toast.success("LogIn Now");
            setFormSubmitted(true);
            navigate('/');
        } catch (error) {
            console.error('Signup Error:', error.response || error);
            toast.error("Error: " + (error.response?.data?.message || error.message));
        }
    }

    const handleLogin = async () => {
        try {
            if (email === "admin@gmail.com" && password === "admin@123") {
                navigate("/admin");
            } else {
                const response = await axios.post('https://taskmanager-yrc9.onrender.com/login', { email, password }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data && response.data.Status === 'Success') {
                    toast.success('Logged In');
                    
                    localStorage.setItem("UserDetails", JSON.stringify({ name: response.data.name, email, password }));
                    localStorage.setItem("Profile", JSON.stringify({ token: response.data.token }));
                    navigate('/Home');
                } else {
                    toast.warning(`Warning: ${response.data.Error}`);
                }
            }
        } catch (error) {
            console.error('Login Error:', error.response || error);
            toast.error("Error Login");
        }
    }

    
    return(
        <div>
        
        
            
            <div class="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
                <div class="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                    <div class="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                        
                        <div class="mt-6 flex flex-col items-center">

                            <h1 class="text-2xl uppercase xl:text-3xl font-bold">
                               {isSignup ? 'Sign UP':'Log IN'}
                            </h1>
                            <div class="w-full flex-1 mt-8">
                                

                                
                            <form onSubmit={handleSubmit}>
                                <div class="mx-auto max-w-xs">
                                    {isSignup &&
                                        <input
                                            class="w-full mt-3 px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                            type="text" name="amenities" placeholder="Name" onChange={(e) => {setName(e.target.value) }}/>
                                        }
                                    <input
                                        class="w-full mt-3 px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                        type="email" name="propertyName" placeholder="Email" onChange={(e) => { setEmail(e.target.value) }}/>
                                    <input
                                        class="w-full mt-3 px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                        type="password" name="password" placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}}/>
                                    
                                    {isSignup?
                                    <button  type="submit"
                                        class="mt-5  tracking-wide font-semibold bg-indigo-300 hover:bg-indigo-500 hover:text-white cursor-pointer text-gray-100 w-full py-4 rounded-lg  transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                                        
                                        <span class="ml-3">
                                            SignUp
                                        </span>
                                    </button>
                                    :
                                    <button  type="submit"
                                        class="mt-5 tracking-wide font-semibold bg-indigo-300 hover:bg-indigo-500 hover:text-white cursor-pointer text-gray-100 w-full py-4 rounded-lg  transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                                        
                                        <span class="ml-3">
                                            SignIn
                                        </span>
                                    </button>
}           
                                    <button type="button"  onClick={handleSwitch} className="text-slate-800 mt-5 text-base uppercase tracking-widest cursor-pointer font-normal hover:text-teal-950" > {isSignup ? 'Log In' : 'Sign Up'}</button>
                                    <p class="mt-6 text-xs text-gray-600 text-center">
                                        I agree to terms and condition of this website 
                                        <br/>
                                        <a href="#" class="border-b border-gray-500 border-dotted">
                                            Terms of Service
                                        </a>
                                        <br/>
                                        <a href="#" class="border-b border-gray-500 border-dotted">
                                            Privacy Policy 
                                        </a>
                                    </p>
                                
                                </div>
                            </form>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
                <div 
                    className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')" }}>
                </div>
            </div>
                </div>
            </div>

        </div>
        
       
    
    )
}

export default Auth;