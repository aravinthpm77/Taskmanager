import React,{useState,useEffect} from "react";
import { Navigate, useNavigate } from "react-router";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
const Home=()=>{

    const navigate=useNavigate();

    const [profileData, setProfileData]=useState(false);
    const [isLoggedIn,setIsLoggedIn]=useState(null);
    const[claimedTask,setClaimedTask]=useState([]);

    const [editingTask, setEditingTask] = useState(null); // For tracking the task being edited
    const [updatedTitle, setUpdatedTitle] = useState("");
    const [updatedDesc, setUpdatedDesc] = useState("");
    
  const token = JSON.parse(localStorage.getItem('Profile'));
  const checkAuthenticationAndFetchProfile = () => {
    console.log('Checking authentication and fetching profile'); 
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

  const completeTask = (taskId) => {
    axios.put(`http://localhost:5000/task/${taskId}/complete`)
        .then(response => {
            console.log('Task completed:', response.data);
            fetchTask(profileData.s_no);  // Refresh the tasks list
        })
        .catch(error => {
            console.error('There was an error completing the task:', error);
        });
};

  
    const deleteTask = (s_no) => {
        axios.delete(`http://localhost:5000/Deletetask/${s_no}`)
            .then(response => {
                console.log('Task deleted:', response.data);
                fetchTask(profileData.s_no);  // Refresh the tasks list
            })
            .catch(error => {
                console.error('There was an error deleting the task:', error);
            });
    };

    const startEditing = (task) => {
        setEditingTask(task.S_no);
        setUpdatedTitle(task.Title);
        setUpdatedDesc(task.Desc);
    };

    const updateTask = (s_no) => {
        axios.put(`http://localhost:5000/task/${s_no}`, {
            title: updatedTitle,
            desc: updatedDesc
        }).then(response => {
            console.log('Task updated:', response.data);
       
            setEditingTask(null);
            fetchTask(profileData.s_no); // Refresh the tasks list
        }).catch(error => {
            console.error('There was an error updating the task:', error);
        });
    };
    const fetchTask = (userId) => {
        
        axios.get(`http://localhost:5000/claimedTask/${userId}` ,userId)
            .then(response => {
                console.log('Claimed Task:', response.data);
                // Handle the claimed products data, e.g., set state in a React component
                setClaimedTask(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the claimed products:', error);
            });
    };
    
    // Call this function when needed, for example after a user logs in
    fetchTask(profileData?.s_no);
    useEffect(() => {
        console.log('Navbar component mounted');
          checkAuthenticationAndFetchProfile();
      }, []);

      useEffect(() => {
        if (profileData) {
            fetchTask(profileData.s_no);
        }
    }, [profileData]);
    return(
        <div className="text-1xl bg-slate-800/20">
           <Navbar/>
           <div class="flex flex-col justify-center   items-center h-[100vh]">
            <div class="!z-5 relative flex flex-col rounded-[20px] max-w-[800px] bg-slate-200 bg-clip-border shadow-3xl shadow-shadow-500  w-full !p-4 3xl:p-![18px]  undefined">
                 
            <div class="relative flex flex-row  justify-between">
                <div class="flex items-center">
                <div class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-100 dark:bg-white/5">
                    <img width="24" height="24" src="https://img.icons8.com/material-rounded/24/checked--v1.png" alt="checked--v1"/>
                </div>
                <h4 class="ml-4 text-xl font-bold text-navy-700 dark:text-black">
                    Tasks
                </h4>
                </div >
                    <a href='/task' class=" text-lg p-2   ml-96 font-bold text-navy-700 dark:text-black hover:bg-black/20  cursor-pointer rounded-lg">
                        Create Task
                    </a>
                    <button 
                        className='flex items-center text-xl text-black hover:cursor-pointer bg-lightPrimary p-2 text-brand-500 hover:bg-black/10    active:bg-white/10 rounded-lg'
                    >
                        <svg stroke="currentColor" fill="bg-black" strokeWidth="0" viewBox="0 0 16 16" className="h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path>
                        </svg>
                    </button>

            </div>
            
               
            <div  class="mt-7 block w-full overflow-x-auto">
                <table class=" bg-transparent w-full ">
                <thead className="">
                <tr className="justify-center">
                <th class=" px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                ID
                                </th>
                <th class=" px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Name
                                </th>
                <th class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Description
                                </th>
                <th class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                Status
                </th>
                <th class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Options
                                </th>
                
                </tr>
                </thead>
                {claimedTask.map(Task => (
                <tbody key={Task.S_no}  className="items-start justify-start ">
                <tr>
                    <td class=" text-base font-bold text-navy-700 text-black">
                                    {Task.S_no}
                    </td>
                    <td class=" text-base font-bold text-navy-700 text-black">
                        {editingTask === Task.S_no ? (
                            <input
                                type="text"
                                value={updatedTitle}
                                onChange={(e) => setUpdatedTitle(e.target.value)}
                                className="border rounded px-2 py-1"
                            />
                        ) : (
                            Task.Title
                        )}
                    </td>
                    <td class="text-base font-bold text-navy-700 text-black/70">
                        {editingTask === Task.S_no ? (
                            <input
                                type="text"
                                value={updatedDesc}
                                onChange={(e) => setUpdatedDesc(e.target.value)}
                                className="border rounded px-2 py-1"
                            />
                        ) : (
                            Task.Desc
                        )}
                        </td>
                    <td class="text-base font-bold text-navy-700 text-black/70">
                    {Task.Status}
                    </td>
                    <td class="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs  whitespace-nowrap p-4">
                    {editingTask === Task.S_no ? (
                    <button className="px-3 py-2 bg-green-400" onClick={() => updateTask(Task.S_no)}>
                        Save
                    </button>
                ) : (
                    <>
                        <button className="px-3 py-2 bg-green-400"
                            onClick={() => completeTask(Task.S_no)}
                            disabled={Task.Status === 'Complete'}
                        >
                            Complete
                        </button>
                        <button className="px-3 py-2 bg-yellow-300/90 ml-2" onClick={() => startEditing(Task)}>Update</button>
                        <button className="px-3 py-2 bg-red-600 ml-2" onClick={() => deleteTask(Task.S_no)}>Delete</button>
                    </>
                )}</td>

                </tr>
                </tbody>
                ))}
                </table>
            </div>
                    {/* <div class="h-full w-full justify-evenly">
                        <div class="mt-5 flex items-center justify-between p-2">
                            <div class="flex items-center justify-center gap-2">
                                <input
                                    type="checkbox"
                                    class="defaultCheckbox relative flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] appearance-none items-center 
                                    justify-center rounded-md border border-gray-300 text-white/0 outline-none transition duration-[0.2s]
                                    checked:border-none checked:text-white hover:cursor-pointer dark:border-white/10 checked:bg-brand-500 dark:checked:bg-brand-400"
                                    name="weekly" 
                                />
                                
                                <p class="text-base font-bold text-navy-700 text-black/60">
                                Landing Page Design
                                </p>
                            </div>
                            <span class="material-symbols-rounded h-6 w-6 text-navy-700 dark:text-white cursor-pointer">
                                drag_indicator
                            </span>  
                        </div>
                    </div> */}
                    {/* </div>
                    <p class="font-normal text-navy-700 mt-20 mx-auto w-max">Task manager console page  <a href="/" target="_blank" class="text-brand-500 font-bold">Completion of your Tasks</a></p>  
                </div> */}

                    
                </div>
                </div>
                </div>
    )
}
export default Home;