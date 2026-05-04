import { supabase } from './supabase';

export const sendOTP = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) throw error;
  return true;
};

export const verifyOTP = async (email: string, otpCode: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otpCode,
    type: 'email',
  });
  if (error) throw error;
  
  if (!data.session?.access_token) {
    throw new Error('Verification failed. No access token returned.');
  }
  
  return data.session.access_token;
};
