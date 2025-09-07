"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { debugFirebaseError } from "@/firebase/debug";
import { useAuth } from "@/contexts/authContext";
import { Note, NoteFormData, NoteFilters, NoteCategory } from "@/types/note";

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  error: string | null;
  filters: NoteFilters;
  setFilters: (filters: NoteFilters) => void;
  filteredNotes: Note[];
  createNote: (noteData: NoteFormData) => Promise<string>;
  updateNote: (id: string, noteData: Partial<NoteFormData>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  shareNote: (id: string, userIds: string[]) => Promise<void>;
  getNoteById: (id: string) => Note | undefined;
  getPublicNotes: () => Note[];
  getUserNotes: (userId: string) => Note[];
}

const NotesContext = createContext<NotesContextType>({
  notes: [],
  loading: true,
  error: null,
  filters: {
    category: '',
    tags: [],
    isFavorite: false,
    searchQuery: ''
  },
  setFilters: () => {},
  filteredNotes: [],
  createNote: async () => '',
  updateNote: async () => {},
  deleteNote: async () => {},
  toggleFavorite: async () => {},
  shareNote: async () => {},
  getNoteById: () => undefined,
  getPublicNotes: () => [],
  getUserNotes: () => []
});

// Convert Firestore timestamp to Date
const convertTimestamp = (timestamp: { toDate?: () => Date } | Date): Date => {
  if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  return new Date();
};

// Convert Note data from Firestore
const convertFirestoreNote = (doc: { id: string; [key: string]: unknown }): Note => ({
  id: doc.id,
  title: (doc.title as string) || '',
  content: (doc.content as string) || '',
  summary: (doc.summary as string) || '',
  category: (doc.category as string) || 'Lainnya',
  tags: (doc.tags as string[]) || [],
  isFavorite: (doc.isFavorite as boolean) || false,
  isPublic: (doc.isPublic as boolean) || false,
  authorId: (doc.authorId as string) || '',
  authorName: (doc.authorName as string) || '',
  createdAt: convertTimestamp(doc.createdAt as { toDate?: () => Date } | Date),
  updatedAt: convertTimestamp(doc.updatedAt as { toDate?: () => Date } | Date),
  sharedWith: (doc.sharedWith as string[]) || []
});

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<NoteFilters>({
    category: '',
    tags: [],
    isFavorite: false,
    searchQuery: ''
  });

  // Listen to notes changes
  useEffect(() => {
    if (!user) {
      console.log('No user found, clearing notes');
      setNotes([]);
      setLoading(false);
      setError(null);
      return;
    }

    console.log('Setting up notes listener for user:', {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified
    });

    try {
      // Simple query first - just get user's notes without ordering
      const notesQuery = query(
        collection(db, 'notes'),
        where('authorId', '==', user.uid)
      );

      const unsubscribe = onSnapshot(
        notesQuery,
        (snapshot) => {
          console.log('✅ Notes snapshot received successfully');
          console.log('📊 Notes count:', snapshot.docs.length);
          
          if (snapshot.docs.length === 0) {
            console.log('📝 No notes found for this user');
          }
          
          const notesData = snapshot.docs.map(doc => {
            const data = { id: doc.id, ...doc.data() } as Record<string, unknown> & { id: string };
            console.log('Processing note:', { 
              id: data.id, 
              title: data.title || 'No title', 
              authorId: data.authorId || 'No authorId' 
            });
            return convertFirestoreNote(data);
          });
          
          // Sort in memory instead of using orderBy to avoid index issues
          const sortedNotes = notesData.sort((a, b) => 
            b.updatedAt.getTime() - a.updatedAt.getTime()
          );
          
          setNotes(sortedNotes);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('❌ Error fetching notes:', {
            code: err.code,
            message: err.message,
            details: err
          });
          
          // More specific error handling
          if (err.code === 'permission-denied') {
            console.log('🔐 Permission denied - checking auth state...');
            console.log('User auth state:', {
              uid: user?.uid,
              email: user?.email,
              emailVerified: user?.emailVerified,
              providerData: user?.providerData?.length || 0
            });
            setError('Tidak memiliki izin untuk mengakses catatan. Pastikan rules Firestore sudah di-deploy.');
          } else if (err.code === 'unavailable') {
            setError('Layanan tidak tersedia. Coba lagi nanti.');
          } else if (err.code === 'failed-precondition') {
            setError('Database belum dikonfigurasi dengan benar. Periksa Firestore rules.');
          } else {
            setError('Gagal memuat catatan: ' + err.message);
          }
          setLoading(false);
        }
      );

      return () => {
        console.log('Cleaning up notes listener');
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up notes listener:', error);
      setError('Gagal mengatur koneksi ke database');
      setLoading(false);
    }
  }, [user]);

  // Filter notes based on current filters
  const filteredNotes = notes.filter(note => {
    // Category filter
    if (filters.category && note.category !== filters.category) {
      return false;
    }

    // Tags filter
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        note.tags.some(noteTag => 
          noteTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (!hasMatchingTag) return false;
    }

    // Favorite filter
    if (filters.isFavorite && !note.isFavorite) {
      return false;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = note.title.toLowerCase().includes(query);
      const matchesContent = note.content.toLowerCase().includes(query);
      const matchesTags = note.tags.some(tag => 
        tag.toLowerCase().includes(query)
      );
      if (!matchesTitle && !matchesContent && !matchesTags) {
        return false;
      }
    }

    return true;
  });

  const createNote = async (noteData: NoteFormData): Promise<string> => {
    if (!user) {
      console.log('❌ User not authenticated - redirecting to login');
      throw new Error('Anda harus login terlebih dahulu untuk membuat catatan');
    }

    console.log('Creating note with data:', noteData);
    console.log('User info:', { uid: user.uid, email: user.email, displayName: user.displayName });

    try {
      // Validate required fields
      if (!noteData.title || !noteData.content) {
        throw new Error('Title and content are required');
      }

      const noteToSave = {
        title: noteData.title,
        content: noteData.content,
        category: noteData.category || 'Lainnya',
        tags: noteData.tags || [],
        isPublic: noteData.isPublic || false,
        authorId: user.uid,
        authorName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        isFavorite: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        sharedWith: []
      };

      console.log('Saving note to Firestore:', noteToSave);

      const docRef = await addDoc(collection(db, 'notes'), noteToSave);

      console.log('Note created successfully with ID:', docRef.id);
      return docRef.id;
    } catch (err) {
      console.error('Error creating note:', err);
      debugFirebaseError(err);
      
      // More specific error messages
      if (err instanceof Error) {
        if (err.message.includes('permission-denied')) {
          throw new Error('Tidak memiliki izin untuk membuat catatan. Pastikan Anda sudah login.');
        } else if (err.message.includes('network')) {
          throw new Error('Masalah koneksi internet. Coba lagi nanti.');
        } else {
          throw new Error(`Gagal membuat catatan: ${err.message}`);
        }
      } else {
        throw new Error('Gagal membuat catatan. Terjadi kesalahan tidak dikenal.');
      }
    }
  };

  const updateNote = async (id: string, noteData: Partial<NoteFormData>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const noteRef = doc(db, 'notes', id);
      await updateDoc(noteRef, {
        ...noteData,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error updating note:', err);
      throw new Error('Gagal memperbarui catatan');
    }
  };

  const deleteNote = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      await deleteDoc(doc(db, 'notes', id));
    } catch (err) {
      console.error('Error deleting note:', err);
      throw new Error('Gagal menghapus catatan');
    }
  };

  const toggleFavorite = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const note = notes.find(n => n.id === id);
      if (!note) throw new Error('Catatan tidak ditemukan');

      const noteRef = doc(db, 'notes', id);
      await updateDoc(noteRef, {
        isFavorite: !note.isFavorite,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error toggling favorite:', err);
      throw new Error('Gagal mengubah status favorit');
    }
  };

  const shareNote = async (id: string, userIds: string[]): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const noteRef = doc(db, 'notes', id);
      await updateDoc(noteRef, {
        sharedWith: userIds,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error sharing note:', err);
      throw new Error('Gagal berbagi catatan');
    }
  };

  const getNoteById = (id: string): Note | undefined => {
    return notes.find(note => note.id === id);
  };

  const getPublicNotes = (): Note[] => {
    return notes.filter(note => note.isPublic);
  };

  const getUserNotes = (userId: string): Note[] => {
    return notes.filter(note => note.authorId === userId);
  };

  return (
    <NotesContext.Provider value={{
      notes,
      loading,
      error,
      filters,
      setFilters,
      filteredNotes,
      createNote,
      updateNote,
      deleteNote,
      toggleFavorite,
      shareNote,
      getNoteById,
      getPublicNotes,
      getUserNotes
    }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
