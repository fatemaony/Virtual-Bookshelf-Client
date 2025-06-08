import react, { use } from 'react';
import { TbHomeInfinity } from "react-icons/tb";
import { Link } from 'react-router';
import { AuthContext } from '../contexts/Context';

const Navbar=()=>{
  const {user, signOutUser}=use(AuthContext)

  const handleSignOut=()=>{
    signOutUser()
    .then(result=>{
      console.log("sign out successfully")
    })
    .catch(error=>{
      console.log(error)
    })
  }

  const links = 
  <>
        <Link to={"/"}>
        <li className='text-red-950 font-semibold px-5'>Home</li>
        </Link>
        <Link to={"/bookshelf"}>
        <li className='text-red-950 font-semibold px-5'>Bookshelf</li>
        </Link>
        <Link to={"/addBook"}>
        <li className='text-red-950 font-semibold px-5'>Add Book</li>
        </Link>
        <Link to={"/myBooks"}>
        <li className='text-red-950 font-semibold px-5'>My Books</li>
        </Link>
        
  </>
return(
  <div className="navbar bg-base-100 shadow-lg">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="lg:hidden w-[30px] font-extrabold  text-red-950">
        <TbHomeInfinity />
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        {links}
      </ul>
    </div>
    <a className="text-xl font-bold text-red-950">ReadRipple</a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
      {links}
    </ul>
  </div>
  <div className="navbar-end">
   {
    user? <button className="btn btn-outline text-red-950 hover:bg-red-950 hover:text-white" onClick={handleSignOut}>Sign Out</button> 
    :<Link to={"/signin"}>
    <button className="btn btn-outline text-red-950 hover:bg-red-950 hover:text-white">
      Sign In
      </button>
   </Link>
   }
  </div>
</div>
  )
};
export default Navbar;