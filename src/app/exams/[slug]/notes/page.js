"use client";

import { useState } from "react";
import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { AppLayout } from "../../../../components/app-layout";
import { PageHeader } from "../../../../components/page-header";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import {
  StickyNote,
  Heart,
  Brain,
  Stethoscope,
  Activity,
  Microscope,
  Plus,
  Pin,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { cn } from "../../../../lib/utils";

const subjects = [
  { name: "All", icon: StickyNote },
  { name: "Cardiology", icon: Heart },
  { name: "Neurology", icon: Brain },
  { name: "Internal Medicine", icon: Stethoscope },
  { name: "Emergency Medicine", icon: Activity },
  { name: "Pathology", icon: Microscope },
];

// Sample notes
const sampleNotes = [
  {
    id: "1",
    title: "Cardiology Key Points",
    content: "Important ECG patterns to remember:\n- ST elevation = STEMI\n- ST depression = NSTEMI/Ischemia\n- T wave inversion = Ischemia\n- Q waves = Old MI",
    subject: "Cardiology",
    isPinned: true,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: "2",
    title: "Stroke Types Summary",
    content: "Ischemic (85%): Thrombotic, Embolic\nHemorrhagic (15%): Intracerebral, Subarachnoid\n\nTime is brain - every minute counts!",
    subject: "Neurology",
    isPinned: false,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "3",
    title: "Antibiotic Selection Guide",
    content: "CAP: Azithromycin or Amoxicillin\nUTI: Nitrofurantoin or TMP-SMX\nSkin: Cephalexin or Dicloxacillin\nGI: Metronidazole + Ciprofloxacin",
    subject: "Internal Medicine",
    isPinned: true,
    updatedAt: Date.now() - 172800000,
  },
  {
    id: "4",
    title: "Emergency Vitals Reference",
    content: "Normal ranges:\n- HR: 60-100 bpm\n- BP: <120/80 mmHg\n- RR: 12-20/min\n- SpO2: >94%\n- Temp: 36.5-37.5°C",
    subject: "Emergency Medicine",
    isPinned: false,
    updatedAt: Date.now() - 604800000,
  },
];

function formatDate(timestamp) {
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(timestamp).toLocaleDateString();
}

function NoteCard({ note, onPin, onDelete }) {
  return (
    <Card className={cn(
      "overflow-hidden hover:shadow-md transition-all cursor-pointer",
      note.isPinned && "border-primary/50"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground line-clamp-1">{note.title}</h3>
            {note.isPinned && (
              <Pin className="h-3.5 w-3.5 text-primary fill-primary" />
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => { e.stopPropagation(); onPin(note.id); }}
            >
              <Pin className={cn("h-3.5 w-3.5", note.isPinned && "text-primary fill-primary")} />
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-line mb-3">
          {note.content}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="px-2 py-0.5 rounded bg-muted">{note.subject}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(note.updatedAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ExamNotesPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug || "";
  const exam = useQuery(api.exams.getBySlug, slug ? { slug } : "skip");
  const { user } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [notes, setNotes] = useState(sampleNotes);

  const examName = exam?.name || exam?.abbreviation || slug || "Exam";

  const filteredNotes = notes.filter((n) => {
    const matchesSearch = searchQuery === "" ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "All" || n.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  // Separate pinned and unpinned
  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const unpinnedNotes = filteredNotes.filter(n => !n.isPinned);

  const handlePin = (noteId) => {
    setNotes(prev => prev.map(n =>
      n.id === noteId ? { ...n, isPinned: !n.isPinned } : n
    ));
  };

  const handleDelete = (noteId) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <PageHeader
                title="Notes"
                description={`Your study notes for ${examName}`}
                searchPlaceholder="Search notes..."
                searchValue={searchQuery}
                filterButtons={subjects}
                onSearchChange={setSearchQuery}
                onFilterChange={setSelectedSubject}
                selectedFilter={selectedSubject}
              />
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <StickyNote className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No notes found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create notes to organize your study materials
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {pinnedNotes.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Pin className="h-4 w-4" />
                    Pinned ({pinnedNotes.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pinnedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onPin={handlePin}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              )}

              {unpinnedNotes.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-foreground mb-3">
                    {pinnedNotes.length > 0 ? "Other Notes" : "All Notes"} ({unpinnedNotes.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {unpinnedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onPin={handlePin}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
