import type { User as SupabaseUser, Session as SupabaseSession, AuthError as SupabaseAuthError } from '@supabase/supabase-js';

export type User = SupabaseUser;
export type Session = SupabaseSession;
export type AuthError = SupabaseAuthError;

export interface AuthFormData {
  email: string;
  password: string;
}

export type LoginFormData = AuthFormData;

export interface RegisterFormData extends AuthFormData {
  firstName: string;
  lastName: string;
  userType: 'customer' | 'photographer';
}

export interface CustomAuthError {
  message: string;
  code?: string;
}