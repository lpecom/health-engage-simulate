
/**
 * Microsoft Clarity analytics integration
 */

const CLARITY_ID = "qxxut4g92w";

/**
 * Initialize Microsoft Clarity analytics
 */
export const initClarity = () => {
  if (typeof window !== 'undefined') {
    // Don't initialize more than once
    if (document.getElementById('ms-clarity')) return;
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
    script.id = 'ms-clarity';
    
    // Add to head
    document.head.appendChild(script);
    
    console.log('Microsoft Clarity initialized');
  }
};
