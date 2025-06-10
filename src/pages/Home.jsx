import React from "react";
import Banner from "./Banner";
import FAQ from "../components/FQA";
import PopularBooks from "../components/PopularBooks";

const Home=()=>{

  return(
    <div>
    <Banner/>
    <PopularBooks/>
    <FAQ/>
    </div>
  )
};
export default Home;