import react, { use } from 'react';
import { GiBurningBook } from "react-icons/gi";
import { Link } from 'react-router';
import { AuthContext } from '../contexts/Context';

const Navbar=()=>{
  const {user, signOutUser}=use(AuthContext)

  const links = 
  <>
        <Link to={"/"}>
        <li className='text-red-950 font-semibold px-5'>Home</li>
        </Link>
        <Link to={"/bookshelf"}>
        <li className='text-red-950 font-semibold px-5'>Bookshelf</li>
        </Link>
        <Link to={"/addbooks"}>
        <li className='text-red-950 font-semibold px-5'>Add Book</li>
        </Link>
        <Link to={"/myBooks"}>
        <li className='text-red-950 font-semibold px-5'>My Books</li>
        </Link>
        
  </>
return(
  <div className="navbar bg-base-100 shadow-lg lg:px-10">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost text-red-950 lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        {links}
      </ul>
    </div>
    <div className="text-xl flex items-center gap-1 text-red-950">
 <GiBurningBook />
  <p>
    Read<span className="text-red-800 font-bold">Ripple</span>
  </p>
</div>

  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
      {links}
    </ul>
  </div>

  <div>
    <label className="toggle text-red-950">
  <input type="checkbox" value="synthwave" className="theme-controller" />

  <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></g></svg>

  <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></g></svg>

  </label>
  </div>
  <div className="navbar-end">
   {
    user? <div className="avatar">
  <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring-2 ring-offset-2">
    <Link to={"/profile"}><img src={user.photoURL} /></Link>
  </div>
</div> 
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