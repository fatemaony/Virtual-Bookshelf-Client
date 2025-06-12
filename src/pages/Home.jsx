import React from "react";
import Banner from "./Banner";
import FAQ from "../components/FQA";
import PopularBooks from "../components/PopularBooks";
import BooksCategory from "../components/BooksCategory";
import About from "../components/About";

const Home=()=>{

  return(
    <div>
    <Banner/>
    <PopularBooks/>
    <BooksCategory/>
    <About/>
    <FAQ/>
    </div>
  )
};
export default Home;