import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
const LayOut=()=>{
  return(
    <div>
     <Navbar/>
     <Loading/>
     <Outlet/>
     <Footer/>
    </div>
  )
};
export default LayOut;