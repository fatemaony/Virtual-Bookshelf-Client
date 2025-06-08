import {
  createBrowserRouter,
} from "react-router";
import LayOut from "../layouts/LayOut";
import Home from "../pages/Home";
import Register from "../pages/Register";
import SignIn from "../pages/SignIn";

export const router = createBrowserRouter([
  {
    path: "/",
    Component:LayOut,
    children:[
      {
        index:true,
        Component:Home
      },
      {
        path:'register',
        Component:Register
      },
      {
        path:'signin',
        Component:SignIn
      }
    ]
  },
]);