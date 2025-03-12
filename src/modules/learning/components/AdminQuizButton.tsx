import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Edit, Plus } from "lucide-react";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";

interface AdminQuizButtonProps {
  lessonId: string;
  hasQuiz: boolean;
}

export default function AdminQuizButton({
  lessonId,
  hasQuiz,
}: AdminQuizButtonProps) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setIsAdmin(data.role === "admin");
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkAdminStatus();
  }, [user]);

  if (!isAdmin) return null;

  return (
    <Link to={`/learning/admin/lesson/${lessonId}/quiz`}>
      <Button variant="outline" className="gap-2">
        {hasQuiz ? (
          <>
            <Edit className="h-4 w-4" /> Edit Quiz
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" /> Create Quiz
          </>
        )}
      </Button>
    </Link>
  );
}
