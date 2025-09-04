"use client";

import { useAuth } from "@/contexts/authContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, logout, sendVerificationEmail } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSendVerification = async () => {
    try {
      await sendVerificationEmail();
      alert("Email verifikasi telah dikirim!");
    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Akun</CardTitle>
                <CardDescription>Detail akun Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-lg">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nama</label>
                  <p className="text-lg">{user?.displayName || "Tidak ada nama"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status Email</label>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user?.emailVerified 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {user?.emailVerified ? "Terverifikasi" : "Belum Terverifikasi"}
                    </span>
                    {!user?.emailVerified && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={handleSendVerification}
                      >
                        Kirim Verifikasi
                      </Button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Provider</label>
                  <p className="text-lg">
                    {user?.providerData[0]?.providerId === "google.com" 
                      ? "Google" 
                      : "Email/Password"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
                <CardDescription>Fitur yang tersedia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline">
                  Buat Catatan Baru
                </Button>
                <Button className="w-full" variant="outline">
                  Lihat Semua Catatan
                </Button>
                <Button className="w-full" variant="outline">
                  Pengaturan Profil
                </Button>
                <Button className="w-full" variant="outline">
                  Bantuan
                </Button>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Statistik</CardTitle>
                <CardDescription>Ringkasan aktivitas Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-blue-600">Total Catatan</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-green-600">Catatan Bulan Ini</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-sm text-purple-600">Kata Kunci</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
