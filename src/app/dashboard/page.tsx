"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { 
  Plus, 
  FileText, 
  Heart, 
  Eye, 
  TrendingUp, 
  Clock,
  ArrowRight,
  BookOpen,
  Brain,
  Search,
  Settings
} from "lucide-react";
import { useNotes } from "@/contexts/notesContext";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { testFirebaseConnection } from "@/firebase/debug";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  const { user } = useAuth();
  const { notes, loading, error } = useNotes();
  const router = useRouter();
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestFirebase = async () => {
    try {
      const result = await testFirebaseConnection();
      setTestResult(result ? "✅ Firebase connected successfully" : "❌ Firebase connection failed");
      setTimeout(() => setTestResult(null), 5000);
    } catch (error) {
      setTestResult(`❌ Connection test failed: ${error}`);
      setTimeout(() => setTestResult(null), 5000);
    }
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

  const recentNotes = notes.slice(0, 5);
  const favoriteNotes = notes.filter(note => note.isFavorite).slice(0, 3);

  // Show error state if there's a connection issue
  if (error) {
    return (
      <ProtectedRoute>
        <SidebarProvider>
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col items-center justify-center p-8">
              <Card className="max-w-md text-center">
                <CardHeader>
                  <CardTitle className="text-red-600">Connection Error</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{error}</p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={handleTestFirebase} variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Test Connection
                    </Button>
                    <Button onClick={() => window.location.reload()}>
                      Retry
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
              {/* Welcome Section */}
              <div className="px-4 lg:px-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold tracking-tight mb-2">
                    Selamat datang kembali, {user?.displayName || user?.email?.split('@')[0]}! 👋
                  </h1>
                  <p className="text-muted-foreground">
                    Kelola dan organisir catatan belajar Anda dengan StudyHub
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Button 
                    onClick={() => router.push('/notes')}
                    size="lg"
                    className="h-16 flex-col gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Buat Catatan Baru</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="h-16 flex-col gap-2"
                    onClick={() => router.push('/notes')}
                  >
                    <Search className="h-5 w-5" />
                    <span>Cari Catatan</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="h-16 flex-col gap-2"
                    onClick={() => router.push('/notes')}
                  >
                    <Brain className="h-5 w-5" />
                    <span>AI Summarizer</span>
                  </Button>
                </div>

                {/* Debug Button - Remove in production */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mb-4 space-y-2">
                    <Button 
                      onClick={handleTestFirebase}
                      variant="secondary"
                      size="sm"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Test Firebase Connection
                    </Button>
                    {testResult && (
                      <p className="text-sm px-2 py-1 bg-muted rounded">
                        {testResult}
                      </p>
                    )}
                  </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{stats.total}</p>
                          <p className="text-sm text-muted-foreground">Total Catatan</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                          <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{stats.favorites}</p>
                          <p className="text-sm text-muted-foreground">Favorit</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                          <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{stats.public}</p>
                          <p className="text-sm text-muted-foreground">Publik</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{stats.thisMonth}</p>
                          <p className="text-sm text-muted-foreground">Bulan Ini</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 px-4 lg:px-6">
                {/* Recent Notes */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Catatan Terbaru
                      </CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push('/notes')}
                      >
                        Lihat Semua
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : recentNotes.length > 0 ? (
                      <div className="space-y-3">
                        {recentNotes.map((note) => (
                          <div 
                            key={note.id}
                            className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                            onClick={() => router.push(`/notes/${note.id}`)}
                          >
                            <h4 className="font-medium line-clamp-1 mb-2">{note.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {note.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                        <p>Belum ada catatan</p>
                        <p className="text-sm">Mulai buat catatan pertama Anda!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Favorite Notes */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                        Catatan Favorit
                      </CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push('/notes')}
                      >
                        Lihat Semua
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : favoriteNotes.length > 0 ? (
                      <div className="space-y-3">
                        {favoriteNotes.map((note) => (
                          <div 
                            key={note.id}
                            className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                            onClick={() => router.push(`/notes/${note.id}`)}
                          >
                            <h4 className="font-medium line-clamp-1 mb-2">{note.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {note.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <Heart className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                        <p>Belum ada catatan favorit</p>
                        <p className="text-sm">Tandai catatan sebagai favorit untuk akses cepat</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Getting Started */}
              {notes.length === 0 && (
                <div className="px-4 lg:px-6">
                  <Card className="bg-gradient-to-br from-primary/5 via-primary/5 to-accent/5 border">
                    <CardContent className="p-8 text-center">
                      <div className="max-w-2xl mx-auto">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-primary" />
                        <h3 className="text-2xl font-bold mb-4">
                          Mulai Perjalanan Belajar Anda
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          StudyHub membantu Anda mengorganisir catatan belajar dengan fitur AI summarizer, 
                          pencarian cerdas, dan berbagi catatan dengan teman.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button 
                            onClick={() => router.push('/notes')}
                            size="lg"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Buat Catatan Pertama
                          </Button>
                          <Button 
                            variant="outline"
                            size="lg"
                            onClick={() => router.push('/features')}
                          >
                            Pelajari Fitur
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ProtectedRoute>
  );
}
