# Firebase Setup Guide untuk StudyHub

## 1. Setup Firebase Project

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik "Add project" atau pilih project yang sudah ada
3. Ikuti setup wizard (enable Google Analytics opsional)

## 2. Enable Authentication

1. Di Firebase Console, klik "Authentication" di sidebar kiri
2. Klik tab "Sign-in method"
3. Enable "Email/Password"
4. Optional: Enable "Google" jika diperlukan

## 3. Setup Firestore Database

1. Klik "Firestore Database" di sidebar
2. Klik "Create database"
3. Pilih "Start in production mode" (kita akan update rules nanti)
4. Pilih lokasi server terdekat (asia-southeast2 untuk Indonesia)

## 4. Deploy Firestore Rules

1. Buka file `firestore.rules` yang ada di root project ini
2. Copy isi file tersebut
3. Di Firebase Console > Firestore Database > Rules
4. Replace rules yang ada dengan isi dari `firestore.rules`
5. Klik "Publish"

## 5. Get Firebase Config

1. Di Firebase Console, klik gear icon (Project Settings)
2. Scroll ke bawah ke "Your apps"
3. Klik icon web `</>`
4. Jika belum ada app, klik "Add app" dan register web app
5. Copy config object yang ditampilkan

## 6. Update Environment Variables

1. Buka file `.env.local` di root project
2. Replace placeholder values dengan config dari Firebase:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## 7. Test Connection

1. Jalankan aplikasi: `npm run dev`
2. Buka dashboard
3. Klik tombol "Test Firebase Connection" (hanya muncul di development)
4. Check console browser untuk detail error jika ada

## 8. Troubleshooting

### Error "Permission denied"
- Pastikan Firestore rules sudah di-deploy
- Pastikan user sudah login
- Check console untuk detail error

### Error "not-found" 
- Pastikan Firestore database sudah dibuat
- Check project ID di .env.local

### Error "unauthenticated"
- Pastikan Authentication sudah di-enable
- User harus login dulu sebelum akses Firestore

### Error "failed-precondition"
- Check format data yang dikirim
- Pastikan semua required fields ada

## 9. Security Checklist

- ✅ Firestore rules hanya allow authenticated users
- ✅ Users hanya bisa akses data mereka sendiri
- ✅ Environment variables tidak di-commit ke Git
- ✅ Authentication method sudah di-enable

## 10. Development vs Production

Untuk development:
- Use Firebase Emulator Suite (optional)
- Debug mode enabled di dashboard

Untuk production:
- Remove debug button
- Use production Firebase project
- Enable proper monitoring
