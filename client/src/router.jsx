import React from "react";
import { Route,Routes } from "react-router-dom";
import Home from "./page/Home/Home";
import Auth from "./page/Auth/Auth";
import Task from "./page/Task/Task";
const AllRoute =()=>{
    return(
        <Routes>
            <Route exact path='/Home' element={<Home/>}/>
            <Route exact path='/' element={<Auth/>}/>
            <Route exact path='/Task' element={<Task/>}/>
        </Routes>
    )
}
export default AllRoute;