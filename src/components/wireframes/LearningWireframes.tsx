import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const LearningHomeWireframe = () => {
  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-800">
            Learning Platform
          </h1>
          <button className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800">
            My Courses
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

      {/* Featured Course */}
      <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 border-b border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2">
            <div className="text-sm text-purple-700 font-medium mb-2">
              FEATURED COURSE
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Perfumery Fundamentals: Creating Your First Fragrance
            </h2>
            <p className="text-gray-700 mb-4">
              Learn the basics of perfumery from raw materials to finished
              products. Perfect for beginners!
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-purple-200 rounded-full mr-2"></div>
                <span>12 Lessons</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-purple-200 rounded-full mr-2"></div>
                <span>6 Hours</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-purple-200 rounded-full mr-2"></div>
                <span>Beginner</span>
              </div>
            </div>
            <button className="px-6 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800">
              Preview Free Lesson
            </button>
          </div>
          <div className="w-full md:w-1/2">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Course Categories */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold mb-4">Course Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Beginner Perfumery",
            "Advanced Techniques",
            "Natural Perfumery",
            "Business Skills",
          ].map((category) => (
            <div
              key={category}
              className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-full mb-2"></div>
              <div className="font-medium">{category}</div>
              <div className="text-sm text-gray-600 mt-1">4 courses</div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Courses */}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Popular Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((course) => (
            <div
              key={course}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md cursor-pointer"
            >
              <div className="h-40 bg-gray-200"></div>
              <div className="p-4">
                <div className="font-medium">
                  Essential Oil Blending Masterclass
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  By Master Perfumer Jane
                </div>
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className="w-4 h-4 bg-yellow-400 rounded-full mr-1"
                      ></div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-600 ml-1">(42)</div>
                </div>
                <div className="mt-2 font-bold text-purple-800">Rp 750.000</div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    8 lessons • 4 hours
                  </div>
                  <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200">
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CourseDetailWireframe = () => {
  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <span>Learning</span>
          <span>›</span>
          <span>Beginner Perfumery</span>
          <span>›</span>
          <span>Perfumery Fundamentals</span>
        </div>
      </div>

      {/* Course Hero */}
      <div className="relative">
        <div className="h-64 bg-gray-200"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 text-white">
            <h1 className="text-3xl font-bold">
              Perfumery Fundamentals: Creating Your First Fragrance
            </h1>
            <div className="flex items-center mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className="w-4 h-4 bg-yellow-400 rounded-full mr-1"
                  ></div>
                ))}
              </div>
              <div className="ml-2">4.8 (24 reviews)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Course Info */}
          <div className="w-full md:w-2/3">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-purple-200 rounded-full mr-2"></div>
                <span>12 Lessons</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-purple-200 rounded-full mr-2"></div>
                <span>6 Hours</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-purple-200 rounded-full mr-2"></div>
                <span>Beginner</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-purple-200 rounded-full mr-2"></div>
                <span>Certificate</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">About This Course</h2>
              <p className="text-gray-700">
                This comprehensive course will teach you the fundamentals of
                perfumery, from understanding raw materials to creating your
                first fragrance. You'll learn about different fragrance
                families, how to create accords, and the principles of top,
                middle, and base notes.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">What You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Understanding fragrance families",
                  "Creating accords",
                  "Balancing notes",
                  "Proper dilution techniques",
                ].map((item) => (
                  <div key={item} className="flex items-center">
                    <div className="w-5 h-5 bg-green-200 rounded-full mr-2"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">Course Content</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((module) => (
                  <div
                    key={module}
                    className="border border-gray-200 rounded-md overflow-hidden"
                  >
                    <div className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer">
                      <div className="font-medium">
                        Module {module}: Introduction to Perfumery
                      </div>
                      <div className="flex items-center">
                        <div className="text-sm text-gray-600 mr-2">
                          4 lessons • 45 min
                        </div>
                        <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-200">
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((lesson) => (
                          <div
                            key={lesson}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <div className="w-5 h-5 bg-purple-200 rounded-full mr-3"></div>
                              <span>
                                Lesson {lesson}: Understanding Raw Materials
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">12:30</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enrollment Card */}
          <div className="w-full md:w-1/3">
            <div className="border border-gray-200 rounded-lg p-6 sticky top-6">
              <div className="text-3xl font-bold text-purple-800 mb-4">
                Rp 750.000
              </div>
              <button className="w-full px-4 py-3 bg-purple-700 text-white rounded-md hover:bg-purple-800 mb-3">
                Enroll Now
              </button>
              <button className="w-full px-4 py-3 bg-white border border-purple-700 text-purple-700 rounded-md hover:bg-purple-50 mb-6">
                Preview Free Lesson
              </button>

              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-purple-200 rounded-full mr-3"></div>
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-purple-200 rounded-full mr-3"></div>
                  <span>Access on mobile and desktop</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-purple-200 rounded-full mr-3"></div>
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-purple-200 rounded-full mr-3"></div>
                  <span>Starter kit available in marketplace</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center text-sm text-gray-600">
                  Not sure? Try the free preview lesson first
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LearningWireframes() {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-8 p-4 md:p-8 bg-gray-100">
      <Card className="overflow-hidden">
        <CardHeader className="bg-purple-50 pb-2">
          <CardTitle className="text-lg">Learning Platform Home</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6 px-2 md:px-6">
          <LearningHomeWireframe />
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="bg-purple-50 pb-2">
          <CardTitle className="text-lg">Course Detail</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6 px-2 md:px-6">
          <CourseDetailWireframe />
        </CardContent>
      </Card>
    </div>
  );
}
