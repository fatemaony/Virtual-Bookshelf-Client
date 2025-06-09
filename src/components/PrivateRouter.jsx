import React, { use } from "react";
import { AuthContext } from "../contexts/Context";
import { Navigate, useLocation } from "react-router";
const PrivateRouter =({children})=>{
  const {user, loading}= use(AuthContext)
  const location = useLocation();
  if (!loading) {
    return <span className="loading loading-ring loading-xl"></span>  
  }

  if (!user) {
    return <Navigate to={"/signin"} state={location.pathname}></Navigate>
    
  }
  return children;
};
export default PrivateRouter;