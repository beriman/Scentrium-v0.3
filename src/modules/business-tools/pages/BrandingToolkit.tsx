import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Copy,
  Palette,
  Image,
  Layout,
  FileText,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

export default function BrandingToolkit() {
  const [activeTab, setActiveTab] = useState("brand-identity");
  const [primaryColor, setPrimaryColor] = useState("#8b5cf6"); // Purple
  const [secondaryColor, setSecondaryColor] = useState("#4f46e5"); // Indigo
  const [accentColor, setAccentColor] = useState("#ec4899"); // Pink
  const [brandName, setBrandName] = useState("Scentrium");
  const [tagline, setTagline] = useState("Discover Your Signature Scent");
  const [brandDescription, setBrandDescription] = useState(
    "Premium artisanal perfumes crafted with the finest ingredients. Each scent tells a unique story and evokes a distinct emotion.",
  );
  const [selectedTemplate, setSelectedTemplate] = useState("instagram-post");

  // Brand voice examples
  const brandVoiceExamples = [
    {
      title: "Product Description",
      content: `${brandName} Vanilla Musk is a luxurious blend of Madagascar vanilla and exotic musk, creating a warm, inviting scent that lingers throughout the day. Perfect for evening occasions or intimate gatherings, this fragrance embodies sophistication and subtle elegance.`,
    },
    {
      title: "Email Welcome",
      content: `Welcome to the ${brandName} family! We're thrilled you've chosen to explore our world of artisanal scents. Your journey into premium fragrances begins now, and we can't wait to help you discover your signature scent that tells your unique story.`,
    },
    {
      title: "Social Media Post",
      content: `✨ New Arrival Alert! ✨ Introducing our latest creation: Citrus Bloom. A refreshing burst of Mediterranean citrus combined with delicate floral notes. Limited quantities available now on our website. #${brandName} #SignatureScent`,
    },
  ];

  // Marketing templates
  const marketingTemplates = [
    {
      id: "instagram-post",
      name: "Instagram Post",
      icon: <Instagram className="h-5 w-5" />,
      dimensions: "1080 x 1080 px",
      description:
        "Square format post ideal for product showcases and announcements",
    },
    {
      id: "facebook-ad",
      name: "Facebook Ad",
      icon: <Facebook className="h-5 w-5" />,
      dimensions: "1200 x 628 px",
      description: "Rectangular format optimized for Facebook feed ads",
    },
    {
      id: "twitter-post",
      name: "Twitter Post",
      icon: <Twitter className="h-5 w-5" />,
      dimensions: "1600 x 900 px",
      description: "Landscape format for Twitter timeline visibility",
    },
    {
      id: "product-label",
      name: "Product Label",
      icon: <Layout className="h-5 w-5" />,
      dimensions: "3.5 x 2 inches",
      description: "Standard perfume bottle label with branding elements",
    },
    {
      id: "business-card",
      name: "Business Card",
      icon: <FileText className="h-5 w-5" />,
      dimensions: "3.5 x 2 inches",
      description: "Professional business card with contact information",
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You would add a toast notification here in a real app
    alert("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Branding Toolkit</h1>
        <p className="text-gray-500">
          Manage your brand identity and create consistent marketing materials
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="brand-identity">Brand Identity</TabsTrigger>
          <TabsTrigger value="brand-voice">Brand Voice</TabsTrigger>
          <TabsTrigger value="marketing-templates">
            Marketing Templates
          </TabsTrigger>
        </TabsList>

        {/* Brand Identity Tab */}
        <TabsContent value="brand-identity" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Brand Information</CardTitle>
                <CardDescription>
                  Define your brand's core identity elements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input
                    id="brand-name"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand-description">Brand Description</Label>
                  <Textarea
                    id="brand-description"
                    rows={4}
                    value={brandDescription}
                    onChange={(e) => setBrandDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Brand Colors</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Primary</p>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-md border"
                          style={{ backgroundColor: primaryColor }}
                        ></div>
                        <Input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-12 h-8 p-0 border-0"
                        />
                        <Input
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-20 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Secondary</p>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-md border"
                          style={{ backgroundColor: secondaryColor }}
                        ></div>
                        <Input
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-12 h-8 p-0 border-0"
                        />
                        <Input
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-20 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Accent</p>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-md border"
                          style={{ backgroundColor: accentColor }}
                        ></div>
                        <Input
                          type="color"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-12 h-8 p-0 border-0"
                        />
                        <Input
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-20 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Brand Preview</CardTitle>
                <CardDescription>
                  See how your brand elements work together
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: primaryColor + "10" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {brandName.charAt(0)}
                    </div>
                    <div>
                      <h3
                        className="text-xl font-bold"
                        style={{ color: primaryColor }}
                      >
                        {brandName}
                      </h3>
                      <p className="text-sm">{tagline}</p>
                    </div>
                  </div>

                  <p className="text-sm mb-4">{brandDescription}</p>

                  <div className="flex gap-2">
                    <Button
                      style={{
                        backgroundColor: primaryColor,
                        borderColor: primaryColor,
                      }}
                      className="text-white hover:opacity-90"
                    >
                      Shop Now
                    </Button>
                    <Button
                      variant="outline"
                      style={{
                        borderColor: secondaryColor,
                        color: secondaryColor,
                      }}
                      className="hover:opacity-90"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Color Palette</h3>
                  <div className="flex gap-2">
                    <div
                      className="w-full h-8 rounded-md"
                      style={{ backgroundColor: primaryColor }}
                    ></div>
                    <div
                      className="w-full h-8 rounded-md"
                      style={{ backgroundColor: secondaryColor }}
                    ></div>
                    <div
                      className="w-full h-8 rounded-md"
                      style={{ backgroundColor: accentColor }}
                    ></div>
                  </div>
                  <div className="flex gap-2">
                    <div
                      className="w-full h-8 rounded-md"
                      style={{ backgroundColor: primaryColor + "80" }}
                    ></div>
                    <div
                      className="w-full h-8 rounded-md"
                      style={{ backgroundColor: secondaryColor + "80" }}
                    ></div>
                    <div
                      className="w-full h-8 rounded-md"
                      style={{ backgroundColor: accentColor + "80" }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" /> Export Brand Kit
                  </Button>
                  <Button className="gap-2 bg-purple-700 hover:bg-purple-800">
                    <Palette className="h-4 w-4" /> Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Brand Voice Tab */}
        <TabsContent value="brand-voice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Voice Guidelines</CardTitle>
              <CardDescription>
                Maintain a consistent tone and messaging across all channels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Tone & Style</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">
                        Personality
                      </h4>
                      <p className="text-sm text-gray-600">
                        Sophisticated, knowledgeable, and passionate about
                        fragrance. Approachable yet premium.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">
                        Voice Characteristics
                      </h4>
                      <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                        <li>Warm and inviting</li>
                        <li>Expert but not pretentious</li>
                        <li>Sensory and descriptive</li>
                        <li>Authentic and transparent</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">
                        Avoid
                      </h4>
                      <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                        <li>Overly technical jargon</li>
                        <li>Generic descriptions</li>
                        <li>Pushy sales language</li>
                        <li>Exaggerated claims</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Key Messages</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">
                        Brand Promise
                      </h4>
                      <p className="text-sm text-gray-600">
                        We create artisanal fragrances that tell a story and
                        evoke emotions, helping you discover your signature
                        scent.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">
                        Value Proposition
                      </h4>
                      <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                        <li>Premium quality ingredients</li>
                        <li>Artisanal craftsmanship</li>
                        <li>Unique, memorable scents</li>
                        <li>Sustainable and ethical practices</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">
                        Tagline Usage
                      </h4>
                      <p className="text-sm text-gray-600">
                        Use "{tagline}" in marketing materials, email
                        signatures, and as a sign-off in communications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium mb-4">Voice Examples</h3>
                <div className="space-y-4">
                  {brandVoiceExamples.map((example, index) => (
                    <Card key={index}>
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">
                            {example.title}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => copyToClipboard(example.content)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2">
                        <p className="text-sm text-gray-600">
                          {example.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketing Templates Tab */}
        <TabsContent value="marketing-templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Available Templates</CardTitle>
                  <CardDescription>
                    Select a template to customize with your brand elements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {marketingTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-3 rounded-md cursor-pointer flex items-center gap-3 ${selectedTemplate === template.id ? "bg-purple-50 border border-purple-200" : "hover:bg-gray-50"}`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                          {template.icon}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">
                            {template.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {template.dimensions}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>
                    {
                      marketingTemplates.find((t) => t.id === selectedTemplate)
                        ?.name
                    }{" "}
                    Template
                  </CardTitle>
                  <CardDescription>
                    {
                      marketingTemplates.find((t) => t.id === selectedTemplate)
                        ?.description
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="aspect-square md:aspect-video bg-gray-100 rounded-md flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center p-6">
                      <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        Template Preview
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Customize this template with your brand colors, logo,
                        and messaging
                      </p>
                      <Button className="bg-purple-700 hover:bg-purple-800">
                        Customize Template
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="template-title">Title</Label>
                      <Input
                        id="template-title"
                        placeholder="Enter title"
                        defaultValue={`${brandName} - New Collection`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="template-cta">Call to Action</Label>
                      <Select defaultValue="shop">
                        <SelectTrigger>
                          <SelectValue placeholder="Select CTA" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shop">Shop Now</SelectItem>
                          <SelectItem value="learn">Learn More</SelectItem>
                          <SelectItem value="contact">Contact Us</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="template-description">Description</Label>
                    <Textarea
                      id="template-description"
                      rows={3}
                      placeholder="Enter description"
                      defaultValue={`Discover our new collection of artisanal fragrances. Handcrafted with premium ingredients to help you find your signature scent.`}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" /> Download
                    </Button>
                    <Button className="gap-2 bg-purple-700 hover:bg-purple-800">
                      <Palette className="h-4 w-4" /> Apply Brand Colors
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
