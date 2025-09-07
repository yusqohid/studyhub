"use client";

import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Check,
  Sparkles,
  ArrowRight,
  Star,
  Zap,
  Crown,
  Users,
  Shield,
  Clock,
  FileText,
  Brain,
  Cloud
} from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="w-3 h-3 mr-1" />
              Harga Transparan
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Pilih Paket yang
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Tepat untuk Anda</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Mulai gratis dan upgrade kapan saja. Semua paket termasuk fitur inti StudyHub dengan dukungan penuh.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="border-0 shadow-lg relative">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">Gratis</CardTitle>
                <CardDescription className="text-base">Cocok untuk pemula</CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-bold">Rp 0</span>
                  <span className="text-gray-500">/bulan</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Hingga 10 catatan</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>AI Summarizer (5x/bulan)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Pencarian dasar</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Sinkronisasi cloud</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Dukungan email</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full" variant="outline">
                    Mulai Gratis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-0 shadow-xl relative border-2 border-blue-500">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Paling Populer
                </Badge>
              </div>
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  Pro
                </CardTitle>
                <CardDescription className="text-base">Cocok untuk pelajar serius</CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-bold">Rp 49.000</span>
                  <span className="text-gray-500">/bulan</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Catatan unlimited</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>AI Summarizer unlimited</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Pencarian cerdas</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Analytics & insights</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Export ke PDF/Word</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Dukungan prioritas</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Mulai Trial 14 Hari
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-0 shadow-lg relative">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5 text-purple-500" />
                  Enterprise
                </CardTitle>
                <CardDescription className="text-base">Untuk tim dan organisasi</CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Semua fitur Pro</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Multi-user workspace</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>SSO integration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Custom branding</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Dedicated support</span>
                  </li>
                </ul>
                <Link href="/contact">
                  <Button className="w-full" variant="outline">
                    Hubungi Sales
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Perbandingan Fitur</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Lihat perbedaan detail antara setiap paket
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-6 font-semibold">Fitur</th>
                    <th className="text-center py-4 px-6 font-semibold">Gratis</th>
                    <th className="text-center py-4 px-6 font-semibold">Pro</th>
                    <th className="text-center py-4 px-6 font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-4 px-6 font-medium">Jumlah Catatan</td>
                    <td className="text-center py-4 px-6">10</td>
                    <td className="text-center py-4 px-6">Unlimited</td>
                    <td className="text-center py-4 px-6">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">AI Summarizer</td>
                    <td className="text-center py-4 px-6">5x/bulan</td>
                    <td className="text-center py-4 px-6">Unlimited</td>
                    <td className="text-center py-4 px-6">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">Pencarian</td>
                    <td className="text-center py-4 px-6">Dasar</td>
                    <td className="text-center py-4 px-6">Cerdas</td>
                    <td className="text-center py-4 px-6">Cerdas</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">Analytics</td>
                    <td className="text-center py-4 px-6">-</td>
                    <td className="text-center py-4 px-6">✓</td>
                    <td className="text-center py-4 px-6">✓</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">Export</td>
                    <td className="text-center py-4 px-6">-</td>
                    <td className="text-center py-4 px-6">PDF, Word</td>
                    <td className="text-center py-4 px-6">PDF, Word, API</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">Multi-user</td>
                    <td className="text-center py-4 px-6">-</td>
                    <td className="text-center py-4 px-6">-</td>
                    <td className="text-center py-4 px-6">✓</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">SSO</td>
                    <td className="text-center py-4 px-6">-</td>
                    <td className="text-center py-4 px-6">-</td>
                    <td className="text-center py-4 px-6">✓</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">Dukungan</td>
                    <td className="text-center py-4 px-6">Email</td>
                    <td className="text-center py-4 px-6">Prioritas</td>
                    <td className="text-center py-4 px-6">Dedicated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan umum tentang pricing StudyHub
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Apakah ada trial gratis?</h3>
                <p className="text-gray-600">
                  Ya! Paket Pro menawarkan trial gratis selama 14 hari tanpa perlu kartu kredit. Anda bisa mencoba semua fitur premium tanpa komitmen.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Bisakah saya upgrade atau downgrade kapan saja?</h3>
                <p className="text-gray-600">
                  Tentu! Anda bisa mengubah paket kapan saja. Upgrade akan langsung aktif, sedangkan downgrade akan berlaku pada periode billing berikutnya.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Bagaimana cara pembayaran?</h3>
                <p className="text-gray-600">
                  Kami menerima pembayaran melalui kartu kredit, transfer bank, dan e-wallet populer seperti GoPay, OVO, dan DANA. Semua transaksi aman dan terenkripsi.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Apakah data saya aman?</h3>
                <p className="text-gray-600">
                  Ya, keamanan data adalah prioritas utama kami. Semua data dienkripsi end-to-end dan kami mengikuti standar keamanan internasional seperti GDPR dan ISO 27001.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Bagaimana jika saya tidak puas?</h3>
                <p className="text-gray-600">
                  Kami menawarkan garansi uang kembali 30 hari. Jika Anda tidak puas dengan layanan kami, kami akan mengembalikan uang Anda tanpa pertanyaan.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
              <h2 className="text-4xl font-bold mb-6">
                Siap Memulai Perjalanan Belajar Anda?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Bergabunglah dengan ribuan siswa yang sudah merasakan manfaat StudyHub
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                    Mulai Gratis Sekarang
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-gray-900">
                    Hubungi Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
