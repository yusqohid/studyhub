"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { NotesList } from "@/components/NotesList";
import { NoteEditor } from "@/components/NoteEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Plus, FileText, Heart, Eye, TrendingUp, Sparkles, Brain, Clock, Zap } from "lucide-react";
import { useNotes } from "@/contexts/notesContext";
import { Note, NoteFormData } from "@/types/note";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "sonner";

export default function NotesPage() {
  const {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    toggleFavorite
  } = useNotes();
  const router = useRouter();

  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  // Track recent activity
  useEffect(() => {
    const activities = [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const todayNotes = notes.filter(note => 
      new Date(note.updatedAt) >= today
    );
    
    if (todayNotes.length > 0) {
      activities.push(`${todayNotes.length} catatan diperbarui hari ini`);
    }
    
    const thisWeekNotes = notes.filter(note => {
      const noteDate = new Date(note.updatedAt);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return noteDate >= weekAgo;
    });
    
    if (thisWeekNotes.length > todayNotes.length) {
      activities.push(`${thisWeekNotes.length - todayNotes.length} catatan minggu ini`);
    }
    
    setRecentActivity(activities);
  }, [notes]);

  const handleCreateNote = async (noteData: NoteFormData) => {
    try {
      setIsCreating(true);
      toast.loading('Membuat catatan baru...', { id: 'create-note' });
      
      const noteId = await createNote(noteData);
      setShowEditor(false);
      
      toast.success('Catatan berhasil dibuat! 🎉', { id: 'create-note' });
      router.push(`/notes/${noteId}`);
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Gagal membuat catatan. Silakan coba lagi.', { id: 'create-note' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditNote = async (noteData: NoteFormData) => {
    if (!editingNote) return;

    try {
      await updateNote(editingNote.id, noteData);
      setShowEditor(false);
      setEditingNote(null);
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Gagal memperbarui catatan');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
      try {
        await deleteNote(noteId);
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Gagal menghapus catatan');
      }
    }
  };

  const handleToggleFavorite = async (noteId: string) => {
    try {
      await toggleFavorite(noteId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Gagal mengubah status favorit');
    }
  };

  const handleShareNote = () => {
    // TODO: Implement sharing functionality
    alert('Fitur berbagi akan segera hadir!');
  };

  const handleViewNote = (note: Note) => {
    router.push(`/notes/${note.id}`);
  };

  const handleEditClick = (note: Note) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
    setEditingNote(null);
  };

  const stats = {
    total: notes.length,
    favorites: notes.filter(note => note.isFavorite).length,
    public: notes.filter(note => note.isPublic).length,
    thisMonth: notes.filter(note => {
      const now = new Date();
      const noteDate = note.createdAt;
      return noteDate.getMonth() === now.getMonth() &&
        noteDate.getFullYear() === now.getFullYear();
    }).length
  };

  if (showEditor) {
    return (
      <ProtectedRoute>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col p-6">
              <NoteEditor
                initialData={editingNote ? {
                  title: editingNote.title,
                  content: editingNote.content,
                  category: editingNote.category,
                  tags: editingNote.tags,
                  isPublic: editingNote.isPublic
                } : undefined}
                onSave={editingNote ? handleEditNote : handleCreateNote}
                onCancel={handleCancelEdit}
                isEditing={!!editingNote}
                isLoading={isCreating}
              />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Header */}
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-gray-900">Catatan Saya</h1>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI-Powered
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Kelola dan organisir catatan belajar Anda</span>
                      {recentActivity.length > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-green-600">{recentActivity[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowEditor(true)}
                      size="lg"
                      className="font-medium"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Buat Catatan Baru
                    </Button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                          <p className="text-sm text-gray-600">Total Catatan</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <Heart className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{stats.favorites}</p>
                          <p className="text-sm text-gray-600">Favorit</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Eye className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{stats.public}</p>
                          <p className="text-sm text-gray-600">Publik</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
                          <p className="text-sm text-gray-600">Bulan Ini</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow bg-orange-50 border-orange-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Brain className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-orange-800">AI</p>
                          <p className="text-sm text-orange-700">Ready</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Notes List */}
              <div className="px-4 lg:px-6">
                <NotesList
                  notes={notes}
                  loading={loading}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteNote}
                  onToggleFavorite={handleToggleFavorite}
                  onShare={handleShareNote}
                  onView={handleViewNote}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ProtectedRoute>
  );
}
