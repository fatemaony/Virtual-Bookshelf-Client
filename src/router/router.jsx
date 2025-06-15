import {
  createBrowserRouter,
} from "react-router";
import LayOut from "../layouts/LayOut";
import Home from "../pages/Home";
import Register from "../pages/Register";
import SignIn from "../pages/SignIn";
import AddBooks from "../pages/AddBooks";
import PrivateRouter from "../components/PrivateRouter";
import Bookshelf from "../pages/BookShelf";
import BookDetails from "../pages/BooksDetails";
import MyBooks from "../pages/MyBooks";
import ErrorPage from "../components/ErrorPage";
import Profile from "../pages/Profile";
import UpdateBookForm from "../pages/UpdateBook";
import EditProfile from "../pages/EditProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component:LayOut,
    children:[
      {
        index:true,
        Component:Home,
        loader:()=>fetch("https://virtual-bookshelf-server-chi.vercel.app/books")
      },
      {
        path:"/bookshelf",
        Component:Bookshelf,
        loader:()=>fetch('https://virtual-bookshelf-server-chi.vercel.app/books')
      },
      {
       path:"/bookshelf/:id",
       Component:BookDetails,
       loader:({params})=>fetch(`https://virtual-bookshelf-server-chi.vercel.app/books/${params.id}`)
      },
      {
        path:"/updatebook/:id",
        Component:UpdateBookForm,
        loader:({params})=>fetch(`https://virtual-bookshelf-server-chi.vercel.app/books/${params.id}`)
      },
      {
        path:"editprofile",
        Component:EditProfile
      },
      {
        path:"myBooks",
        element: 
        <PrivateRouter>
         <MyBooks/>
        </PrivateRouter>,
        loader:()=>fetch("https://virtual-bookshelf-server-chi.vercel.app/books")
      },
      {
        path:"addbooks",
        element:
        <PrivateRouter>
         <AddBooks/>
        </PrivateRouter>
      },
      {
        path:'register',
        Component:Register
      },
      {
        path:'signin',
        Component:SignIn
      },
      {
        path:"profile",
        element:
        <PrivateRouter>
         <Profile/>
        </PrivateRouter>,
        loader:()=>fetch("https://virtual-bookshelf-server-chi.vercel.app/books")
      }
    ]
  },
  {
    path:"/*",
    Component:ErrorPage
  }
]);