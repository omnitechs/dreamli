
// 'use client';

import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from "./components/Hero";
import AI from "./components/AI";
import {CustomizedGifts} from "@/app/components/CustomizedGifts";
import {WhySection} from "@/app/components/WhySection";
import KeychainOpenSCADPlain from "@/components/KeychainOpenSCADPlain.client";
import KeychainBuilder from "@/components/KeychainMaker";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
        <Hero/>
        <AI/>
        <CustomizedGifts/>
        <WhySection/>
        {/*<KeychainOpenSCADPlain />*/}
        <KeychainBuilder/>
      <Footer />
    </div>
  );
}
