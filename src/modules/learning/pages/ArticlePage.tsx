import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  BookmarkIcon,
  Share2,
  ThumbsUp,
  MessageSquare,
  Clock,
} from "lucide-react";

export default function ArticlePage() {
  const { articleId } = useParams<{ articleId: string }>();

  // Mock article data
  const article = {
    id: "1",
    title: "Understanding Fragrance Notes: Top, Middle, and Base",
    coverImage:
      "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=1200&q=80",
    content: `
      <p>When you spray a perfume, you're experiencing a carefully orchestrated symphony of scents that unfold over time. This progression is what gives a fragrance its complexity and character. Understanding the structure of perfumes can enhance your appreciation and help you make better choices when selecting fragrances.</p>
      
      <h2>The Three-Tier Structure</h2>
      
      <p>Most fragrances are composed of three distinct layers or "notes" that emerge at different times after application:</p>
      
      <h3>Top Notes (Head Notes)</h3>
      
      <p>Top notes are the initial, lighter scents that you smell immediately after applying a fragrance. They create the crucial first impression but evaporate quickly, typically lasting only 5-15 minutes.</p>
      
      <p>Common top notes include:</p>
      <ul>
        <li>Citrus (bergamot, lemon, orange)</li>
        <li>Light fruits (grapefruit, berries)</li>
        <li>Herbs (basil, lavender, sage)</li>
        <li>Light spices (anise, coriander)</li>
      </ul>
      
      <p>These volatile molecules are small and evaporate quickly, which is why they don't last long on the skin but provide that initial burst of scent.</p>
      
      <h3>Middle Notes (Heart Notes)</h3>
      
      <p>As the top notes fade, the middle notes emerge, usually within 10-30 minutes after application. These form the "heart" of the fragrance and typically last 2-4 hours.</p>
      
      <p>Common middle notes include:</p>
      <ul>
        <li>Floral scents (rose, jasmine, ylang-ylang)</li>
        <li>Fruity notes (apple, peach)</li>
        <li>Spices (cinnamon, cardamom, nutmeg)</li>
        <li>Green notes (grass, leaves)</li>
      </ul>
      
      <p>Middle notes serve as a buffer between the top and base notes, masking the often unpleasant initial scent of the base notes until they have had time to develop.</p>
      
      <h3>Base Notes</h3>
      
      <p>The base notes are the foundation of the fragrance. They emerge once the middle notes dissipate, usually about 30 minutes after application, and can last 6 hours or more.</p>
      
      <p>Common base notes include:</p>
      <ul>
        <li>Woods (sandalwood, cedar, vetiver)</li>
        <li>Amber</li>
        <li>Musk</li>
        <li>Vanilla</li>
        <li>Resins (myrrh, frankincense)</li>
      </ul>
      
      <p>These notes contain large, heavy molecules that evaporate slowly, giving the fragrance its longevity and depth. They often have a rich, deep quality.</p>
      
      <h2>The Perfume Pyramid</h2>
      
      <p>This three-tier structure is often visualized as a pyramid, with the fleeting top notes at the peak, the middle notes in the center, and the long-lasting base notes forming the foundation.</p>
      
      <p>A well-crafted fragrance will have a smooth transition between these layers, creating a harmonious evolution of scent throughout the day. The interplay between these notes is what gives each perfume its unique character and complexity.</p>
      
      <h2>Why This Matters</h2>
      
      <p>Understanding fragrance notes can help you in several ways:</p>
      
      <ul>
        <li><strong>Better purchasing decisions:</strong> Don't judge a fragrance solely on the initial spray (top notes). Give it time to develop on your skin to experience the middle and base notes before making a decision.</li>
        <li><strong>Fragrance longevity:</strong> If you want a scent that lasts all day, pay attention to the base notes, as these will determine how the fragrance smells hours after application.</li>
        <li><strong>Seasonal appropriateness:</strong> Lighter top and middle notes often work better in summer, while richer base notes may be more suitable for winter.</li>
      </ul>
      
      <p>Next time you sample a fragrance, take the time to notice how it evolves over several hours. This deeper understanding will enhance your appreciation of the perfumer's art and help you find fragrances that truly resonate with you.</p>
    `,
    author: {
      name: "James Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      bio: "Fragrance expert and certified perfumer with over 10 years of experience in the industry. James has written extensively about perfume composition and appreciation.",
    },
    publishDate: "May 15, 2023",
    readTime: 8, // minutes
    tags: ["Perfume Basics", "Fragrance Notes", "Perfume Composition"],
    likes: 124,
    comments: 32,
    relatedArticles: [
      {
        id: "2",
        title:
          "The History of Iconic Perfumes: From Chanel No. 5 to Modern Classics",
        image:
          "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80",
      },
      {
        id: "3",
        title: "Seasonal Scents: How to Adjust Your Fragrance Wardrobe",
        image:
          "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=400&q=80",
      },
      {
        id: "4",
        title: "The Art of Layering Fragrances",
        image:
          "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=400&q=80",
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back button */}
      <Link
        to="/learning"
        className="inline-flex items-center text-purple-700 hover:text-purple-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Learning
      </Link>

      {/* Article header */}
      <div>
        <h1 className="text-3xl font-bold text-purple-800 mb-4">
          {article.title}
        </h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src={article.author.avatar}
                alt={article.author.name}
              />
              <AvatarFallback>{article.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{article.author.name}</div>
              <div className="text-sm text-gray-500">{article.publishDate}</div>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Clock className="mr-1 h-4 w-4" />
            <span>{article.readTime} min read</span>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden mb-8">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Article content */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Tags */}
      <div className="flex flex-wrap gap-2 pt-4">
        {article.tags.map((tag, index) => (
          <Link key={index} to={`/learning?tag=${tag}`}>
            <Button variant="outline" size="sm" className="rounded-full">
              {tag}
            </Button>
          </Link>
        ))}
      </div>

      <Separator className="my-8" />

      {/* Author bio */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={article.author.avatar}
                alt={article.author.name}
              />
              <AvatarFallback>{article.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium mb-2">About the Author</h3>
              <p className="text-gray-700">{article.author.bio}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Article actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Button variant="outline" className="flex items-center">
            <ThumbsUp className="mr-2 h-4 w-4" />
            Like ({article.likes})
          </Button>
          <Button variant="outline" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Comment ({article.comments})
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <BookmarkIcon className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Related articles */}
      <div className="pt-8">
        <h2 className="text-2xl font-semibold mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {article.relatedArticles.map((relatedArticle) => (
            <Link
              key={relatedArticle.id}
              to={`/learning/article/${relatedArticle.id}`}
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 overflow-hidden">
                  <img
                    src={relatedArticle.image}
                    alt={relatedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-purple-800 hover:text-purple-600">
                    {relatedArticle.title}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
