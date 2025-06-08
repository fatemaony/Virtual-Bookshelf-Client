import React, { use } from "react";
import Registerlottie from '../assets/lottie/Register.json'
import Lottie from "lottie-react";
import { Link } from "react-router";
import { AuthContext } from "../contexts/Context";
const Register=()=>{

  const {signInWithGoogle, createUser}=use(AuthContext)

  const handleRegister=(e)=>{
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    console.log(email, password)

    createUser(email, password)
    .then(result=>{
      console.log("created an account",result.user)
    })
    .catch(error=>{
      console.log(error)
    })
    
  };

  const handleSignInWithGoogle=()=>{
     signInWithGoogle()
     .then(result=>{
      console.log("sign in with google",result.user)
     })
  }
  return(
    <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content flex-col lg:flex-row-reverse">
    <div className="text-center lg:text-left">
     <Lottie animationData={Registerlottie} loop={true} style={{with:"400px", height:"400px"}} ></Lottie>
      
    </div>
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
         <h1 className="text-5xl text-red-950 font-bold">Register Now!!</h1>
        <form  onSubmit={handleRegister}  className="fieldset">
          <label className="label">Name</label>
          <input name="name" type="name" className="input" placeholder="Your Name" />
          <label className="label">Email</label>
          <input name="email" type="email" className="input" placeholder="Email" />
          <label className="label">Password</label>
          <input name="password" type="password" className="input" placeholder="Password" />
          <div><a className="link link-hover">Forgot password?</a></div>
          <div className="flex w-full flex-col">
          <button className="btn text-white bg-red-950 mt-4">Create Account</button>
          <p className="pt-3">Already have an account? <Link className="text-green-800" to={"/signin"}>Sign In</Link></p>
          
          </div>
        </form>

        <div className="divider">OR</div>
          <button onClick={handleSignInWithGoogle} className="btn bg-white text-black hover:bg-gray-300 border-[#e5e5e5]">
          <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
          Login with Google
          </button>
      </div>
    </div>
  </div>
    </div>
  )
};
export default Register;