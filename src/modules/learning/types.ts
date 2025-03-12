export interface Course {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  instructorId: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: number; // in minutes
  lessonCount: number;
  enrolledCount: number;
  rating: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl?: string;
  content: string;
  duration: number; // in minutes
  order: number;
  isPreview: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  authorId: string;
  readTime: number; // in minutes
  tags: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Instructor {
  id: string;
  userId: string;
  bio: string;
  expertise: string[];
  courseCount: number;
  studentCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseProgress {
  id: string;
  userId: string;
  courseId: string;
  completedLessons: string[];
  isCompleted: boolean;
  certificateIssued: boolean;
  startedAt: string;
  completedAt?: string;
}
