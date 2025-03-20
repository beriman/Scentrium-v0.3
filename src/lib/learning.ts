import { supabase } from "./supabase";

// Get all courses
export async function getCourses() {
  try {
    const { data, error } = await supabase
      .from("learning_courses")
      .select("*, instructor:instructor_id(*)")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error getting courses:", error);
    return { data: null, error };
  }
}

// Get course by ID
export async function getCourse(courseId: string) {
  try {
    const { data, error } = await supabase
      .from("learning_courses")
      .select("*, instructor:instructor_id(*)")
      .eq("id", courseId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error getting course:", error);
    return { data: null, error };
  }
}

// Get course modules
export async function getCourseModules(courseId: string) {
  try {
    const { data, error } = await supabase
      .from("learning_modules")
      .select("*")
      .eq("course_id", courseId)
      .order("order_number", { ascending: true });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error getting course modules:", error);
    return { data: null, error };
  }
}

// Get module lessons
export async function getModuleLessons(moduleId: string) {
  try {
    const { data, error } = await supabase
      .from("learning_lessons")
      .select("*")
      .eq("module_id", moduleId)
      .order("order_number", { ascending: true });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error getting module lessons:", error);
    return { data: null, error };
  }
}

// Get lesson by ID
export async function getLesson(lessonId: string) {
  try {
    const { data, error } = await supabase
      .from("learning_lessons")
      .select("*, module:learning_modules(*, course:learning_courses(*))")
      .eq("id", lessonId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error getting lesson:", error);
    return { data: null, error };
  }
}

// Get user enrollments
export async function getUserEnrollments(userId: string) {
  try {
    const { data, error } = await supabase
      .from("learning_enrollments")
      .select("*, course:learning_courses(*)")
      .eq("user_id", userId);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error getting user enrollments:", error);
    return { data: null, error };
  }
}

// Check if user is enrolled in a course
export async function isUserEnrolled(userId: string, courseId: string) {
  try {
    const { data, error } = await supabase
      .from("learning_enrollments")
      .select("id, payment_status")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .maybeSingle();

    if (error) throw error;

    return {
      data: {
        isEnrolled: !!data,
        isPaid: data?.payment_status === "paid",
      },
      error: null,
    };
  } catch (error) {
    console.error("Error checking enrollment:", error);
    return { data: { isEnrolled: false, isPaid: false }, error };
  }
}

// Enroll in a course
export async function enrollInCourse(userId: string, courseId: string) {
  try {
    const { data, error } = await supabase
      .from("learning_enrollments")
      .insert({
        user_id: userId,
        course_id: courseId,
        status: "active",
        payment_status: "unpaid",
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return { data: null, error };
  }
}

// Save lesson progress
export async function saveLessonProgress(
  userId: string,
  lessonId: string,
  progressSeconds: number,
  isCompleted: boolean = false,
) {
  try {
    const { data, error } = await supabase
      .from("learning_progress")
      .upsert(
        {
          user_id: userId,
          lesson_id: lessonId,
          progress_seconds: progressSeconds,
          status: isCompleted ? "completed" : "in_progress",
          completed_at: isCompleted ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" },
      )
      .select();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error saving lesson progress:", error);
    return { data: null, error };
  }
}

// Get user progress for a lesson
export async function getLessonProgress(userId: string, lessonId: string) {
  try {
    const { data, error } = await supabase
      .from("learning_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error getting lesson progress:", error);
    return { data: null, error };
  }
}

// Get user progress for a course
export async function getCourseProgress(userId: string, courseId: string) {
  try {
    // Get all lessons for the course
    const { data: modules } = await getCourseModules(courseId);

    if (!modules)
      return { data: { completedLessons: 0, totalLessons: 0 }, error: null };

    let totalLessons = 0;
    let lessonIds: string[] = [];

    // Get all lesson IDs for the course
    for (const module of modules) {
      const { data: lessons } = await getModuleLessons(module.id);
      if (lessons) {
        totalLessons += lessons.length;
        lessonIds = [...lessonIds, ...lessons.map((lesson) => lesson.id)];
      }
    }

    if (lessonIds.length === 0) {
      return { data: { completedLessons: 0, totalLessons: 0 }, error: null };
    }

    // Get completed lessons
    const { data: progress, error } = await supabase
      .from("learning_progress")
      .select("*")
      .eq("user_id", userId)
      .in("lesson_id", lessonIds)
      .eq("status", "completed");

    if (error) throw error;

    return {
      data: {
        completedLessons: progress?.length || 0,
        totalLessons,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error getting course progress:", error);
    return { data: { completedLessons: 0, totalLessons: 0 }, error };
  }
}

// Get course categories
export async function getCourseCategories() {
  try {
    const { data, error } = await supabase
      .from("learning_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error getting course categories:", error);
    return { data: null, error };
  }
}
