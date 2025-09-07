# Troubleshooting Permission Denied Error

## Masalah: "Tidak memiliki izin untuk mengakses catatan. Pastikan Anda sudah login."

Meskipun user sudah login, masih muncul error permission denied. Ini menunjukkan masalah dengan Firestore security rules.

## Root Cause Analysis

Error `permission-denied` pada Firestore biasanya disebabkan oleh:

1. **Firestore rules belum di-deploy** ❌
2. **Rules salah atau tidak sesuai dengan query** ❌ 
3. **User belum authenticated dengan benar** ❌
4. **Index belum dibuat untuk query kompleks** ❌

## Quick Fix Steps

### 1. Cek Firestore Rules di Firebase Console

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project `studyhub-6e3f7`
3. Klik **Firestore Database** di sidebar
4. Klik tab **Rules**
5. Pastikan rules-nya seperti ini:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Notes collection rules
    match /notes/{noteId} {
      // Allow read if user is authenticated and is the author
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.authorId;
      
      // Allow create if user is authenticated and is setting themselves as author
      allow create: if request.auth != null && 
                       request.auth.uid != null &&
                       request.resource.data.authorId == request.auth.uid;
      
      // Allow update if user is authenticated and is the author
      allow update: if request.auth != null && 
                       resource.data.authorId == request.auth.uid;
      
      // Allow delete if user is authenticated and is the author
      allow delete: if request.auth != null && 
                       resource.data.authorId == request.auth.uid;
    }
  }
}
```

6. Klik **Publish** untuk deploy rules

### 2. Test Connection dengan Debug Button

1. Login ke aplikasi
2. Pergi ke Dashboard 
3. Klik tombol **"Test Firebase Connection"** (hanya muncul di development)
4. Check console browser untuk debug info

### 3. Manual Test di Firebase Console

1. Di Firestore Database, buka tab **Data**
2. Coba buat collection `notes` secara manual
3. Tambah document dengan struktur:
```json
{
  "authorId": "USER_UID_DARI_AUTH",
  "title": "Test Note",
  "content": "This is a test",
  "category": "Test",
  "tags": [],
  "isFavorite": false,
  "isPublic": false,
  "authorName": "Your Name",
  "createdAt": "firestore_timestamp",
  "updatedAt": "firestore_timestamp",
  "sharedWith": []
}
```

### 4. Check Authentication Status

Buka browser console dan jalankan:
```javascript
// Check if user is authenticated
console.log('Current user:', firebase.auth().currentUser);

// Check user details
const user = firebase.auth().currentUser;
if (user) {
  console.log('User authenticated:', {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified
  });
} else {
  console.log('No user authenticated');
}
```

## Advanced Debugging

### Tambahan Console Logs

Kode sudah ditambahkan enhanced logging. Check browser console untuk:

```
✅ Notes snapshot received successfully
📊 Notes count: X
👤 Current user: { uid, email, emailVerified }
🔐 Permission denied - checking auth state...
❌ Error fetching notes: { code, message, details }
```

### Common Error Codes & Solutions

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `permission-denied` | Firestore rules menolak akses | Deploy rules yang benar |
| `unauthenticated` | User belum login | Pastikan authentication berhasil |
| `unavailable` | Firebase service down | Tunggu atau check status Firebase |
| `failed-precondition` | Rules atau data validation gagal | Check struktur data sesuai rules |

## Expected Behavior After Fix

✅ **Login** → Dashboard muncul tanpa connection error
✅ **Notes page** → Loading → Menampilkan daftar notes (atau kosong jika belum ada)  
✅ **Create note** → Berhasil tersimpan
✅ **Debug button** → Console log menampilkan "✅ Firebase connection test completed successfully"

## If Still Not Working

1. **Double-check rules deployment** - Rules di console Firebase harus sama dengan file `firestore.rules`
2. **Check project ID** - Pastikan `.env.local` menggunakan project ID yang benar
3. **Try logout/login** - Refresh authentication state
4. **Clear browser cache** - Reset localStorage dan cookies
5. **Check Firebase project status** - Pastikan billing dan services aktif

## Debug Commands

Jalankan di browser console setelah login:

```javascript
// Test Firebase connection
await window.testFirebaseConnection?.();

// Check current user
console.log(firebase.auth().currentUser);

// Test simple Firestore read
const db = firebase.firestore();
db.collection('notes').where('authorId', '==', 'test').get()
  .then(snapshot => console.log('Firestore test OK:', snapshot.docs.length))
  .catch(err => console.error('Firestore test failed:', err));
```
