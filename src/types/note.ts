export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  isPublic: boolean;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
  sharedWith?: string[]; // Array of user IDs
}

export interface NoteFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPublic: boolean;
}

export interface NoteFilters {
  category: string;
  tags: string[];
  isFavorite: boolean;
  searchQuery: string;
}

export const NOTE_CATEGORIES = [
  'Matematika',
  'Pemrograman',
  'Fisika',
  'Kimia',
  'Biologi',
  'Sejarah',
  'Bahasa',
  'Ekonomi',
  'Psikologi',
  'Lainnya'
] as const;

export type NoteCategory = typeof NOTE_CATEGORIES[number];
