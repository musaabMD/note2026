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
  GraduationCap,
  Heart,
  Brain,
  Stethoscope,
  Activity,
  Microscope,
  Flame,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  BookOpen,
  Target,
} from "lucide-react";
import { cn } from "../../../../lib/utils";

const subjects = [
  { name: "All", icon: GraduationCap },
  { name: "Cardiology", icon: Heart },
  { name: "Neurology", icon: Brain },
  { name: "Internal Medicine", icon: Stethoscope },
  { name: "Emergency Medicine", icon: Activity },
  { name: "Pathology", icon: Microscope },
];

// Sample high yield topics
const highYieldTopics = [
  {
    id: "1",
    title: "Acute Coronary Syndrome (ACS)",
    description: "Recognition and management of STEMI, NSTEMI, and unstable angina",
    subject: "Cardiology",
    importance: 10,
    frequency: "Very High",
    content: "ACS represents a spectrum of conditions:\n\n• STEMI: ST elevation + positive biomarkers\n• NSTEMI: No ST elevation + positive biomarkers\n• Unstable Angina: No ST elevation + negative biomarkers\n\nKey ECG findings:\n- ST elevation ≥1mm in 2 contiguous leads\n- New LBBB = STEMI equivalent\n- ST depression/T wave inversion in NSTEMI",
    tips: [
      "Door-to-balloon time <90 min for STEMI",
      "Aspirin + P2Y12 inhibitor for all ACS",
      "High-sensitivity troponin for early detection",
    ],
    isPremium: false,
  },
  {
    id: "2",
    title: "Stroke: Time-Critical Management",
    description: "Rapid assessment and treatment of acute stroke",
    subject: "Neurology",
    importance: 10,
    frequency: "Very High",
    content: "FAST screening:\n- Face drooping\n- Arm weakness\n- Speech difficulty\n- Time to call emergency\n\ntPA eligibility:\n• Symptom onset <4.5 hours\n• No contraindications (recent surgery, bleeding, etc.)\n• BP <185/110 before treatment",
    tips: [
      "Last known well time is critical",
      "NIHSS score guides severity",
      "Thrombectomy up to 24h in select patients",
    ],
    isPremium: false,
  },
  {
    id: "3",
    title: "Sepsis and Septic Shock",
    description: "Early recognition and bundle compliance",
    subject: "Internal Medicine",
    importance: 9,
    frequency: "High",
    content: "Sepsis = infection + organ dysfunction\nqSOFA criteria (≥2 suggests sepsis):\n- RR ≥22\n- Altered mental status\n- SBP ≤100\n\nSeptic Shock = Sepsis + vasopressors needed + lactate >2",
    tips: [
      "30 mL/kg crystalloid within 3 hours",
      "Blood cultures before antibiotics if possible",
      "Norepinephrine is first-line vasopressor",
    ],
    isPremium: true,
  },
  {
    id: "4",
    title: "Diabetic Ketoacidosis (DKA)",
    description: "Recognition and management of DKA",
    subject: "Emergency Medicine",
    importance: 9,
    frequency: "High",
    content: "Diagnostic criteria:\n• Blood glucose >250 mg/dL\n• pH <7.3 or HCO3 <18\n• Anion gap >12\n• Positive ketones\n\nManagement priorities:\n1. Fluid resuscitation (NS initially)\n2. Insulin drip (0.1 units/kg/hr)\n3. Potassium replacement\n4. Monitor glucose q1h",
    tips: [
      "Add dextrose when glucose <250",
      "Don't stop insulin until anion gap closes",
      "Watch for cerebral edema in children",
    ],
    isPremium: false,
  },
];

function ImportanceBar({ level }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 w-2 rounded-full",
            i < level ? "bg-orange-500" : "bg-muted"
          )}
        />
      ))}
    </div>
  );
}

function HighYieldCard({ topic }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={cn(
      "overflow-hidden",
      topic.isPremium && "border-yellow-300/50"
    )}>
      <CardContent className="p-0">
        <div
          className="p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <h3 className="font-semibold text-foreground">{topic.title}</h3>
                {topic.isPremium && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700">
                    Premium
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{topic.description}</p>

              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Importance:</span>
                  <ImportanceBar level={topic.importance} />
                </div>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded",
                  topic.frequency === "Very High" && "bg-red-100 text-red-700",
                  topic.frequency === "High" && "bg-orange-100 text-orange-700",
                  topic.frequency === "Medium" && "bg-yellow-100 text-yellow-700"
                )}>
                  {topic.frequency} yield
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  {topic.subject}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="px-4 pb-4 pt-0 border-t border-border/50 bg-muted/30">
            {/* Content */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm text-foreground">Key Points</span>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-line pl-6">
                {topic.content}
              </p>
            </div>

            {/* Tips */}
            {topic.tips && topic.tips.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium text-sm text-foreground">High-Yield Tips</span>
                </div>
                <ul className="space-y-1.5 pl-6">
                  {topic.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Target className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline">
                Related Questions
              </Button>
              <Button size="sm" variant="outline">
                Add to Notes
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ExamHighYieldPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug || "";
  const exam = useQuery(api.exams.getBySlug, slug ? { slug } : "skip");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  const examName = exam?.name || exam?.abbreviation || slug || "Exam";

  const filteredTopics = highYieldTopics.filter((t) => {
    const matchesSearch = searchQuery === "" ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "All" || t.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  }).sort((a, b) => b.importance - a.importance);

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
          <PageHeader
            title="High Yield"
            description={`Must-know topics for ${examName}`}
            searchPlaceholder="Search high yield topics..."
            searchValue={searchQuery}
            filterButtons={subjects}
            onSearchChange={setSearchQuery}
            onFilterChange={setSelectedSubject}
            selectedFilter={selectedSubject}
          />

          {/* Stats */}
          <div className="flex items-center gap-4 mt-6 mb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-orange-500" />
              {filteredTopics.length} high yield topics
            </span>
          </div>

          {filteredTopics.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No high yield topics found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTopics.map((topic) => (
                <HighYieldCard key={topic.id} topic={topic} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
