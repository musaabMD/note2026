"use client";

import { cn } from "../lib/utils";

export function MCQOption({
  text,
  isCrossed = false,
  isCorrect = false,
  isIncorrect = false,
  onClick,
  onCrossClick,
  className,
  showCrossButton = true,
}) {
  const handleClick = (e) => {
    // Call onClick to select the choice and show answer
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={cn(
        "flex items-center px-4 py-3 rounded-lg border-2",
        "transition-colors cursor-pointer group",
        !isCorrect && !isIncorrect && "bg-secondary border-border",
        !isCorrect && !isIncorrect && "hover:bg-accent hover:border-muted-foreground/30",
        isCorrect && "bg-green-50 border-green-600",
        isIncorrect && "bg-red-500 border-red-500",
        className
      )}
      onClick={handleClick}
    >
      {/* Option Text */}
      <span
        className={cn(
          "flex-1 text-base font-medium",
          !isCorrect && !isIncorrect && "text-foreground",
          !isCorrect && !isIncorrect && "group-hover:text-foreground",
          isCrossed && "line-through text-muted-foreground",
          isCorrect && "text-green-700 font-semibold",
          isIncorrect && "text-white font-semibold"
        )}
      >
        {text}
      </span>
    </div>
  );
}
