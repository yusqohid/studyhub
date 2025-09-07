"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { 
  User, 
  Mail, 
  Calendar, 
  FileText, 
  Heart, 
  Eye, 
  Settings,
  Edit,
  Shield,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { useNotes } from "@/contexts/notesContext";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfilePage() {
  const { user, sendVerificationEmail } = useAuth();
  const { notes } = useNotes();
  const router = useRouter();

  const handleSendVerification = async () => {
    try {
      await sendVerificationEmail();
      alert("Email verifikasi telah dikirim!");
    } catch (error) {
      console.error("Verification error:", error);
      alert("Gagal mengirim email verifikasi");
    }
  };

  const getUserInitials = (name: string | null | undefined, email: string | null | undefined) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
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
                {/* Profile Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-6 mb-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || ""} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl">
                        {getUserInitials(user?.displayName, user?.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {user?.displayName || "User"}
                      </h1>
                      <p className="text-gray-600 mb-4">{user?.email}</p>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {user?.providerData[0]?.providerId === "google.com" ? "Google" : "Email/Password"}
                        </Badge>
                        {user?.emailVerified ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Email Terverifikasi
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Email Belum Terverifikasi
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Pengaturan
                    </Button>
                  </div>

                  {!user?.emailVerified && (
                    <Card className="bg-yellow-50 border-yellow-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                            <div>
                              <p className="font-medium text-yellow-800">Email belum terverifikasi</p>
                              <p className="text-sm text-yellow-700">
                                Verifikasi email Anda untuk keamanan akun yang lebih baik
                              </p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={handleSendVerification}
                            className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Kirim Verifikasi
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <Card>
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

                  <Card>
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

                  <Card>
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

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
                          <p className="text-sm text-gray-600">Bulan Ini</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Account Information */}
                  <div className="lg:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-600" />
                          Informasi Akun
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="text-sm font-medium">{user?.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Nama</label>
                          <p className="text-sm font-medium">{user?.displayName || "Tidak ada nama"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Provider</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {user?.providerData[0]?.providerId === "google.com" 
                                ? "Google" 
                                : "Email/Password"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Bergabung</label>
                          <p className="text-sm font-medium">
                            {user?.metadata?.creationTime 
                              ? formatDistanceToNow(new Date(user.metadata.creationTime), { addSuffix: true })
                              : "Tidak diketahui"
                            }
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Notes */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Catatan Terbaru
                          </CardTitle>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push('/notes')}
                          >
                            Lihat Semua
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {recentNotes.length > 0 ? (
                          <div className="space-y-3">
                            {recentNotes.map((note) => (
                              <div 
                                key={note.id}
                                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => router.push(`/notes/${note.id}`)}
                              >
                                <h4 className="font-medium text-gray-900 line-clamp-1">{note.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {note.category}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
                                  </span>
                                  {note.isPublic && (
                                    <Badge variant="outline" className="text-xs text-green-600">
                                      <Eye className="w-2 h-2 mr-1" />
                                      Publik
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>Belum ada catatan</p>
                            <p className="text-sm">Mulai buat catatan pertama Anda!</p>
                          </div>
                        )}
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
