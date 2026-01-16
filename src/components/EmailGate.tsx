import { useEffect, useState } from 'react';

interface EmailGateProps {
  onAccessGranted: () => void;
}

export function EmailGate({ onAccessGranted }: EmailGateProps) {
  const [isLoading, setIsLoading] = useState(true);

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
      // HubSpot sends messages when form is submitted
      if (event.data?.type === 'hsFormCallback' && event.data?.eventName === 'onFormSubmitted') {
        localStorage.setItem('roi-email-submitted', 'true');
        onAccessGranted();
      }
    };

    window.addEventListener('message', handleMessage);

    // Hide loading spinner after a short delay to allow form to render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timer);
    };
  }, [onAccessGranted]);

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
