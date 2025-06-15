import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup, 
  signOut 
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebase.init";
import { AuthContext } from "./Context";
const AuthProvider =({children})=>{


  const [loading, setLoading]=useState(true)
  const [user, setUser]=useState(null)
 
  // create user with email
  const createUser=async(email, password)=>{
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
    
  }

  const signInWithGoogle=()=>{
    const provider = new GoogleAuthProvider
    return signInWithPopup(auth, provider);
  }

  const SignInWithEmail =(email, password)=>{
    setLoading(true)
    return signInWithEmailAndPassword(auth, email, password)

  }
  const getFirebaseToken = async () => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    return currentUser.getIdToken(true);
  }
  return null;
};


  //sign out
  const signOutUser = ()=>{
    setLoading(true);
    return signOut(auth);
  }


  useEffect(()=>{
    const unSubscribe =onAuthStateChanged(auth, currentUser=>{
      setUser(currentUser)
      console.log(' user is changed',currentUser)
    })
    return ()=>{
      unSubscribe()
    }
  },[])

  const authInfo ={
    loading,
    user,
    createUser,
    signInWithGoogle,
    SignInWithEmail,
    signOutUser,
    getFirebaseToken,
  }


  return(
    <AuthContext.Provider value={authInfo}>
     {children}
    </AuthContext.Provider>
  )
};
export default AuthProvider;