"use client";
import Image from "next/image";
import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import WhyFind from "./_components/WhyFind";
import RealEstateRewired from "./_components/RealEstateRewired";
import ForAgents from "./_components/ForAgents";
import Carousel from "./_components/Carousel";
import Services from "./_components/Services";
import BlogsAndResources from "./_components/BlogsAndResources";
import CTA from "./_components/CTA";
import Footer from "./_components/Footer";

export default function Home() {
  return (
   <div className="grid">
    <Hero/>
    <WhyFind/>
    <RealEstateRewired/>
    <ForAgents/>
    <Carousel/>
    <Services/>
    <BlogsAndResources/>
    <CTA/>
   </div>
  );
}
