"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const ActiveExamContext = createContext(null);

const ACTIVE_EXAM_STORAGE_KEY = "drnote-active-exam";

export function ActiveExamProvider({ children, exams = [] }) {
  const pathname = usePathname();

  // Extract exam slug from URL if on an exam page
  const getExamSlugFromPath = () => {
    if (pathname?.startsWith("/exams/")) {
      const parts = pathname.split("/");
      if (parts.length >= 3 && parts[2]) {
        return parts[2]; // Returns the exam slug from /exams/[slug]/...
      }
    }
    return null;
  };

  const [activeExam, setActiveExam] = useState(() => {
    if (typeof window === "undefined") {
      return exams[0] || { name: "DrNote", slug: "" };
    }

    // First check URL for exam slug
    const urlSlug = getExamSlugFromPath();
    if (urlSlug) {
      const foundExam = exams.find((exam) => exam.slug === urlSlug);
      if (foundExam) {
        return foundExam;
      }
    }

    // Fall back to localStorage
    const storedExamId = localStorage.getItem(ACTIVE_EXAM_STORAGE_KEY);
    if (storedExamId) {
      const foundExam = exams.find((exam) => exam.id === storedExamId || exam.slug === storedExamId);
      if (foundExam) {
        return foundExam;
      }
    }

    return exams[0] || { name: "DrNote", slug: "" };
  });

  // Update active exam when URL changes
  useEffect(() => {
    const urlSlug = getExamSlugFromPath();
    if (urlSlug && exams.length > 0) {
      const foundExam = exams.find((exam) => exam.slug === urlSlug);
      if (foundExam && foundExam.slug !== activeExam?.slug) {
        setActiveExam(foundExam);
        if (foundExam.id) {
          localStorage.setItem(ACTIVE_EXAM_STORAGE_KEY, foundExam.id);
        } else if (foundExam.slug) {
          localStorage.setItem(ACTIVE_EXAM_STORAGE_KEY, foundExam.slug);
        }
      }
    }
  }, [pathname, exams]);

  // Update when exams list changes
  useEffect(() => {
    if (exams.length > 0 && !activeExam?.slug) {
      const storedExamId = localStorage.getItem(ACTIVE_EXAM_STORAGE_KEY);
      if (storedExamId) {
        const foundExam = exams.find((exam) => exam.id === storedExamId || exam.slug === storedExamId);
        if (foundExam) {
          setActiveExam(foundExam);
          return;
        }
      }
      setActiveExam(exams[0]);
    }
  }, [exams]);

  const updateActiveExam = (exam) => {
    setActiveExam(exam);
    if (exam.id) {
      localStorage.setItem(ACTIVE_EXAM_STORAGE_KEY, exam.id);
    } else if (exam.slug) {
      localStorage.setItem(ACTIVE_EXAM_STORAGE_KEY, exam.slug);
    }
  };

  return (
    <ActiveExamContext.Provider value={{ activeExam, updateActiveExam }}>
      {children}
    </ActiveExamContext.Provider>
  );
}

export function useActiveExam() {
  const context = useContext(ActiveExamContext);
  if (!context) {
    // Return default if context not available
    return { activeExam: { name: "DrNote", slug: "" }, updateActiveExam: () => {} };
  }
  return context;
}
