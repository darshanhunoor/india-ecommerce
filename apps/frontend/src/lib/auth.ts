import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from './firebase';

let confirmationResult: ConfirmationResult | null = null;

export const setupRecaptcha = (buttonId: string) => {
  if ((window as any).recaptchaVerifier) {
    try {
      (window as any).recaptchaVerifier.clear();
    } catch (e) {}
    (window as any).recaptchaVerifier = null;
  }

  // Suppress Firebase's benign Enterprise fallback warning for the MVP
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('Failed to initialize reCAPTCHA Enterprise config')) {
        return;
      }
      originalWarn.apply(console, args);
    };

    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
    });
};

export const sendOTP = async (phoneNumber: string, buttonId: string) => {
  try {
    setupRecaptcha(buttonId);
    const appVerifier = (window as any).recaptchaVerifier;
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    if ((window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier.clear();
      (window as any).recaptchaVerifier = null;
    }
    throw error;
  }
};

export const verifyOTP = async (otpCode: string) => {
  if (!confirmationResult) {
    throw new Error('Please request OTP first');
  }
  try {
    const result = await confirmationResult.confirm(otpCode);
    const idToken = await result.user.getIdToken(true);
    return idToken;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};
