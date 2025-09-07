"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { NoteEditor } from "@/components/NoteEditor";
import { 
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useNotes } from "@/contexts/notesContext";
import { NoteFormData, Note } from "@/types/note";

export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();
  const { getNoteById, updateNote } = useNotes();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const foundNote = getNoteById(params.id as string);
      if (foundNote) {
        setNote(foundNote);
      }
      setIsLoading(false);
    }
  }, [params.id, getNoteById]);

  const handleSave = async (noteData: NoteFormData) => {
    if (!params.id) return;
    
    try {
      await updateNote(params.id as string, noteData);
      router.push(`/notes/${params.id}`);
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push(`/notes/${params.id}`);
  };

  if (isLoading) {
    return (
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
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!note) {
    return (
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
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Catatan Tidak Ditemukan</h2>
              <p className="text-gray-600 mb-6">Catatan yang Anda cari tidak ditemukan atau telah dihapus.</p>
              <button 
                onClick={() => router.push('/notes')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Kembali ke Daftar Catatan
              </button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
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
            initialData={{
              title: note.title,
              content: note.content,
              category: note.category,
              tags: note.tags,
              isPublic: note.isPublic
            }}
            onSave={handleSave}
            onCancel={handleCancel}
            isEditing={true}
            isLoading={false}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
