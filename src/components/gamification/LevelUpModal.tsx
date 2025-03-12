import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award, Star, ArrowUp } from "lucide-react";
import BadgeDisplay from "./BadgeDisplay";

interface LevelUpModalProps {
  open: boolean;
  onClose: () => void;
  newLevel: number;
  newBadges?: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    earned: boolean;
  }[];
}

export default function LevelUpModal({
  open,
  onClose,
  newLevel,
  newBadges = [],
}: LevelUpModalProps) {
  const getLevelTitle = (level: number) => {
    switch (level) {
      case 1:
        return "Newbie";
      case 2:
        return "Explorer";
      case 3:
        return "Enthusiast";
      case 4:
        return "Expert";
      case 5:
        return "Master Perfumer";
      default:
        return `Level ${level}`;
    }
  };

  const getLevelDescription = (level: number) => {
    switch (level) {
      case 2:
        return "Anda telah mulai menjelajahi dunia parfum dan berpartisipasi dalam komunitas.";
      case 3:
        return "Anda menunjukkan antusiasme yang tinggi dan pengetahuan yang berkembang tentang parfum.";
      case 4:
        return "Anda telah mencapai tingkat keahlian yang tinggi dalam dunia parfum.";
      case 5:
        return "Anda telah mencapai tingkat tertinggi sebagai Master Perfumer dengan pengetahuan mendalam.";
      default:
        return "Selamat atas pencapaian level baru Anda!";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <div className="py-6 px-4 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center justify-center animate-ping opacity-30">
              <Star className="h-24 w-24 text-yellow-400" />
            </div>
            <div className="relative bg-purple-100 rounded-full p-4">
              <Award className="h-16 w-16 text-purple-700" />
            </div>
            <div className="absolute top-0 right-0 bg-yellow-400 text-white rounded-full h-8 w-8 flex items-center justify-center shadow-md">
              <ArrowUp className="h-5 w-5" />
            </div>
          </div>

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-2">
              Level Up!
            </DialogTitle>
          </DialogHeader>

          <div className="mb-6">
            <div className="text-3xl font-bold text-purple-700 mb-1">
              Level {newLevel}: {getLevelTitle(newLevel)}
            </div>
            <p className="text-gray-600">{getLevelDescription(newLevel)}</p>
          </div>

          {newBadges && newBadges.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Lencana Baru:</h3>
              <BadgeDisplay badges={newBadges} showAll={true} />
            </div>
          )}

          <div className="mt-2">
            <Button
              onClick={onClose}
              className="bg-purple-700 hover:bg-purple-800"
            >
              Lanjutkan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
