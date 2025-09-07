"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/compone                          {!summary && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleSummarize}
                            >
                              <Brain className="w-4 h-4 mr-2" />
                              Buat Ringkasan AI
                            </Button>
                          )}rt { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { 
  ArrowLeft, 
  Edit, 
  Heart, 
  Share2, 
  Eye, 
  EyeOff, 
  Calendar, 
  User, 
  Tag,
  Brain,
  Copy,
  Check
} from "lucide-react";
import { useNotes } from "@/contexts/notesContext";
import { Note } from "@/types/note";
import { formatDistanceToNow } from "date-fns";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AISummarizer } from "@/components/AISummarizer";

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getNoteById, toggleFavorite, updateNote } = useNotes();
  const [note, setNote] = useState<Note | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [showSummarizer, setShowSummarizer] = useState(false);

  useEffect(() => {
    if (params.id) {
      const foundNote = getNoteById(params.id as string);
      setNote(foundNote || null);
      if (foundNote?.summary) {
        setSummary(foundNote.summary);
      }
    }
  }, [params.id, getNoteById]);

  const handleToggleFavorite = async () => {
    if (!note) return;
    try {
      await toggleFavorite(note.id);
      setNote(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Gagal mengubah status favorit');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: note?.title,
        text: note?.content.substring(0, 100) + '...',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSummarize = async () => {
    if (!note) return;
    setShowSummarizer(true);
  };

  const handleSummaryGenerated = async (summaryText: string) => {
    if (!note) return;
    
    try {
      // Save summary to note
      await updateNote(note.id, {
        title: note.title,
        content: note.content,
        category: note.category,
        tags: note.tags,
        isPublic: note.isPublic
      });
      setSummary(summaryText);
    } catch (error) {
      console.error('Error saving summary:', error);
    }
  };

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
              <Button onClick={() => router.push('/notes')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Daftar Catatan
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
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
              <div className="px-4 lg:px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push('/notes')}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Kembali
                    </Button>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{note.title}</h1>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {note.authorName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant={note.isFavorite ? "default" : "outline"}
                      size="sm"
                      onClick={handleToggleFavorite}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${note.isFavorite ? 'fill-current' : ''}`} />
                      {note.isFavorite ? 'Favorit' : 'Tambah Favorit'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Tersalin!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4 mr-2" />
                          Bagikan
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/notes/${note.id}/edit`)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>

                {/* Note Info */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <Badge variant="secondary" className="text-sm">
                    {note.category}
                  </Badge>
                  {note.isPublic ? (
                    <Badge variant="outline" className="text-sm text-green-600">
                      <Eye className="w-3 h-3 mr-1" />
                      Publik
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-sm text-gray-600">
                      <EyeOff className="w-3 h-3 mr-1" />
                      Privat
                    </Badge>
                  )}
                  {note.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Note Content */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Konten Catatan</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none">
                          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                            {note.content}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* AI Summary */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-purple-600" />
                            Ringkasan AI
                          </CardTitle>
                          {!summary && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleSummarize}
                              disabled={isSummarizing}
                            >
                              {isSummarizing ? (
                                <>
                                  <Brain className="w-4 h-4 mr-2 animate-pulse" />
                                  Membuat Ringkasan...
                                </>
                              ) : (
                                <>
                                  <Brain className="w-4 h-4 mr-2" />
                                  Buat Ringkasan
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {summary ? (
                          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                            <div className="whitespace-pre-wrap text-gray-800">
                              {summary}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Belum ada ringkasan untuk catatan ini</p>
                            <p className="text-sm">Klik tombol &quot;Buat Ringkasan&quot; untuk mendapatkan ringkasan otomatis</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Note Stats */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Statistik</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Jumlah Karakter</span>
                          <span className="font-semibold">{note.content.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Jumlah Kata</span>
                          <span className="font-semibold">{note.content.split(' ').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Jumlah Tag</span>
                          <span className="font-semibold">{note.tags.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dibuat</span>
                          <span className="font-semibold">
                            {formatDistanceToNow(note.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Diperbarui</span>
                          <span className="font-semibold">
                            {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Aksi Cepat</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button 
                          className="w-full justify-start" 
                          variant="outline"
                          onClick={() => router.push(`/notes/${note.id}/edit`)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Catatan
                        </Button>
                        <Button 
                          className="w-full justify-start" 
                          variant="outline"
                          onClick={handleShare}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Bagikan Catatan
                        </Button>
                        <Button 
                          className="w-full justify-start" 
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(note.content);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Tersalin!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Salin Konten
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ProtectedRoute>
  );
}
