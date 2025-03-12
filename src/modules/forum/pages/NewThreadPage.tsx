import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import ThreadEditor from "../components/ThreadEditor";
import CategorySelector from "../components/CategorySelector";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, AlertTriangle } from "lucide-react";

export default function NewThreadPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeToRules, setAgreeToRules] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category || !agreeToRules) {
      return;
    }

    setIsSubmitting(true);

    // In a real app, this would be an API call
    setTimeout(() => {
      console.log("Thread submitted:", { title, content, category });
      setIsSubmitting(false);
      // Redirect to the forum home page or the new thread
      navigate("/forum");
    }, 1000);
  };

  const handleEditorSubmit = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-purple-800 mb-6">
          Buat Thread Baru
        </h2>

        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Search className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700">
            <strong>Cari dulu sebelum posting!</strong> Gunakan fitur pencarian
            untuk memastikan topik serupa belum pernah dibahas agar tidak
            terjadi duplikasi thread.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Thread</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul yang deskriptif"
              className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              required
            />
          </div>

          <CategorySelector
            value={category}
            onValueChange={setCategory}
            label="Kategori"
            placeholder="Pilih kategori"
          />

          <div className="space-y-2">
            <Label htmlFor="content">Konten</Label>
            <ThreadEditor
              onSubmit={handleEditorSubmit}
              initialContent={content}
              placeholder="Tulis diskusi kamu di sini..."
              submitLabel="Simpan Konten"
            />
          </div>

          <div className="flex items-start space-x-2 py-4 border-t border-b border-gray-100">
            <Checkbox
              id="rules"
              checked={agreeToRules}
              onCheckedChange={(checked) => setAgreeToRules(checked as boolean)}
              className="mt-1"
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="rules"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Saya telah membaca dan menyetujui peraturan forum
              </label>
              <p className="text-sm text-gray-500">
                Dengan mencentang kotak ini, Anda menyetujui untuk mematuhi{" "}
                <Link
                  to="/forum/rules"
                  className="text-purple-700 hover:underline"
                  target="_blank"
                >
                  peraturan forum Scentrium
                </Link>
              </p>
            </div>
          </div>

          {!agreeToRules && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700">
                Anda harus menyetujui peraturan forum sebelum dapat membuat
                thread baru
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              className="bg-purple-700 hover:bg-purple-800"
              disabled={
                isSubmitting ||
                !title.trim() ||
                !content.trim() ||
                !category ||
                !agreeToRules
              }
            >
              {isSubmitting ? "Memproses..." : "Buat Thread"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-purple-200 text-purple-700"
              onClick={() => navigate("/forum")}
            >
              Batal
            </Button>
          </div>

          <div className="text-sm text-gray-500 mt-4">
            <p>Tips:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gunakan judul yang jelas dan spesifik</li>
              <li>Pilih kategori yang paling sesuai dengan topik diskusi</li>
              <li>
                Tambahkan detail yang cukup untuk memulai diskusi yang baik
              </li>
              <li>
                Gunakan format teks untuk membuat postingan lebih mudah dibaca
              </li>
              <li>
                Anda bisa menyematkan gambar, video YouTube, Instagram, dan
                TikTok
              </li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
