
'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import KeychainHero from './KeychainHero';
import KeychainConfigurator from './KeychainConfigurator';
import KeychainBuilder from "@/components/KeychainMaker";

export default function KeychainsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <KeychainHero />
        <KeychainBuilder woocommerceConfig={{
            productId: 50361, // Your WooCommerce product ID
            apiUrl: 'https://shop.dreamli.nl/wp-json/custom/v1/add-to-cart'
        }}/>
      {/*<KeychainConfigurator />*/}
      <Footer />
        <div>hi</div>
    </div>
  );
}
