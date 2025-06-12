import Lottie from "lottie-react";
import SigninLottie from '../assets/lottie/Signin.json'
import React, { use } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../contexts/Context";
import Swal from "sweetalert2";

const SignIn = () => {
  const { SignInWithEmail, signInWithGoogle } = use(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state || "/";

  const handleSignIn = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    
    if (!email || !password) {
      Swal.fire({
        title: 'Missing Information!',
        text: 'Please fill in all required fields.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#950d0b'
      });
      return;
    }

    try {
      const result = await SignInWithEmail(email, password);
      console.log("Sign in successfully", result.user);

      
      try {
        await fetch(`http://localhost:3000/users/${result.user.email}/login`, {
          method: "PATCH",
          headers: {
            'content-type': 'application/json'
          }
        });
      } catch (dbError) {
        console.log("Failed to update login timestamp:", dbError);
        
      }

      Swal.fire({
        title: 'Successfully Signed In! 🎉',
        text: `Welcome back, ${result.user.displayName || 'User'}!`,
        icon: 'success',
        showConfirmButton: true,
        confirmButtonText: 'Get Started',
        confirmButtonColor: '#950d0b',
        timerProgressBar: true,
        allowOutsideClick: false,
        customClass: {
          popup: 'animate__animated animate__fadeInUp'
        }
      });
      
      navigate(from);
      
    } catch (error) {
      console.error("Sign in error:", error);
      
      let errorMessage = 'Something went wrong during sign in. Please try again.';
      
    
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address. Please register first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      Swal.fire({
        title: 'Sign In Failed!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      console.log("Google sign in successfully", result.user);

      
      let userExists = false;
      try {
        const userResponse = await fetch(`http://localhost:3000/users/${result.user.email}`);
        userExists = userResponse.ok;
      } catch (error) {
        console.log("Error checking user existence:", error);
      }

      
      if (!userExists) {
        const userProfile = {
          email: result.user.email,
          Name: result.user.displayName,
          photo: result.user.photoURL,
          uid: result.user.uid,
          creationTime: result.user?.metadata?.creationTime,
          lastSignInTime: result.user?.metadata?.lastSignInTime,
          registeredAt: new Date().toISOString(),
          isActive: true,
          provider: 'google'
        };

        try {
          await fetch('http://localhost:3000/users', {
            method: "POST",
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(userProfile)
          });
          console.log("New Google user profile created");
        } catch (dbError) {
          console.log("Failed to create user profile:", dbError);
         
        }
      } else {
       
        try {
          await fetch(`http://localhost:3000/users/${result.user.email}/login`, {
            method: "PATCH",
            headers: {
              'content-type': 'application/json'
            }
          });
          console.log("Login timestamp updated for existing user");
        } catch (dbError) {
          console.log("Failed to update login timestamp:", dbError);
          
        }
      }

      const welcomeMessage = userExists 
        ? `Welcome back, ${result.user.displayName}!`
        : `Welcome to ReadRipple, ${result.user.displayName}! Your profile has been created.`;

      Swal.fire({
        title: 'Successfully Signed In! 🎉',
        text: welcomeMessage,
        icon: 'success',
        showConfirmButton: true,
        confirmButtonText: 'Get Started',
        confirmButtonColor: '#950d0b',
        timerProgressBar: true,
        allowOutsideClick: false,
        customClass: {
          popup: 'animate__animated animate__fadeInUp'
        }
      });
      
      navigate(from);
      
    } catch (error) {
      console.error("Google sign in error:", error);
      
      let errorMessage = 'Something went wrong during Google sign in. Please try again.';
      
     
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign in was cancelled. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Pop-up was blocked by your browser. Please allow pop-ups and try again.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Sign in request was cancelled. Please try again.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      Swal.fire({
        title: 'Google Sign In Failed!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <Lottie animationData={SigninLottie} loop={true} style={{width: "350px", height: "350px"}} />
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <h1 className="text-5xl text-color-primary font-bold">Sign In Now!!</h1>
            <form onSubmit={handleSignIn} className="fieldset">
              <label className="label">Email</label>
              <input name="email" type="email" className="input" placeholder="Email" required />
              
              <label className="label">Password</label>
              <input name="password" type="password" className="input" placeholder="Password" required />
              
              <div><a className="link link-hover">Forgot password?</a></div>
              <div className="flex w-full flex-col">
                <button className="btn text-white bg-red-950 mt-4">Login</button>
              </div>
            </form>

            <div className="divider">OR</div>
            <button onClick={handleGoogleSignIn} className="btn bg-white text-black hover:bg-gray-300 border-[#e5e5e5]">
              <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <g>
                  <path d="m0 0H512V512H0" fill="#fff"></path>
                  <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
                  <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                  <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                  <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
                </g>
              </svg>
              Login with Google
            </button>

            <p className="pt-3 text-center">Don't have an account? <Link className="text-green-800" to={"/register"}>Register now...</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;