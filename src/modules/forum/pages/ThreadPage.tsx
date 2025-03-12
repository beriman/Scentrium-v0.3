import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Flag, Share2, ArrowLeft, Eye } from "lucide-react";
import VoteButtons from "../components/VoteButtons";
import ThreadEditor from "../components/ThreadEditor";
import { FORUM_CATEGORIES } from "../components/CategorySelector";

export default function ThreadPage() {
  const { threadId } = useParams<{ threadId: string }>();
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Mock data for thread
  const thread = {
    id: threadId || "1",
    title: "Parfum musim panas favorit kamu apa?",
    content: `<p>Karena cuaca semakin hangat, saya ingin menyegarkan koleksi parfum saya dengan aroma yang cocok untuk musim panas.</p>
              <p>Saya cenderung menyukai wewangian yang ringan dan segar yang tidak terlalu kuat di cuaca panas. Aroma citrus dan aquatic cocok untuk saya.</p>
              <p>Apa parfum musim panas favorit kamu? Ada rekomendasi untuk seseorang yang menyukai aroma segar dan bersih?</p>
              
              <p>Beberapa yang sudah saya coba:</p>
              <ul>
                <li>Issey Miyake L'Eau d'Issey</li>
                <li>Dolce & Gabbana Light Blue</li>
                <li>Versace Man Eau Fraiche</li>
              </ul>
              
              <p>Saya juga tertarik dengan parfum lokal Indonesia yang cocok untuk cuaca tropis. Ada yang punya rekomendasi?</p>
              
              <p>Terima kasih sebelumnya!</p>`,
    categoryId: "review-parfum",
    author: {
      id: "user1",
      name: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      level: 4,
      posts: 57,
    },
    upvotes: 42,
    downvotes: 3,
    userVote: null,
    createdAt: "2 jam yang lalu",
    views: 156,
    replies: [
      {
        id: "r1",
        content: `<p>Parfum musim panas favorit saya adalah Acqua di Parma Colonia Essenza. Ini adalah cologne citrus klasik yang sempurna untuk cuaca panas.</p>
                  <p>Jika Anda mencari yang lebih terjangkau, saya sarankan Light Blue by Dolce & Gabbana. Daya tahannya bagus untuk aroma musim panas.</p>
                  
                  <p>Untuk parfum lokal Indonesia, coba cek:</p>
                  <ul>
                    <li><strong>Nusae</strong> - Mereka punya beberapa aroma segar yang terinspirasi dari alam Indonesia</li>
                    <li><strong>Sensatia Botanicals</strong> - Parfum mereka berbahan alami dan cocok untuk cuaca tropis</li>
                  </ul>
                  
                  <p>Semoga membantu!</p>`,
        author: {
          id: "user2",
          name: "Alex Kim",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
          level: 6,
          posts: 132,
        },
        upvotes: 18,
        downvotes: 1,
        userVote: "upvote",
        createdAt: "1 jam yang lalu",
      },
      {
        id: "r2",
        content: `<p>Saya suka Jo Malone's Wood Sage & Sea Salt untuk musim panas! Ringan dan berudara dengan kualitas marine yang indah.</p>
                  <p>Pilihan bagus lainnya adalah Byredo Bal d'Afrique - sedikit lebih kompleks tapi tetap cocok untuk cuaca hangat.</p>
                  
                  <p>Untuk parfum lokal, saya rekomendasikan:</p>
                  <ul>
                    <li><strong>Scentology</strong> - Coba varian "Bali Sunrise" mereka, sangat segar!</li>
                    <li><strong>Sejauh Mata Memandang</strong> - Mereka punya koleksi parfum yang terinspirasi dari berbagai daerah di Indonesia</li>
                  </ul>
                  
                  <p>Saya juga suka membuat body mist sendiri dengan mencampurkan essential oil jeruk dan mint dengan air dan sedikit vodka sebagai pengawet. Sangat menyegarkan untuk cuaca panas!</p>`,
        author: {
          id: "user3",
          name: "Maria Garcia",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
          level: 5,
          posts: 89,
        },
        upvotes: 12,
        downvotes: 2,
        userVote: null,
        createdAt: "45 menit yang lalu",
      },
      {
        id: "r3",
        content: `<p>Untuk musim panas di Indonesia yang tropis, saya sangat merekomendasikan:</p>
                  
                  <ol>
                    <li><strong>Calvin Klein CK One</strong> - Klasik dan selalu segar</li>
                    <li><strong>Creed Virgin Island Water</strong> - Mahal tapi worth it, aroma kelapa dan lime yang sempurna</li>
                    <li><strong>Maison Margiela Replica Beach Walk</strong> - Seperti jalan-jalan di pantai</li>
                  </ol>
                  
                  <p>Untuk brand lokal, coba <strong>Scentology</strong> dan <strong>Nusae</strong> seperti yang sudah disebutkan. Saya juga suka <strong>Suavecito</strong> yang punya beberapa pilihan cologne yang terjangkau dan cocok untuk cuaca panas.</p>
                  
                  <p>Cek juga video review saya tentang parfum musim panas:</p>
                  
                  <p>[youtube](dQw4w9WgXcQ)</p>`,
        author: {
          id: "user4",
          name: "Budi Santoso",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
          level: 7,
          posts: 215,
        },
        upvotes: 24,
        downvotes: 0,
        userVote: "upvote",
        createdAt: "30 menit yang lalu",
      },
    ],
  };

  // Find category name from ID
  const category = FORUM_CATEGORIES.find((cat) => cat.id === thread.categoryId);

  const handleSubmitReply = (content: string) => {
    setIsSubmittingReply(true);
    setReplyContent(content);

    // In a real app, this would be an API call
    setTimeout(() => {
      console.log("Reply submitted:", content);
      setIsSubmittingReply(false);
      setReplyContent("");
      // In a real app, you would add the new reply to the thread
    }, 1000);
  };

  const handleVote = (
    type: "upvote" | "downvote",
    threadId?: string,
    replyId?: string,
  ) => {
    console.log(
      `Voted ${type} on ${replyId ? `reply ${replyId}` : `thread ${threadId}`}`,
    );
    // In a real app, this would make an API call to update the vote
  };

  return (
    <div className="space-y-6">
      {/* Back button and thread info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <Link
          to="/forum"
          className="flex items-center text-purple-700 hover:text-purple-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Forum
        </Link>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            {category?.name || "Kategori"}
          </Badge>
          <span className="flex items-center text-sm text-gray-500">
            <Eye className="mr-1 h-4 w-4" /> {thread.views} dilihat
          </span>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-purple-800">{thread.title}</h1>

      {/* Original post */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Author info - mobile view at top */}
            <div className="md:hidden flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={thread.author.avatar}
                    alt={thread.author.name}
                  />
                  <AvatarFallback>{thread.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <Link
                    to={`/profile/${thread.author.id}`}
                    className="font-medium hover:text-purple-700"
                  >
                    {thread.author.name}
                  </Link>
                  <div className="text-xs text-gray-500">
                    Level {thread.author.level} • {thread.author.posts} posts
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500">{thread.createdAt}</span>
            </div>

            {/* Author info - desktop view on left */}
            <div className="hidden md:block w-40 flex-shrink-0">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-16 w-16 mb-2">
                  <AvatarImage
                    src={thread.author.avatar}
                    alt={thread.author.name}
                  />
                  <AvatarFallback>{thread.author.name[0]}</AvatarFallback>
                </Avatar>
                <Link
                  to={`/profile/${thread.author.id}`}
                  className="font-medium hover:text-purple-700"
                >
                  {thread.author.name}
                </Link>
                <div className="text-sm text-purple-700">
                  Level {thread.author.level}
                </div>
                <div className="text-xs text-gray-500">
                  {thread.author.posts} posts
                </div>
                <div className="mt-4">
                  <VoteButtons
                    initialUpvotes={thread.upvotes}
                    initialDownvotes={thread.downvotes}
                    initialUserVote={thread.userVote}
                    threadId={thread.id}
                    onVote={handleVote}
                    vertical={true}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1">
              {/* Post header - desktop */}
              <div className="hidden md:flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">
                  {thread.createdAt}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-purple-700"
                  >
                    <Share2 className="h-4 w-4 mr-1" /> Bagikan
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-purple-700"
                  >
                    <Flag className="h-4 w-4 mr-1" /> Laporkan
                  </Button>
                </div>
              </div>

              {/* Post content */}
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: thread.content }}
              />

              {/* Mobile vote buttons and actions */}
              <div className="md:hidden flex justify-between items-center mt-4 pt-4 border-t">
                <VoteButtons
                  initialUpvotes={thread.upvotes}
                  initialDownvotes={thread.downvotes}
                  initialUserVote={thread.userVote}
                  threadId={thread.id}
                  onVote={handleVote}
                  vertical={false}
                />
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-purple-700 p-2"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-purple-700 p-2"
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replies section */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          Balasan ({thread.replies.length})
        </h3>
        <Button variant="outline" className="border-purple-200 text-purple-700">
          Terbaru Dulu
        </Button>
      </div>

      <Separator />

      {/* Replies */}
      <div className="space-y-6">
        {thread.replies.map((reply) => (
          <Card key={reply.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Author info - mobile view at top */}
                <div className="md:hidden flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={reply.author.avatar}
                        alt={reply.author.name}
                      />
                      <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link
                        to={`/profile/${reply.author.id}`}
                        className="font-medium hover:text-purple-700"
                      >
                        {reply.author.name}
                      </Link>
                      <div className="text-xs text-gray-500">
                        Level {reply.author.level} • {reply.author.posts} posts
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {reply.createdAt}
                  </span>
                </div>

                {/* Author info - desktop view on left */}
                <div className="hidden md:block w-40 flex-shrink-0">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-16 w-16 mb-2">
                      <AvatarImage
                        src={reply.author.avatar}
                        alt={reply.author.name}
                      />
                      <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <Link
                      to={`/profile/${reply.author.id}`}
                      className="font-medium hover:text-purple-700"
                    >
                      {reply.author.name}
                    </Link>
                    <div className="text-sm text-purple-700">
                      Level {reply.author.level}
                    </div>
                    <div className="text-xs text-gray-500">
                      {reply.author.posts} posts
                    </div>
                    <div className="mt-4">
                      <VoteButtons
                        initialUpvotes={reply.upvotes}
                        initialDownvotes={reply.downvotes}
                        initialUserVote={reply.userVote}
                        threadId={thread.id}
                        replyId={reply.id}
                        onVote={handleVote}
                        vertical={true}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  {/* Reply header - desktop */}
                  <div className="hidden md:flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">
                      {reply.createdAt}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-purple-700"
                      >
                        <Share2 className="h-4 w-4 mr-1" /> Bagikan
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-purple-700"
                      >
                        <Flag className="h-4 w-4 mr-1" /> Laporkan
                      </Button>
                    </div>
                  </div>

                  {/* Reply content */}
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: reply.content }}
                  />

                  {/* Mobile vote buttons and actions */}
                  <div className="md:hidden flex justify-between items-center mt-4 pt-4 border-t">
                    <VoteButtons
                      initialUpvotes={reply.upvotes}
                      initialDownvotes={reply.downvotes}
                      initialUserVote={reply.userVote}
                      threadId={thread.id}
                      replyId={reply.id}
                      onVote={handleVote}
                      vertical={false}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-purple-700"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" /> Kutip
                      </Button>
                    </div>
                  </div>

                  {/* Desktop quote button */}
                  <div className="hidden md:flex mt-4 items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-purple-700"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" /> Kutip
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reply form */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Tulis Balasan</h3>
          <ThreadEditor
            onSubmit={handleSubmitReply}
            placeholder="Tulis balasan kamu di sini..."
            submitLabel={isSubmittingReply ? "Memproses..." : "Kirim Balasan"}
          />
        </CardContent>
      </Card>
    </div>
  );
}
