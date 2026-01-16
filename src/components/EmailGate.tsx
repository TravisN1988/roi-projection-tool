import { useEffect, useState, useCallback } from 'react';

interface EmailGateProps {
  onAccessGranted: () => void;
}

export function EmailGate({ onAccessGranted }: EmailGateProps) {
  const [isLoading, setIsLoading] = useState(true);

  const grantAccess = useCallback(() => {
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
      // Log all messages for debugging (can remove later)
      if (event.data && typeof event.data === 'object') {
        console.log('HubSpot message:', event.data);
      }

      // Check various HubSpot event formats
      const data = event.data;
      if (data) {
        // Format 1: hsFormCallback with onFormSubmitted
        if (data.type === 'hsFormCallback' && data.eventName === 'onFormSubmitted') {
          grantAccess();
          return;
        }
        // Format 2: Direct event name check
        if (data.eventName === 'onFormSubmitted' || data.eventName === 'onFormSubmit') {
          grantAccess();
          return;
        }
        // Format 3: Meeting/form submitted event
        if (data.meetingBookSucceeded || data.formSubmitted) {
          grantAccess();
          return;
        }
        // Format 4: Check for submission in nested data
        if (data.data?.eventName === 'onFormSubmitted') {
          grantAccess();
          return;
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Also watch for DOM changes - HubSpot often shows a thank you message after submission
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          // Look for thank you message or submitted state
          const container = document.querySelector('.hs-form-frame');
          if (container) {
            const thankYou = container.querySelector('.submitted-message, .hs-form-submitted, [data-form-submitted="true"]');
            const iframe = container.querySelector('iframe');

            // Check if iframe content indicates submission
            if (iframe) {
              try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (iframeDoc) {
                  const submittedEl = iframeDoc.querySelector('.submitted-message, .hs-form-submitted');
                  if (submittedEl) {
                    grantAccess();
                    return;
                  }
                }
              } catch {
                // Cross-origin iframe, can't access - this is expected
              }
            }

            if (thankYou) {
              grantAccess();
              return;
            }
          }
        }
      }
    });

    // Start observing after a delay to let form load
    const observerTimer = setTimeout(() => {
      const formContainer = document.querySelector('.hs-form-frame');
      if (formContainer) {
        observer.observe(formContainer, { childList: true, subtree: true });
      }
    }, 2000);

    // Hide loading spinner after a short delay to allow form to render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      window.removeEventListener('message', handleMessage);
      observer.disconnect();
      clearTimeout(timer);
      clearTimeout(observerTimer);
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
        </div>
      </div>
    </div>
  );
}
