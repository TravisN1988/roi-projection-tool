import { useEffect, useState, useCallback, useRef } from 'react';

interface EmailGateProps {
  onAccessGranted: () => void;
}

export function EmailGate({ onAccessGranted }: EmailGateProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const hasGrantedAccess = useRef(false);
  const formSubmitted = useRef(false);

  const grantAccess = useCallback(() => {
    if (hasGrantedAccess.current) return;
    hasGrantedAccess.current = true;
    console.log('Granting access to ROI tool');
    localStorage.setItem('roi-email-submitted', 'true');
    onAccessGranted();
  }, [onAccessGranted]);

  const showButton = useCallback(() => {
    if (formSubmitted.current) return;
    formSubmitted.current = true;
    console.log('Form submission detected - showing continue button');
    setShowContinueButton(true);
  }, []);

  useEffect(() => {
    // Load HubSpot script
    const existingScript = document.querySelector('script[src*="hsforms"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://js.hsforms.net/forms/embed/23263384.js';
      script.defer = true;
      document.head.appendChild(script);
    }

    // Listen for HubSpot form submission via postMessage (primary method)
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      // Log all HubSpot-related messages for debugging
      if (data.type === 'hsFormCallback' || data.eventName || data.meetingBookSucceeded !== undefined) {
        console.log('HubSpot message received:', JSON.stringify(data, null, 2));
      }

      // Check for hsFormCallback with onFormSubmitted (standard HubSpot event)
      if (data.type === 'hsFormCallback') {
        if (data.eventName === 'onFormSubmitted' || data.eventName === 'onFormSubmit') {
          console.log('Detected via hsFormCallback:', data.eventName);
          showButton();
          return;
        }
      }

      // Check for direct eventName (alternate format)
      if (data.eventName === 'onFormSubmitted' || data.eventName === 'onFormSubmit') {
        console.log('Detected via direct eventName');
        showButton();
        return;
      }

      // Check for nested data structure
      if (data.data?.eventName === 'onFormSubmitted') {
        console.log('Detected via nested data.eventName');
        showButton();
        return;
      }

      // Check for meeting/form success flags
      if (data.meetingBookSucceeded || data.formSubmitted) {
        console.log('Detected via success flags');
        showButton();
        return;
      }
    };

    window.addEventListener('message', handleMessage);

    // Track form state for size-change detection
    let formLoaded = false;
    let initialIframeHeight = 0;
    let stableHeightCount = 0;

    const checkForSubmission = (): boolean => {
      const container = document.querySelector('.hs-form-frame');
      if (!container) return false;

      const iframes = container.querySelectorAll('iframe');
      if (iframes.length === 0) return false;

      const iframe = iframes[0] as HTMLIFrameElement;
      const currentHeight = iframe.offsetHeight || iframe.clientHeight;

      // Wait for form to fully load (height stabilizes)
      if (!formLoaded) {
        if (currentHeight > 100) {
          stableHeightCount++;
          if (stableHeightCount >= 3) {
            formLoaded = true;
            initialIframeHeight = currentHeight;
            console.log('HubSpot form loaded, initial height:', initialIframeHeight);
          }
        }
        return false;
      }

      // After form is loaded, detect significant height change (submission shows thank you)
      // Thank you message is typically much shorter than the form
      const heightDifference = initialIframeHeight - currentHeight;
      const heightRatio = currentHeight / initialIframeHeight;

      // Form submitted if height decreased significantly (thank you message is smaller)
      // OR if height changed by more than 30%
      if (heightDifference > 100 || heightRatio < 0.7 || heightRatio > 1.5) {
        console.log('Detected submission via height change:', {
          initial: initialIframeHeight,
          current: currentHeight,
          ratio: heightRatio.toFixed(2)
        });
        return true;
      }

      return false;
    };

    // Poll for submission detection via size change
    const pollInterval = setInterval(() => {
      if (checkForSubmission()) {
        showButton();
        clearInterval(pollInterval);
      }
    }, 500);

    // Hide loading spinner after form loads
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(pollInterval);
      clearTimeout(timer);
    };
  }, [grantAccess, showButton]);

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
