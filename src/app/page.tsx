"use client";

import Footer from "@/components/footer"
import HeroSection from "@/components/hero-section"
import Navbar from "@/components/navbar"
import Plan from "@/components/plan"
import { Testimonials } from "@/components/testimonials"
import { HorizontalCardHover } from "@/components/horizontal-cards"
import { VerticalCardHover } from "@/components/vertical-cards"
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

const Home = () => {

  const{getToken}=useAuth();

  useEffect(()=>{
    getToken().then((token)=>console.log(token))
  },[])

  return (
    <>
      <Navbar/>
      <HeroSection/>
      <HorizontalCardHover className="hidden md:flex"/>
      <VerticalCardHover className="flex md:hidden"/>
      <Testimonials/>
      <Plan/>
      <Footer/>
    </>
  )
}

export default Home