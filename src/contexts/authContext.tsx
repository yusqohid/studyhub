"use client";

import { 
  onAuthStateChanged, 
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "@/firebase/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  sendVerificationEmail: async () => {},
  error: null,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsub();
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      setError(getErrorMessage((error as { code: string }).code));
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName });
      }
      
      // Send email verification
      if (result.user) {
        await sendEmailVerification(result.user);
      }
    } catch (error: unknown) {
      setError(getErrorMessage((error as { code: string }).code));
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (error: unknown) {
      setError(getErrorMessage((error as { code: string }).code));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error: unknown) {
      setError(getErrorMessage((error as { code: string }).code));
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error: unknown) {
      setError(getErrorMessage((error as { code: string }).code));
      throw error;
    }
  };

  const sendVerificationEmail = async () => {
    try {
      setError(null);
      if (user) {
        await sendEmailVerification(user);
      }
    } catch (error: unknown) {
      setError(getErrorMessage((error as { code: string }).code));
      throw error;
    }
  };

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Email tidak ditemukan';
      case 'auth/wrong-password':
        return 'Password salah';
      case 'auth/email-already-in-use':
        return 'Email sudah digunakan';
      case 'auth/weak-password':
        return 'Password terlalu lemah';
      case 'auth/invalid-email':
        return 'Email tidak valid';
      case 'auth/user-disabled':
        return 'Akun dinonaktifkan';
      case 'auth/too-many-requests':
        return 'Terlalu banyak percobaan, coba lagi nanti';
      case 'auth/network-request-failed':
        return 'Koneksi internet bermasalah';
      case 'auth/popup-closed-by-user':
        return 'Login dibatalkan';
      default:
        return 'Terjadi kesalahan, coba lagi';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signInWithGoogle, 
      logout, 
      resetPassword, 
      sendVerificationEmail,
      error 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

