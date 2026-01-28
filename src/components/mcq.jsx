"use client";

import { useState } from "react";
import { MCQOption } from "./mcq-option";
import { cn } from "../lib/utils";
import { Bookmark, Maximize2 } from "lucide-react";

/**
 * MCQ Component - A reusable multiple choice question component
 */
export function MCQ({
  question,
  options = [],
  selectedOptionId = null,
  onOptionSelect,
  onOptionCross,
  crossedOptions = {},
  className,
  paperLabel = "Paper 1A",
  questionId,
  isBookmarked = false,
  onBookmark,
  onExpand,
  onAnswer,
}) {
  const [hasAnswered, setHasAnswered] = useState(false);
  const [clickedOptionId, setClickedOptionId] = useState(null);

  // The 3rd choice (index 2) is the correct answer
  const correctOptionId = options.length >= 3 ? options[2].id : null;

  // Extract number from questionId (remove "q-" prefix if exists)
  const getQuestionNumber = () => {
    if (!questionId) return null;
    const idString = String(questionId);
    // Remove "q-" prefix if it exists and extract number
    const number = idString.replace(/^q-?/i, "");
    return number;
  };

  const handleOptionClick = (optionId) => {
    if (!crossedOptions[optionId]) {
      setClickedOptionId(optionId);
      setHasAnswered(true);
      onOptionSelect?.(optionId);
    }
  };

  const handleCrossClick = (optionId) => {
    onOptionCross?.(optionId, !crossedOptions[optionId]);
  };

  const questionNumber = getQuestionNumber();

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Header with Paper Badge and Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        {/* Paper Badge */}
        {questionNumber && (
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium">
            QID ({questionNumber})
          </div>
        )}

        {!questionNumber && (
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium">
            {paperLabel}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmark?.();
            }}
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center transition-colors border",
              "bg-secondary hover:bg-accent border-border",
              isBookmarked && "bg-accent"
            )}
            aria-label="Bookmark"
          >
            <Bookmark
              className={cn(
                "w-5 h-5",
                isBookmarked
                  ? "fill-foreground text-foreground"
                  : "text-muted-foreground fill-none"
              )}
            />
          </button>

          {/* Expand Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpand?.();
            }}
            className="w-9 h-9 rounded-lg flex items-center justify-center bg-secondary hover:bg-accent transition-colors border border-border"
            aria-label="Expand"
          >
            <Maximize2 className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Answer Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAnswer?.();
            }}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            aria-label="Answer"
          >
            Answer
          </button>
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-lg font-normal text-foreground leading-relaxed">
          {question}
        </h3>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {options.map((option) => {
          const isCorrect = hasAnswered && option.id === correctOptionId;
          const isIncorrect =
            hasAnswered &&
            clickedOptionId === option.id &&
            option.id !== correctOptionId;

          return (
            <MCQOption
              key={option.id}
              text={option.text}
              isCrossed={crossedOptions[option.id] || false}
              isCorrect={isCorrect}
              isIncorrect={isIncorrect}
              onClick={() => handleOptionClick(option.id)}
              onCrossClick={() => handleCrossClick(option.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
