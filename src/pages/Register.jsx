import React, { use } from "react";
import Registerlottie from '../assets/lottie/Register.json'
import Lottie from "lottie-react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../contexts/Context";
import { updateProfile } from "firebase/auth";
import Swal from "sweetalert2";

const Register = () => {
  
  const { signInWithGoogle, createUser,  getFirebaseToken,} = use(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state || "/"

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const displayName = form.displayName.value;
    const email = form.email.value;
    const photo = form.photo.value;
    const password = form.password.value;

    if (!displayName || !email || !password) {
      Swal.fire({
        title: 'Missing Information!',
        text: 'Please fill in all required fields.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626'
      });
      return;
    }

    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      Swal.fire({
        title: 'Invalid Password!',
        text: 'Password must be at least 6 characters long and include both uppercase and lowercase letters.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626'
      });
      return;
    }

    try {
      
      const result = await createUser(email, password);
      console.log("Created an account", result.user);
       const token = await result.user.getIdToken();
      
      await updateProfile(result.user, {
        displayName: displayName,
        photoURL: photo 
      });

      const userProfile = {
        email: result.user.email,
        Name: displayName, 
        photo: photo, 
        uid: result.user.uid,
        creationTime: result.user?.metadata?.creationTime,
        lastSignInTime: result.user?.metadata?.lastSignInTime,
        registeredAt: new Date().toISOString(),
        isActive: true
      };

      console.log("User profile to save:", userProfile);
     

      const response = await fetch('https://virtual-bookshelf-server-chi.vercel.app/users', {
        method: "POST",
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userProfile)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save user data');
      }

      const saveResult = await response.json();
      console.log("User saved to database:", saveResult);

      Swal.fire({
        title: 'Registration Successful! 🎉',
        text: `Welcome to ReadRipple, ${displayName}! Your account has been created successfully.`,
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
      console.error("Registration error:", error);
      
      Swal.fire({
        title: 'Registration Failed!',
        text: error.message || 'Something went wrong during registration. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
     
      const result = await signInWithGoogle();
      console.log("Sign in with Google", result.user);
       const token = await result.user.getIdToken();

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
        await fetch('https://virtual-bookshelf-server-chi.vercel.app/users', {
          method: "POST",
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(userProfile)
        });
      } catch (dbError) {
        console.log("User might already exist in database");
      }

      await fetch(`https://virtual-bookshelf-server-chi.vercel.app/users/${result.user.email}/login`, {
        method: "PATCH",
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      Swal.fire({
        title: 'Successfully Signed In! 🎉',
        text: `Welcome back, ${result.user.displayName}!`,
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
      
      Swal.fire({
        title: 'Sign In Failed!',
        text: 'Something went wrong during Google sign in. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  return (
    <div className="hero bg-base-200 py-22 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <Lottie animationData={Registerlottie} loop={true} style={{width: "400px", height: "400px"}} />
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <h1 className="text-5xl text-color-primary font-bold">Register Now!!</h1>
            <form onSubmit={handleRegister} className="fieldset">
              <label className="label">Name</label>
              <input name="displayName" type="text" className="input" placeholder="Your Name" required />
              
              <label className="label">Photo URL</label>
              <input name="photo" type="url" className="input" placeholder="Your Photo URL" />
              
              <label className="label">Email</label>
              <input name="email" type="email" className="input" placeholder="Email" required />
              
              <label className="label">Password</label>
              <input name="password" type="password" className="input" placeholder="Password" required />
              
              <div><a className="link link-hover">Forgot password?</a></div>
              <div className="flex w-full flex-col">
                <button className="btn text-white bg-red-950 mt-4">Create Account</button>
                <p className="pt-3">Already have an account? <Link className="text-green-800" to={"/signin"}>Sign In</Link></p>
              </div>
            </form>

            <div className="divider">OR</div>
            <button onClick={handleSignInWithGoogle} className="btn bg-white text-black hover:bg-gray-300 border-[#e5e5e5]">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
