'use server';

import { cookies } from 'next/headers';

export async function verifyTurnstileToken(token: string) {
  const secretKey = process.env.CLOUDFLARE_SECRET_KEY || '1x0000000000000000000000000000000AA'; // dummy secret for testing if env is missing

  try {
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    
    if (data.success) {
      // Set a cookie so the server knows the user has passed the captcha
      cookies().set('turnstile_passed', 'true', { 
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });
      return { success: true };
    } else {
      return { success: false, error: data['error-codes'] };
    }
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
