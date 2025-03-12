import React from "react";
import { Toast, ToastDescription, ToastTitle } from "@/components/ui/toast";
import { ArrowUp, Plus } from "lucide-react";

interface ExpGainToastProps {
  expGained: number;
  action: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExpGainToast({
  expGained,
  action,
  open,
  onOpenChange,
}: ExpGainToastProps) {
  return (
    <Toast open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center gap-3">
        <div className="bg-purple-100 p-2 rounded-full">
          <Plus className="h-4 w-4 text-purple-700" />
        </div>
        <div>
          <ToastTitle className="flex items-center gap-1">
            <span className="text-purple-700 font-bold">{expGained} EXP</span>
            <ArrowUp className="h-4 w-4 text-green-500" />
          </ToastTitle>
          <ToastDescription className="text-gray-600">
            {action}
          </ToastDescription>
        </div>
      </div>
    </Toast>
  );
}
