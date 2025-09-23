
'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import KeychainHero from './KeychainHero';
import KeychainConfigurator from './KeychainConfigurator';

export default function KeychainsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <KeychainHero />
      <KeychainConfigurator />
      <Footer />
    </div>
  );
}
