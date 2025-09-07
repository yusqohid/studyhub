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
      setNotes([]);
      setLoading(false);
      return;
    }

    const notesQuery = query(
      collection(db, 'notes'),
      where('authorId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      notesQuery,
      (snapshot) => {
        const notesData = snapshot.docs.map(doc => convertFirestoreNote({ id: doc.id, ...doc.data() }));
        setNotes(notesData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching notes:', err);
        setError('Gagal memuat catatan');
        setLoading(false);
      }
    );

    return () => unsubscribe();
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
    if (!user) throw new Error('User not authenticated');

    try {
      const docRef = await addDoc(collection(db, 'notes'), {
        ...noteData,
        authorId: user.uid,
        authorName: user.displayName || user.email || 'Anonymous',
        isFavorite: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        sharedWith: []
      });

      return docRef.id;
    } catch (err) {
      console.error('Error creating note:', err);
      throw new Error('Gagal membuat catatan');
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
