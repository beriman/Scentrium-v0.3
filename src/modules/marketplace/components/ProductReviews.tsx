import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../../supabase/supabase";
import { useAuth } from "../../../../supabase/auth";
import { Star, MessageSquare, ThumbsUp, Flag } from "lucide-react";

interface ProductReviewsProps {
  productId: string;
  canReview?: boolean;
}

export default function ProductReviews({
  productId,
  canReview = false,
}: ProductReviewsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("marketplace_reviews")
          .select("*, user:user_id(*)")
          .eq("product_id", productId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setReviews(data || []);

        // Check if current user has already reviewed this product
        if (user) {
          const hasReviewed = data?.some(
            (review) => review.user_id === user.id,
          );
          setUserHasReviewed(hasReviewed || false);
        }
      } catch (error: any) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();

    // Set up real-time subscription for new reviews
    const reviewsSubscription = supabase
      .channel("reviews-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "marketplace_reviews",
          filter: `product_id=eq.${productId}`,
        },
        (payload) => {
          // Fetch the user data for the new review
          const fetchUserForReview = async () => {
            const { data: userData, error: userError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", payload.new.user_id)
              .single();

            if (!userError && userData) {
              setReviews((prevReviews) => [
                { ...payload.new, user: userData },
                ...prevReviews,
              ]);
            }
          };

          fetchUserForReview();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(reviewsSubscription);
    };
  }, [productId, user]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to submit a review",
      });
      return;
    }

    if (!reviewText.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a review",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("marketplace_reviews")
        .insert({
          product_id: productId,
          user_id: user.id,
          rating,
          content: reviewText.trim(),
        });

      if (error) throw error;

      toast({
        title: "Review Submitted",
        description: "Your review has been successfully submitted",
      });

      setReviewText("");
      setRating(5);
      setUserHasReviewed(true);
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to submit review. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-purple-600" /> Product Reviews
        </CardTitle>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${star <= Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="font-medium">
              {averageRating.toFixed(1)} ({reviews.length})
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Write a review section */}
        {canReview && user && !userHasReviewed && (
          <div className="space-y-4">
            <h3 className="font-medium">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Share your experience with this product..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="min-h-[100px]"
              />
              <Button
                type="submit"
                className="bg-purple-700 hover:bg-purple-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
            <Separator />
          </div>
        )}

        {/* Reviews list */}
        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user?.full_name}`}
                        alt={review.user?.full_name}
                      />
                      <AvatarFallback>
                        {review.user?.full_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {review.user?.full_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(review.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.content}</p>
                <div className="flex items-center gap-4 pt-2">
                  <button className="text-xs text-gray-500 flex items-center gap-1 hover:text-gray-700">
                    <ThumbsUp className="h-3 w-3" /> Helpful
                  </button>
                  <button className="text-xs text-gray-500 flex items-center gap-1 hover:text-gray-700">
                    <Flag className="h-3 w-3" /> Report
                  </button>
                </div>
                <Separator className="mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews yet for this product.</p>
            {canReview && user && !userHasReviewed && (
              <p className="text-sm mt-2">
                Be the first to share your experience!
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
