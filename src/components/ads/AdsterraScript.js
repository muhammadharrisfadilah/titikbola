// ========================================
// ADSTERRA AD SCRIPT
// AdSterra banner ad integration
// ========================================

'use client';

import { useEffect } from 'react';
import { ADS_CONFIG } from '@/lib/utils/constants';

export default function AdsterraScript() {
  useEffect(() => {
    if (!ADS_CONFIG.ADSTERRA.ENABLED) {
      console.log('[ADS] AdSterra disabled');
      return;
    }
    
    if (ADS_CONFIG.ADSTERRA.BANNER_ID) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pl${ADS_CONFIG.ADSTERRA.PUB_ID}.profitablegatecpm.com/${ADS_CONFIG.ADSTERRA.BANNER_ID}/invoke.js`;
      script.setAttribute('data-cfasync', 'false');
      document.body.appendChild(script);
      
      console.log('[ADS] AdSterra banner loaded');
    }
    
    return () => {
      const scripts = document.querySelectorAll('script[src*="profitablegatecpm.com"]');
      scripts.forEach(script => script.remove());
    };
  }, []);
  
  return null;
}

// Banner component for placement
export function AdsterraBanner({ className = '' }) {
  if (!ADS_CONFIG.ADSTERRA.ENABLED) {
    return null;
  }
  
  return (
    <div className={`adsterra-banner ${className}`}>
      <div id={`container-${ADS_CONFIG.ADSTERRA.BANNER_ID}`} />
    </div>
  );
}