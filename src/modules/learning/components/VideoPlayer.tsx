import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../../../contexts/AuthContext";
import { Play, Pause, Volume2, VolumeX, Maximize, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VideoPlayerProps {
  videoUrl: string;
  lessonId: string;
  isPreview: boolean;
  isEnrolled: boolean;
  thumbnailUrl?: string;
}

export default function VideoPlayer({
  videoUrl,
  lessonId,
  isPreview,
  isEnrolled,
  thumbnailUrl,
}: VideoPlayerProps) {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved progress if user is logged in
  useEffect(() => {
    if (user && (isPreview || isEnrolled)) {
      const loadProgress = async () => {
        try {
          const { data, error } = await supabase
            .from("learning_progress")
            .select("progress_seconds, status")
            .eq("user_id", user.id)
            .eq("lesson_id", lessonId)
            .single();

          if (error && error.code !== "PGRST116") {
            console.error("Error loading progress:", error);
            return;
          }

          if (data && videoRef.current) {
            // Set video current time to saved progress
            videoRef.current.currentTime = data.progress_seconds;
            setCurrentTime(data.progress_seconds);
          }
        } catch (error) {
          console.error("Error loading progress:", error);
        }
      };

      loadProgress();
    }
  }, [user, lessonId, isPreview, isEnrolled]);

  // Save progress periodically
  useEffect(() => {
    if (!user || (!isPreview && !isEnrolled) || !videoRef.current) return;

    const saveProgressInterval = setInterval(async () => {
      if (!videoRef.current) return;

      const currentSeconds = Math.floor(videoRef.current.currentTime);
      const videoDuration = Math.floor(videoRef.current.duration);

      // Only save if we have valid values
      if (isNaN(currentSeconds) || isNaN(videoDuration)) return;

      // Determine if video is completed (watched at least 90%)
      const isCompleted = currentSeconds >= videoDuration * 0.9;
      const status = isCompleted ? "completed" : "in_progress";

      try {
        const { data, error } = await supabase.from("learning_progress").upsert(
          {
            user_id: user.id,
            lesson_id: lessonId,
            progress_seconds: currentSeconds,
            status: status,
            completed_at: isCompleted ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,lesson_id" },
        );

        if (error) {
          console.error("Error saving progress:", error);
        }
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    }, 10000); // Save every 10 seconds

    return () => clearInterval(saveProgressInterval);
  }, [user, lessonId, isPreview, isEnrolled]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration;

    setCurrentTime(current);
    setProgress((current / duration) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;

    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;

    const seekTime = parseFloat(e.target.value);
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // If not preview and not enrolled, show locked state
  if (!isPreview && !isEnrolled) {
    return (
      <div className="relative w-full aspect-video bg-gray-900 rounded-md overflow-hidden">
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt="Video thumbnail"
            className="w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-70">
          <Lock className="h-16 w-16 mb-4 text-purple-400" />
          <h3 className="text-xl font-semibold mb-2">Video Terkunci</h3>
          <p className="text-sm text-gray-300 mb-4 max-w-md text-center">
            Anda perlu membeli akses kursus ini untuk menonton video ini.
          </p>
          <Button className="bg-purple-700 hover:bg-purple-800">
            Beli Akses Kursus
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full aspect-video bg-black rounded-md overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        poster={thumbnailUrl}
        onClick={handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Video Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        {/* Progress bar */}
        <div className="flex items-center mb-2">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
          />
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleMuteToggle}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>

            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleFullscreen}
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview badge */}
      {isPreview && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-purple-600">Preview</Badge>
        </div>
      )}
    </div>
  );
}
