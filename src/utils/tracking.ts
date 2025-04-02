
/**
 * Tracking utility functions for analytics pixels
 */

/**
 * Initialize Taboola Pixel
 */
export const initTaboolaPixel = () => {
  if (typeof window !== 'undefined') {
    // Don't initialize more than once
    if (document.getElementById('tb_tfa_script')) return;

    window._tfa = window._tfa || [];
    window._tfa.push({notify: 'event', name: 'page_view', id: 1380038});

    const script = document.createElement('script');
    script.async = true;
    script.src = '//cdn.taboola.com/libtrc/unip/1380038/tfa.js';
    script.id = 'tb_tfa_script';
    
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }
  }
};

/**
 * Track Taboola page view event
 * This should be called on route changes
 */
export const trackTaboolaPageView = () => {
  if (typeof window !== 'undefined' && window._tfa) {
    window._tfa.push({notify: 'event', name: 'page_view', id: 1380038});
    console.log('Taboola page_view event fired');
  }
};

/**
 * Track Taboola start checkout event
 */
export const trackTaboolaStartCheckout = () => {
  if (typeof window !== 'undefined' && window._tfa) {
    window._tfa.push({notify: 'event', name: 'start_checkout', id: 1380038});
    console.log('Taboola start_checkout event fired');
  }
};

/**
 * Track Taboola purchase event
 */
export const trackTaboolaPurchase = () => {
  if (typeof window !== 'undefined' && window._tfa) {
    window._tfa.push({notify: 'event', name: 'purchase', id: 1380038});
    console.log('Taboola purchase event fired');
  }
};
