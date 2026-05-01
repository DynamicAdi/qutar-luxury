"use client";

import Hero from "@/components/client/home/Hero";
import WhyFind from "@/components/client/home/WhyFind";
import RealEstateRewired from "@/components/client/home/RealEstateRewired";
import ForAgents from "@/components/client/home/ForAgents";
import Carousel from "@/components/client/home/Carousel";
import Services from "@/components/client/home/Services";
import BlogsAndResourcesSection from "@/components/client/home/BlogsAndResources";
import CTA from "@/components/client/home/CTA";
import CTAToExplore from "@/components/CTAToExplore";

export default function Home() {
  return (
   <div className="grid">
    <Hero/>
    <CTAToExplore />
    <WhyFind/>
    <RealEstateRewired/>
    <ForAgents/>
    <Carousel/>
    <Services/>
    <BlogsAndResourcesSection/>
    <CTA />
   </div>
  );
}
