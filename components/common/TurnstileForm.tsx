'use client';

import { Turnstile } from '@marsidev/react-turnstile';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyTurnstileToken } from '@/app/turnstile/actions';

interface TurnstileFormProps {
  siteKey: string;
}

export default function TurnstileForm({ siteKey }: TurnstileFormProps) {
  const [status, setStatus] = useState<string>('Pending');
  const router = useRouter();

  const handleVerify = async (token: string) => {
    setStatus('Verifying...');
    try {
      // Call the server action to verify the token securely on the backend
      const res = await verifyTurnstileToken(token);
      
      if (res.success) {
        setStatus('Success! Redirecting...');
        
        // Find if there's a specific page to redirect to, otherwise go to home page
        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get('redirect') || '/';
        
        router.push(redirectUrl);
      } else {
        setStatus('Verification failed');
      }
    } catch (e) {
      setStatus('Error verifying token');
    }
  };

  return (
    <div style={{ margin: '1em 0' }}>
      <Turnstile 
        siteKey={siteKey}
        onSuccess={(token) => handleVerify(token)}
        onError={() => setStatus('Error')}
        onExpire={() => setStatus('Expired')}
      />

      <div style={{ marginTop: '1em' }}>
        <p>
          <b>Status:</b> {status}
        </p>
      </div>
    </div>
  );
}
