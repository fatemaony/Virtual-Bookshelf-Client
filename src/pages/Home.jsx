import React from "react";
import Banner from "./Banner";
import FAQ from "../components/FQA";
import PopularBooks from "../components/PopularBooks";
import BooksCategory from "../components/BooksCategory";

const Home=()=>{

  return(
    <div>
    <Banner/>
    <PopularBooks/>
    <BooksCategory/>
    <FAQ/>
    </div>
  )
};
export default Home;