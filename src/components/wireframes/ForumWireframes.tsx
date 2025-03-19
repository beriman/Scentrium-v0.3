import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ForumHomeWireframe = () => {
  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-800">
            Scentrium Forum
          </h1>
          <button className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800">
            New Thread
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
          </div>
          <div className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-md"></div>
        </div>
      </div>

      {/* Categories */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium mb-4">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Diskusi Perfumer",
            "Review Parfum",
            "Inspirasi Parfum",
            "Kolaborasi & Event",
          ].map((category) => (
            <div
              key={category}
              className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-full mb-2"></div>
              <div className="font-medium">{category}</div>
              <div className="text-sm text-gray-600 mt-1">24 threads</div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Threads */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Popular Threads</h2>
          <div className="text-sm text-purple-700">View All</div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((thread) => (
            <div
              key={thread}
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer"
            >
              <div className="flex justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="font-medium">
                      How to create a long-lasting citrus accord?
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Started by @perfumer123 • 2 hours ago
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-600">42</div>
                  <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                </div>
              </div>
              <div className="mt-2 pl-13">
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    <span>24 replies</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    <span>128 views</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ThreadDetailWireframe = () => {
  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-5xl mx-auto">
      {/* Thread Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <span>Forum</span>
          <span>›</span>
          <span>Diskusi Perfumer</span>
        </div>

        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">
            How to create a long-lasting citrus accord?
          </h1>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <div className="font-medium">@perfumer123</div>
            <div className="text-sm text-gray-600">Posted 2 hours ago</div>
          </div>
        </div>
      </div>

      {/* Thread Content */}
      <div className="p-6 border-b border-gray-200">
        <div className="prose max-w-none">
          <p className="text-gray-800">
            I've been trying to create a citrus accord that lasts longer than a
            few hours. I've tried using fixatives like benzoin and ambroxan, but
            I'm still not getting the longevity I want. Any suggestions from
            fellow perfumers?
          </p>

          <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
            <div className="font-medium">My current formula:</div>
            <div className="mt-2 space-y-1 text-sm">
              <div>- Bergamot essential oil: 15%</div>
              <div>- Lemon essential oil: 10%</div>
              <div>- Orange essential oil: 10%</div>
              <div>- Benzoin resinoid: 5%</div>
              <div>- Ambroxan: 2%</div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6 mt-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            <span className="text-gray-600">42</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            <span className="text-gray-600">3</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            <span className="text-gray-600">Share</span>
          </div>
        </div>
      </div>

      {/* Replies */}
      <div className="p-6">
        <h2 className="text-lg font-medium mb-4">Replies (24)</h2>

        <div className="space-y-6">
          {[1, 2].map((reply) => (
            <div key={reply} className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">@scentexpert</div>
                      <div className="text-sm text-gray-600">1 hour ago</div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-gray-800">
                      Have you tried using litsea cubeba? It's a great fixative
                      for citrus notes and adds a nice complexity to the accord.
                    </p>
                  </div>

                  <div className="flex items-center space-x-6 mt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                      <span className="text-gray-600">12</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                      <span className="text-gray-600">1</span>
                    </div>
                    <div className="text-sm text-purple-700">Reply</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        <div className="mt-6">
          <h3 className="text-md font-medium mb-3">Add a reply</h3>
          <div className="border border-gray-300 rounded-md p-2">
            <div className="min-h-[100px] bg-white"></div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
              <div className="flex space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              </div>
              <button className="px-4 py-1 bg-purple-700 text-white rounded-md hover:bg-purple-800">
                Post Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ForumWireframes() {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-8 p-4 md:p-8 bg-gray-100">
      <Card className="overflow-hidden">
        <CardHeader className="bg-purple-50 pb-2">
          <CardTitle className="text-lg">Forum Home</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6 px-2 md:px-6">
          <ForumHomeWireframe />
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="bg-purple-50 pb-2">
          <CardTitle className="text-lg">Thread Detail</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6 px-2 md:px-6">
          <ThreadDetailWireframe />
        </CardContent>
      </Card>
    </div>
  );
}
