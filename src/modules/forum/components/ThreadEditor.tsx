import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Image,
  Link as LinkIcon,
  Youtube,
  Instagram,
  Video,
} from "lucide-react";

interface ThreadEditorProps {
  onSubmit: (content: string) => void;
  initialContent?: string;
  placeholder?: string;
  submitLabel?: string;
}

export default function ThreadEditor({
  onSubmit,
  initialContent = "",
  placeholder = "Tulis diskusi kamu di sini...",
  submitLabel = "Post",
}: ThreadEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [previewContent, setPreviewContent] = useState("");
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
    }
  };

  const handleTabChange = (value: string) => {
    if (value === "preview") {
      // Process content for preview (convert markdown-like syntax to HTML)
      let processedContent = content;
      // Bold
      processedContent = processedContent.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>",
      );
      // Italic
      processedContent = processedContent.replace(/\*(.*?)\*/g, "<em>$1</em>");
      // Links
      processedContent = processedContent.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-purple-600 hover:underline">$1</a>',
      );
      // Lists
      processedContent = processedContent
        .replace(/^- (.+)$/gm, "<li>$1</li>")
        .replace(
          /(<li>.+<\/li>\n?)+/g,
          '<ul class="list-disc pl-5 my-2">$&</ul>',
        );
      // Numbered lists
      processedContent = processedContent
        .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
        .replace(
          /(<li>.+<\/li>\n?)+/g,
          '<ol class="list-decimal pl-5 my-2">$&</ol>',
        );
      // Paragraphs
      processedContent = processedContent.replace(/(.+?)\n\n/g, "<p>$1</p>");
      // YouTube embeds
      processedContent = processedContent.replace(
        /\[youtube\]\(([^)]+)\)/g,
        '<div class="aspect-video my-4"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>',
      );
      // Instagram embeds
      processedContent = processedContent.replace(
        /\[instagram\]\(([^)]+)\)/g,
        '<div class="my-4"><blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/$1/" data-instgrm-version="14"></blockquote><script async src="//www.instagram.com/embed.js"></script></div>',
      );
      // TikTok embeds
      processedContent = processedContent.replace(
        /\[tiktok\]\(([^)]+)\)/g,
        '<div class="my-4"><blockquote class="tiktok-embed" cite="https://www.tiktok.com/@username/video/$1" data-video-id="$1"></blockquote><script async src="https://www.tiktok.com/embed.js"></script></div>',
      );
      // Images
      processedContent = processedContent.replace(
        /!\[([^\]]+)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" class="max-w-full my-4 rounded-md" />',
      );

      setPreviewContent(processedContent);
    }
    setActiveTab(value as "write" | "preview");
  };

  const insertFormatting = (type: string) => {
    const textarea = document.getElementById("editor") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let newText = "";

    switch (type) {
      case "bold":
        newText = `**${selectedText}**`;
        break;
      case "italic":
        newText = `*${selectedText}*`;
        break;
      case "list":
        newText = `\n- ${selectedText}`;
        break;
      case "ordered-list":
        newText = `\n1. ${selectedText}`;
        break;
      case "link":
        newText = `[${selectedText || "Link text"}](https://example.com)`;
        break;
      case "image":
        newText = `![${selectedText || "Image description"}](https://example.com/image.jpg)`;
        break;
      case "youtube":
        newText = `[youtube](VIDEO_ID)`;
        break;
      case "instagram":
        newText = `[instagram](POST_ID)`;
        break;
      case "tiktok":
        newText = `[tiktok](VIDEO_ID)`;
        break;
      default:
        newText = selectedText;
    }

    const newContent =
      content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);

    // Set focus back to textarea and position cursor after the inserted formatting
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <div className="flex justify-between items-center mb-2">
              <TabsList>
                <TabsTrigger value="write">Tulis</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <div className="flex space-x-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => insertFormatting("bold")}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => insertFormatting("italic")}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => insertFormatting("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => insertFormatting("ordered-list")}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => insertFormatting("link")}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => insertFormatting("image")}
                >
                  <Image className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => insertFormatting("youtube")}
                >
                  <Youtube className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => insertFormatting("instagram")}
                >
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => insertFormatting("tiktok")}
                >
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="write" className="mt-2">
              <textarea
                id="editor"
                className="w-full min-h-[200px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder={placeholder}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </TabsContent>

            <TabsContent value="preview" className="mt-2">
              <div
                className="w-full min-h-[200px] p-3 border rounded-md bg-gray-50 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-4">
            <Button type="submit" className="bg-purple-700 hover:bg-purple-800">
              {submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
