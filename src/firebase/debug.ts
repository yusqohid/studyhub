import { auth, db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    console.log('🧪 Testing Firebase connection...');
    
    // Test 1: Check if Firebase is initialized
    if (!auth || !db) {
      console.error('❌ Firebase not initialized');
      return false;
    }
    console.log('✅ Firebase initialized');
    
    // Test 2: Check auth state
    const user = auth.currentUser;
    console.log('👤 Current user:', {
      uid: user?.uid,
      email: user?.email,
      emailVerified: user?.emailVerified
    });
    
    if (!user) {
      console.log('⚠️ No authenticated user - this might cause permission issues');
      return false;
    }
    
    // Test 3: Try to read from Firestore (this will test rules)
    try {
      console.log('🔍 Testing Firestore read access...');
      const testQuery = query(
        collection(db, 'notes'),
        where('authorId', '==', user?.uid || 'test')
      );
      const snapshot = await getDocs(testQuery);
      console.log('✅ Firestore read successful, found', snapshot.docs.length, 'documents');
    } catch (firestoreError: any) {
      console.error('❌ Firestore read error:', {
        code: firestoreError.code,
        message: firestoreError.message
      });
      
      if (firestoreError.code === 'permission-denied') {
        console.log('🔐 Permission denied - Firestore rules might not be deployed or incorrect');
        return false;
      }
    }
    
    // Test environment variables
    console.log('🔧 Environment variables:');
    console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set ✅' : 'Not set ❌');
    console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set ✅' : 'Not set ❌');
    console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Set ✅' : 'Not set ❌');
    
    console.log('🎉 Firebase connection test completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return false;
  }
};

export const debugFirebaseError = (error: any) => {
  console.error('Firebase Error Details:');
  console.error('Code:', error.code);
  console.error('Message:', error.message);
  console.error('Full error:', error);
  
  // Common Firebase errors and solutions
  const errorSolutions: Record<string, string> = {
    'permission-denied': 'Check Firestore security rules and user authentication',
    'not-found': 'Check if the collection/document exists',
    'unauthenticated': 'User needs to be logged in',
    'unavailable': 'Firebase service is temporarily unavailable',
    'failed-precondition': 'Check Firestore rules and data validation',
    'invalid-argument': 'Check data types and required fields'
  };
  
  if (error.code && errorSolutions[error.code]) {
    console.error('Suggested solution:', errorSolutions[error.code]);
  }
};
