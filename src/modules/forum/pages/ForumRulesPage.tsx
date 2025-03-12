import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  Flag,
  MessageSquareWarning,
  Search,
  ShieldAlert,
  ThumbsDown,
  Trash2,
} from "lucide-react";

export default function ForumRulesPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Link
          to="/forum"
          className="flex items-center text-purple-700 hover:text-purple-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Forum
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">
          Peraturan Forum Scentrium
        </h1>
        <p className="text-gray-600">
          Panduan untuk menjaga forum tetap positif, informatif, dan bermanfaat
          bagi komunitas parfum Indonesia
        </p>
      </div>

      <Alert className="mb-8 bg-purple-50 border-purple-200">
        <Search className="h-4 w-4" />
        <AlertTitle>Cari Sebelum Posting</AlertTitle>
        <AlertDescription>
          Sebelum membuat thread baru, gunakan fitur pencarian untuk memastikan
          topik serupa belum pernah dibahas. Hal ini membantu menghindari
          duplikasi dan menjaga forum tetap terorganisir.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-red-700">
              <Ban className="mr-2 h-5 w-5" /> Dilarang Keras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Trash2 className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
                <span>Spam dan konten promosi berlebihan</span>
              </li>
              <li className="flex items-start">
                <MessageSquareWarning className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
                <span>Ujaran kebencian, SARA, dan diskriminasi</span>
              </li>
              <li className="flex items-start">
                <ShieldAlert className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
                <span>Konten ilegal dan melanggar hukum</span>
              </li>
              <li className="flex items-start">
                <ThumbsDown className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
                <span>Pelecehan dan intimidasi terhadap pengguna lain</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
                <span>Konten dewasa dan tidak pantas</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-yellow-700">
              <AlertTriangle className="mr-2 h-5 w-5" /> Konsekuensi Pelanggaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <div className="min-w-5 h-5 rounded-full bg-yellow-200 text-yellow-800 flex items-center justify-center text-xs mr-2">
                  1
                </div>
                <span>
                  <strong>Peringatan Pertama:</strong> Notifikasi peringatan dan
                  penghapusan konten
                </span>
              </li>
              <li className="flex items-start">
                <div className="min-w-5 h-5 rounded-full bg-yellow-300 text-yellow-800 flex items-center justify-center text-xs mr-2">
                  2
                </div>
                <span>
                  <strong>Peringatan Kedua:</strong> Pengurangan 15 EXP dan
                  pembatasan posting selama 24 jam
                </span>
              </li>
              <li className="flex items-start">
                <div className="min-w-5 h-5 rounded-full bg-yellow-500 text-yellow-800 flex items-center justify-center text-xs mr-2">
                  3
                </div>
                <span>
                  <strong>Peringatan Ketiga:</strong> Pengurangan 50 EXP dan
                  pembatasan posting selama 7 hari
                </span>
              </li>
              <li className="flex items-start">
                <div className="min-w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs mr-2">
                  4
                </div>
                <span>
                  <strong>Pelanggaran Berat:</strong> Ban permanen dari forum
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-blue-700">
              <Flag className="mr-2 h-5 w-5" /> Prosedur Pelaporan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <div className="min-w-5 h-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-xs mr-2">
                  1
                </div>
                <span>
                  Klik tombol "Laporkan" pada thread atau komentar yang
                  melanggar
                </span>
              </li>
              <li className="flex items-start">
                <div className="min-w-5 h-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-xs mr-2">
                  2
                </div>
                <span>Pilih kategori pelanggaran yang sesuai</span>
              </li>
              <li className="flex items-start">
                <div className="min-w-5 h-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-xs mr-2">
                  3
                </div>
                <span>
                  Berikan deskripsi singkat mengapa konten tersebut melanggar
                  aturan
                </span>
              </li>
              <li className="flex items-start">
                <div className="min-w-5 h-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-xs mr-2">
                  4
                </div>
                <span>
                  Laporan akan ditinjau oleh moderator dalam waktu 24 jam
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Panduan Umum Forum</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">1. Hormati Sesama Anggota</h3>
            <p className="text-sm text-gray-600">
              Bersikap sopan dan hormati pendapat orang lain meskipun berbeda
              dengan pendapat Anda. Kritik boleh diberikan, tetapi harus
              konstruktif dan tidak menyerang pribadi.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">2. Kualitas Konten</h3>
            <p className="text-sm text-gray-600">
              Usahakan membuat thread dengan konten berkualitas. Berikan
              informasi yang jelas, lengkap, dan bermanfaat. Gunakan judul yang
              deskriptif dan sesuai dengan isi thread.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">3. Kategorisasi yang Tepat</h3>
            <p className="text-sm text-gray-600">
              Pastikan thread yang Anda buat berada di kategori yang sesuai.
              Thread yang salah kategori dapat dipindahkan oleh moderator.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">4. Hindari Duplikasi</h3>
            <p className="text-sm text-gray-600">
              Sebelum membuat thread baru, gunakan fitur pencarian untuk
              memastikan topik serupa belum pernah dibahas. Thread duplikat
              dapat digabungkan atau dihapus.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">5. Hak Cipta dan Atribusi</h3>
            <p className="text-sm text-gray-600">
              Jika Anda menggunakan konten dari sumber lain, berikan kredit dan
              sumber yang jelas. Hindari menyalin konten secara utuh tanpa izin.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Tambahan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Perubahan Peraturan</h3>
            <p className="text-sm text-gray-600">
              Peraturan forum dapat berubah sewaktu-waktu. Perubahan akan
              diumumkan melalui pengumuman resmi di forum. Pengguna bertanggung
              jawab untuk mengikuti perkembangan peraturan terbaru.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Kontak Moderator</h3>
            <p className="text-sm text-gray-600">
              Jika Anda memiliki pertanyaan atau kekhawatiran tentang peraturan
              forum, silakan hubungi tim moderator melalui fitur pesan pribadi
              atau email ke{" "}
              <span className="text-purple-700">moderator@scentrium.id</span>
            </p>
          </div>

          <div className="pt-4">
            <p className="text-sm text-gray-600 italic">
              Dengan berpartisipasi di forum Scentrium, Anda menyetujui untuk
              mematuhi semua peraturan yang tercantum di atas. Pelanggaran
              terhadap peraturan ini dapat mengakibatkan tindakan moderasi
              sesuai dengan tingkat pelanggarannya.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-center">
        <Link to="/forum/new">
          <Button className="bg-purple-700 hover:bg-purple-800">
            Kembali ke Pembuatan Thread
          </Button>
        </Link>
      </div>
    </div>
  );
}
