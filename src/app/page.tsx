"use client";

import { useAuth } from "@/contexts/authContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Selamat Datang di <span className="text-blue-600">StudyHub</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Platform catatan pintar dengan AI summarizer untuk membantu Anda belajar lebih efektif
          </p>
        </div>

        {user ? (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Halo, {user.displayName || user.email}!</CardTitle>
                <CardDescription>
                  Anda sudah masuk ke akun StudyHub
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600">
                  Siap untuk mulai membuat catatan dan belajar dengan AI?
                </p>
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Buka Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    Catatan Pintar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Buat catatan dengan mudah dan dapatkan ringkasan otomatis menggunakan AI
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🤖</span>
                    AI Summarizer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Dapatkan ringkasan otomatis dari catatan Anda untuk belajar lebih efisien
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🔍</span>
                    Pencarian Cepat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Temukan catatan dan informasi dengan mudah menggunakan fitur pencarian
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">☁️</span>
                    Sinkronisasi Cloud
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Akses catatan Anda di mana saja dengan sinkronisasi cloud yang aman
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Mulai Belajar Hari Ini
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Bergabunglah dengan ribuan siswa yang sudah menggunakan StudyHub
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Daftar Gratis
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Masuk
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-16 text-center text-gray-500">
          <p>&copy; 2024 StudyHub. Dibuat dengan ❤️ untuk pembelajaran yang lebih baik.</p>
        </footer>
      </div>
    </div>
  );
}
