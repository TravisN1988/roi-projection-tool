import { useEffect, useState, useCallback, useRef } from 'react';

interface EmailGateProps {
  onAccessGranted: () => void;
}

export function EmailGate({ onAccessGranted }: EmailGateProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const hasGrantedAccess = useRef(false);

  const grantAccess = useCallback(() => {
    if (hasGrantedAccess.current) return; // Prevent multiple calls
    hasGrantedAccess.current = true;
    console.log('Granting access to ROI tool');
    localStorage.setItem('roi-email-submitted', 'true');
    onAccessGranted();
  }, [onAccessGranted]);

  useEffect(() => {
    // Load HubSpot script
    const existingScript = document.querySelector('script[src*="hsforms"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://js.hsforms.net/forms/embed/23263384.js';
      script.defer = true;
      document.head.appendChild(script);
    }

    // Listen for HubSpot form submission via postMessage
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data) return;

      // Log for debugging
      if (typeof data === 'object') {
        console.log('postMessage received:', data);
      }

      // Check various HubSpot event formats
      if (data.type === 'hsFormCallback' && data.eventName === 'onFormSubmitted') {
        grantAccess();
        return;
      }
      if (data.eventName === 'onFormSubmitted' || data.eventName === 'onFormSubmit') {
        grantAccess();
        return;
      }
      if (data.meetingBookSucceeded || data.formSubmitted) {
        grantAccess();
        return;
      }
      if (data.data?.eventName === 'onFormSubmitted') {
        grantAccess();
        return;
      }
    };

    window.addEventListener('message', handleMessage);

    // Poll for submission text - HubSpot form is in an iframe so MutationObserver may not catch it
    const checkForSubmission = () => {
      // Check the entire page for "Form submitted" text
      const pageText = document.body.innerText || '';
      console.log('Polling - page text sample:', pageText.substring(0, 200));

      if (
        pageText.includes('Form submitted') ||
        pageText.includes('Thank you, we\'ll be in touch') ||
        pageText.includes('Thank you,') ||
        pageText.includes('we\'ll be in touch')
      ) {
        console.log('Detected submission via page text!');
        grantAccess();
        return true;
      }

      // Check iframes for submission indicators
      const iframes = document.querySelectorAll('iframe');
      console.log('Found iframes:', iframes.length);
      for (const iframe of iframes) {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            const iframeText = iframeDoc.body?.innerText || '';
            console.log('Iframe text sample:', iframeText.substring(0, 100));
            if (
              iframeText.includes('Form submitted') ||
              iframeText.includes('Thank you')
            ) {
              console.log('Detected submission via iframe text!');
              grantAccess();
              return true;
            }
          }
        } catch (e) {
          console.log('Cross-origin iframe, cannot access');
        }
      }

      return false;
    };

    // Start polling after form has had time to load
    const pollInterval = setInterval(() => {
      if (checkForSubmission()) {
        clearInterval(pollInterval);
      }
    }, 500);

    // Show continue button as fallback after 5 seconds
    const continueButtonTimer = setTimeout(() => {
      setShowContinueButton(true);
    }, 5000);

    // Hide loading spinner after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(pollInterval);
      clearTimeout(timer);
      clearTimeout(continueButtonTimer);
    };
  }, [grantAccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-slate-800">
              ROI Projection Tool
            </h1>
            <p className="text-sm text-slate-600">
              Enter your email to access the calculator
            </p>
          </div>

          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* HubSpot form embed using their data-attribute format */}
          <div
            className={`hs-form-frame ${isLoading ? 'opacity-0 h-0' : 'opacity-100'}`}
            data-region="na1"
            data-form-id="c9d70c3d-fbd8-4fc2-af23-4ada6c298020"
            data-portal-id="23263384"
          />

          <p className="text-xs text-slate-400 text-center">
            We respect your privacy. Your information will not be shared.
          </p>

          {/* Fallback continue button that appears after form submission */}
          {showContinueButton && (
            <button
              onClick={grantAccess}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Continue to Calculator →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
