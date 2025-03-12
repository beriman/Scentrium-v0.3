import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  delay?: number;
}

export default function FeatureCard({
  title,
  description,
  icon,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
        <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-purple-100 rounded-lg">{icon}</div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
