import { useEffect, useRef, useState } from 'react';

interface EmailGateProps {
  onAccessGranted: () => void;
}

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (config: {
          region: string;
          portalId: string;
          formId: string;
          target: string;
          onFormSubmitted?: () => void;
        }) => void;
      };
    };
  }
}

export function EmailGate({ onAccessGranted }: EmailGateProps) {
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load HubSpot script
  useEffect(() => {
    const existingScript = document.querySelector('script[src*="hsforms"]');
    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.hsforms.net/forms/embed/23263384.js';
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Don't remove script on cleanup - HubSpot needs it
    };
  }, []);

  // Create form once script is loaded
  useEffect(() => {
    if (!scriptLoaded || !formContainerRef.current) return;

    // Small delay to ensure HubSpot is fully initialized
    const timer = setTimeout(() => {
      if (window.hbspt?.forms) {
        window.hbspt.forms.create({
          region: 'na1',
          portalId: '23263384',
          formId: 'c9d70c3d-fbd8-4fc2-af23-4ada6c298020',
          target: '#hubspot-form-container',
          onFormSubmitted: () => {
            localStorage.setItem('roi-email-submitted', 'true');
            onAccessGranted();
          },
        });
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [scriptLoaded, onAccessGranted]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg-primary)]">
      <div className="w-full max-w-md mx-4">
        <div className="card p-6 space-y-4">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
              ROI Projection Tool
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Enter your email to access the calculator
            </p>
          </div>

          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <div
            id="hubspot-form-container"
            ref={formContainerRef}
            className={isLoading ? 'hidden' : ''}
          />

          <p className="text-xs text-[var(--color-text-muted)] text-center">
            We respect your privacy. Your information will not be shared.
          </p>
        </div>
      </div>
    </div>
  );
}
