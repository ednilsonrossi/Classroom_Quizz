import React from 'react';
import HeroSection from './HeroSection';
import Highlights from './HighlightSection';
import About from './AboutSection';
import Contact from './ContactSection';

export default function LandingPage() {
  return (
    <>
      <HeroSection/>
      <Highlights/>
      <About/>
      <Contact/>
    </>
  );
}