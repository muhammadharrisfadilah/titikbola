// ========================================
// MONETAG AD SCRIPT
// Monetag ad integration
// ========================================

'use client';

import { useEffect } from 'react';
import { ADS_CONFIG } from '@/lib/utils/constants';

export default function MonatagScript() {
  useEffect(() => {
    if (!ADS_CONFIG.MONETAG.ENABLED) {
      console.log('[ADS] Monetag disabled');
      return;
    }
    
    // SmartLink (Pop-under)
    if (ADS_CONFIG.MONETAG.SMARTLINK_ID) {
      const smartlinkScript = document.createElement('script');
      smartlinkScript.async = true;
      smartlinkScript.src = `//thubanoa.com/1?z=${ADS_CONFIG.MONETAG.SMARTLINK_ID}`;
      smartlinkScript.setAttribute('data-cfasync', 'false');
      document.body.appendChild(smartlinkScript);
      
      console.log('[ADS] Monetag SmartLink loaded');
    }
    
    // In-Page Push
    if (ADS_CONFIG.MONETAG.INPAGE_ID) {
      setTimeout(() => {
        const inpageScript = document.createElement('script');
        inpageScript.async = true;
        inpageScript.src = `//thubanoa.com/400/${ADS_CONFIG.MONETAG.INPAGE_ID}`;
        inpageScript.setAttribute('data-cfasync', 'false');
        document.body.appendChild(inpageScript);
        
        console.log('[ADS] Monetag In-Page Push loaded');
      }, ADS_CONFIG.TIMING.INPAGE_PUSH_DELAY);
    }
    
    // Cleanup
    return () => {
      // Remove scripts on unmount
      const scripts = document.querySelectorAll('script[src*="thubanoa.com"]');
      scripts.forEach(script => script.remove());
    };
  }, []);
  
  return (
    <>
      {/* Vignette Banner */}
      {ADS_CONFIG.MONETAG.ENABLED && ADS_CONFIG.MONETAG.VIGNETTE_ID && (
        <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
          <ins 
            className="monetag pointer-events-auto" 
            data-zone={ADS_CONFIG.MONETAG.VIGNETTE_ID}
          />
        </div>
      )}
    </>
  );
}