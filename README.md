# 📚 StudyHub - AI-Powered Study Notes Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Firebase-12.2.1-orange?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/shadcn/ui-Latest-black?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
</div>

<div align="center">
  <p><em>Platform catatan belajar modern dengan kekuatan AI untuk meningkatkan produktivitas belajar Anda</em></p>
</div>

---

## 🌟 **Features**

### 🔐 **Authentication System**
- **Multi-Provider Login**: Google OAuth & Email/Password
- **Secure Authentication**: Firebase Auth integration
- **Email Verification**: Enhanced security features
- **Protected Routes**: Route guards untuk halaman private

### 📝 **Note Management**
- **CRUD Operations**: Create, Read, Update, Delete notes
- **Rich Text Editor**: Advanced note editing capabilities
- **Categories & Tags**: Organize notes by categories
- **Search & Filter**: Powerful search with multiple filters
- **Favorites System**: Mark important notes as favorites
- **Public/Private Notes**: Control note visibility

### 🤖 **AI-Powered Features**
- **AI Summarization**: Auto-generate note summaries with Gemini AI
- **Study Questions**: Generate practice questions from your notes
- **Concept Explanation**: Get detailed explanations of complex topics
- **Secure API Integration**: Server-side AI processing for security

### 🎨 **Modern UI/UX**
- **shadcn/ui Components**: Beautiful, accessible, and consistent UI
- **Responsive Design**: Perfect experience on all devices
- **Dark/Light Theme**: Adaptive theming support
- **Clean Navigation**: Intuitive sidebar and header navigation
- **Loading States**: Smooth loading indicators and transitions
- **Toast Notifications**: Real-time feedback system

### 📊 **Dashboard & Analytics**
- **Personal Dashboard**: Overview of your learning progress
- **Note Statistics**: Track your study habits
- **Recent Activity**: Quick access to recent notes
- **Profile Management**: Comprehensive user profile

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18.17 or later
- npm, yarn, or pnpm
- Firebase project
- Google Gemini API key

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yusqohid/studyhub.git
   cd studyhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment setup**
   
   Create `.env.local` file in the root directory:
   ```bash
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_MEASUREMENT_ID=your_measurement_id

   # Gemini AI API Key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Firebase setup**
   
   Configure Firestore security rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /notes/{noteId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.authorId;
         allow create: if request.auth != null && request.auth.uid == request.resource.data.authorId;
       }
       
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

5. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🏗️ **Project Structure**

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── api/                      # API routes
│   │   └── gemini/              # AI integration endpoint
│   ├── dashboard/               # Dashboard page
│   ├── notes/                   # Notes management
│   │   ├── [id]/               # Individual note pages
│   │   └── [id]/edit/          # Note editing
│   ├── profile/                # User profile
│   └── globals.css             # Global styles
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   ├── AISummarizer.tsx        # AI features component
│   ├── NoteEditor.tsx          # Rich text editor
│   ├── Navigation.tsx          # Main navigation
│   └── app-sidebar.tsx         # Sidebar navigation
├── contexts/                   # React contexts
│   ├── authContext.tsx         # Authentication state
│   └── notesContext.tsx        # Notes state management
├── firebase/                   # Firebase configuration
│   ├── firebase.tsx            # Firebase initialization
│   └── debug.ts               # Debug utilities
├── lib/                       # Utilities
│   ├── utils.ts               # General utilities
│   └── gemini.ts             # AI integration utilities
└── types/                     # TypeScript definitions
    └── note.ts               # Note type definitions
```

---

## 🛠️ **Tech Stack**

### **Frontend**
- **Next.js 15.5.2** - React framework with App Router
- **TypeScript 5** - Type safety and developer experience
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful and accessible UI components
- **Lucide React** - Modern icon library
- **Framer Motion** - Smooth animations and transitions

### **Backend & Database**
- **Firebase Auth** - Authentication service
- **Firestore** - NoSQL cloud database
- **Next.js API Routes** - Server-side API endpoints
- **Google Gemini AI** - AI-powered features

### **State Management & Utils**
- **React Context** - Global state management
- **date-fns** - Date manipulation utilities
- **Zod** - Schema validation
- **Sonner** - Toast notification system

---

## 🚀 **Deployment**

### **Deploy to Vercel (Recommended)**

1. Push your code to GitHub
2. Connect your GitHub repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### **Deploy to Netlify**

1. Build the project: `npm run build`
2. Deploy the `.next` folder to Netlify
3. Add environment variables in Netlify dashboard

### **Environment Variables for Production**

Ensure all environment variables are properly configured in your deployment platform:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_MEASUREMENT_ID`
- `GEMINI_API_KEY` (Server-side only)

---

## 🔧 **Available Scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

---

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Use conventional commit messages
- Ensure all tests pass
- Update documentation as needed

---

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋‍♂️ **Support**

If you have any questions or need help, please:

- 📧 Create an [Issue](https://github.com/yusqohid/studyhub/issues)
- 💬 Start a [Discussion](https://github.com/yusqohid/studyhub/discussions)
- 📱 Contact: [yusqohid@example.com](mailto:yusqohid@example.com)

---

## 🎉 **Acknowledgments**

- [Next.js](https://nextjs.org/) for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Firebase](https://firebase.google.com/) for backend services
- [Google AI](https://ai.google.dev/) for Gemini AI integration
- [Vercel](https://vercel.com/) for deployment platform

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/yusqohid">Yusuf Qohid</a></p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>
