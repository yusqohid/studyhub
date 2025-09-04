# StudyHub - Panduan Authentication Firebase

## Overview
StudyHub menggunakan Firebase Authentication untuk sistem login yang lengkap dan aman. Sistem ini mendukung:
- Login dengan Email/Password
- Registrasi dengan Email/Password
- Login dengan Google
- Reset Password
- Email Verification
- Protected Routes
- Guest Routes

## Setup Firebase

### 1. Buat Project Firebase
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik "Create a project"
3. Ikuti langkah-langkah setup project

### 2. Enable Authentication
1. Di Firebase Console, pilih project Anda
2. Klik "Authentication" di sidebar
3. Klik "Get started"
4. Pilih tab "Sign-in method"
5. Enable "Email/Password" dan "Google"

### 3. Setup Google Authentication
1. Di tab "Sign-in method", klik "Google"
2. Enable Google sign-in
3. Tambahkan project support email
4. Save

### 4. Dapatkan Konfigurasi
1. Klik ikon gear (Settings) > Project settings
2. Scroll ke bawah ke "Your apps"
3. Klik "Web app" icon
4. Register app dengan nama "StudyHub"
5. Copy konfigurasi Firebase

### 5. Setup Environment Variables
Buat file `.env.local` di root project dengan konfigurasi:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_MEASUREMENT_ID=your_measurement_id
```

## Struktur Authentication

### AuthContext (`src/contexts/authContext.tsx`)
- Mengelola state authentication global
- Menyediakan method untuk login, signup, logout, dll
- Error handling dengan pesan dalam bahasa Indonesia
- Auto redirect setelah login/logout

### Protected Routes
- `ProtectedRoute`: Melindungi halaman yang memerlukan login
- `GuestRoute`: Redirect user yang sudah login dari halaman guest

### Halaman Authentication
- `/login` - Halaman login
- `/signup` - Halaman registrasi
- `/forgot-password` - Reset password
- `/dashboard` - Dashboard yang dilindungi

## Fitur Authentication

### 1. Login dengan Email/Password
```typescript
const { signIn } = useAuth();
await signIn(email, password);
```

### 2. Registrasi
```typescript
const { signUp } = useAuth();
await signUp(email, password, displayName);
```

### 3. Login dengan Google
```typescript
const { signInWithGoogle } = useAuth();
await signInWithGoogle();
```

### 4. Reset Password
```typescript
const { resetPassword } = useAuth();
await resetPassword(email);
```

### 5. Email Verification
```typescript
const { sendVerificationEmail } = useAuth();
await sendVerificationEmail();
```

### 6. Logout
```typescript
const { logout } = useAuth();
await logout();
```

## Error Handling
Sistem ini menangani berbagai error Firebase dengan pesan yang user-friendly:
- Email tidak ditemukan
- Password salah
- Email sudah digunakan
- Password terlalu lemah
- Email tidak valid
- Dan lainnya

## Security Features
- Email verification untuk akun baru
- Password reset yang aman
- Protected routes untuk halaman sensitif
- Auto redirect berdasarkan status authentication
- Error handling yang tidak expose sensitive information

## Usage Examples

### Menggunakan Protected Route
```tsx
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Content yang dilindungi</div>
    </ProtectedRoute>
  );
}
```

### Menggunakan Guest Route
```tsx
import GuestRoute from "@/components/GuestRoute";

export default function Login() {
  return (
    <GuestRoute>
      <div>Halaman login</div>
    </GuestRoute>
  );
}
```

### Menggunakan Auth Context
```tsx
import { useAuth } from "@/contexts/authContext";

export default function Component() {
  const { user, loading, signIn, error } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <div>Welcome, {user.email}!</div>
      ) : (
        <div>Please login</div>
      )}
    </div>
  );
}
```

## Testing
1. Jalankan `npm run dev`
2. Buka `http://localhost:3000`
3. Test semua flow authentication:
   - Registrasi akun baru
   - Login dengan email/password
   - Login dengan Google
   - Reset password
   - Logout
   - Akses protected routes

## Troubleshooting

### Error: "Firebase: Error (auth/configuration-not-found)"
- Pastikan environment variables sudah di-set dengan benar
- Restart development server setelah mengubah .env.local

### Error: "Firebase: Error (auth/unauthorized-domain)"
- Tambahkan domain localhost ke authorized domains di Firebase Console
- Authentication > Settings > Authorized domains

### Google Sign-in tidak berfungsi
- Pastikan Google sign-in sudah di-enable di Firebase Console
- Pastikan project support email sudah di-set
- Check browser console untuk error details

## Next Steps
Setelah authentication berfungsi, Anda bisa menambahkan:
- User profile management
- Role-based access control
- Social login providers lainnya
- Two-factor authentication
- Session management yang lebih advanced
