"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Zap, Search, TrendingUp } from "lucide-react";
import { useState } from "react";

const sectionLabels = {
  formatting: "Formatting",
  keywords: "Keywords",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
};

const sectionIcons = {
  formatting: "📐",
  keywords: "🔑",
  experience: "💼",
  education: "🎓",
  skills: "⚡",
};

const scoreGrade = (score) => {
  if (score >= 85)
    return {
      grade: "A",
      label: "Excellent",
      color: "text-emerald-500",
      bg: "bg-emerald-500",
      ring: "ring-emerald-500/20",
    };
  if (score >= 70)
    return {
      grade: "B",
      label: "Good",
      color: "text-blue-500",
      bg: "bg-blue-500",
      ring: "ring-blue-500/20",
    };
  if (score >= 55)
    return {
      grade: "C",
      label: "Average",
      color: "text-amber-500",
      bg: "bg-amber-500",
      ring: "ring-amber-500/20",
    };
  return {
    grade: "D",
    label: "Needs Work",
    color: "text-rose-500",
    bg: "bg-rose-500",
    ring: "ring-rose-500/20",
  };
};

export function ScoreResults({ results }) {
  const [activeSection, setActiveSection] = useState(null);
  const { grade, label, color, bg, ring } = scoreGrade(results.overallScore);

  return (
    <div className="space-y-6 mt-6">
      {/* Hero Score */}
      <div
        className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background to-muted/30 p-6 ring-2 ${ring}`}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              ATS Score
            </p>
            <div className="flex items-end gap-2">
              <span className={`text-8xl font-black leading-none ${color}`}>
                {grade}
              </span>
              <div className="mb-3">
                <span className={`text-4xl font-bold ${color}`}>
                  {results.overallScore}
                </span>
                <span className="text-xl text-muted-foreground">/100</span>
              </div>
            </div>
            <Badge
              className={`${color} border border-current bg-transparent mt-1`}
            >
              {label}
            </Badge>
          </div>
          {/* Circular */}
          <div className="relative w-28 h-28 shrink-0">
            <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                className="stroke-muted"
                strokeWidth="2.5"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                className={`${bg.replace(
                  "bg-",
                  "stroke-"
                )} transition-all duration-1000`}
                strokeWidth="2.5"
                strokeDasharray={`${results.overallScore} 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-xl font-black ${color}`}>
                {results.overallScore}%
              </span>
              <span className="text-xs text-muted-foreground">ATS</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed border-t pt-4">
          {results.summary}
        </p>
      </div>

      {/* Section Breakdown — Interactive */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3 border-b bg-muted/20">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Section Breakdown
            <span className="text-xs text-muted-foreground font-normal ml-1">
              — click a section for details
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {Object.entries(results.sections).map(([key, val]) => {
            const isActive = activeSection === key;
            const sColor =
              val.score >= 80
                ? "bg-emerald-500"
                : val.score >= 60
                ? "bg-amber-500"
                : "bg-rose-500";
            const sText =
              val.score >= 80
                ? "text-emerald-500"
                : val.score >= 60
                ? "text-amber-500"
                : "text-rose-500";
            return (
              <div
                key={key}
                className={`rounded-xl border p-3 cursor-pointer transition-all hover:border-primary/40 ${
                  isActive ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setActiveSection(isActive ? null : key)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>{sectionIcons[key]}</span>
                    <span className="font-medium text-sm">
                      {sectionLabels[key]}
                    </span>
                  </div>
                  <span className={`text-lg font-black ${sText}`}>
                    {val.score}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`${sColor} h-2 rounded-full transition-all duration-700`}
                    style={{ width: `${val.score}%` }}
                  />
                </div>
                {isActive && (
                  <p className="text-xs text-muted-foreground mt-2 pt-2 border-t leading-relaxed">
                    {val.feedback}
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Issues + Quick Wins */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-orange-200 dark:border-orange-800/50 overflow-hidden">
          <CardHeader className="pb-2 bg-orange-50/50 dark:bg-orange-950/20 border-b border-orange-100 dark:border-orange-900/30">
            <CardTitle className="text-sm flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <AlertTriangle className="h-4 w-4" />
              Top Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 space-y-2">
            {results.topIssues.map((issue, i) => (
              <div
                key={i}
                className="flex gap-3 p-2 rounded-lg bg-orange-50/50 dark:bg-orange-950/20"
              >
                <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  {issue}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-emerald-200 dark:border-emerald-800/50 overflow-hidden">
          <CardHeader className="pb-2 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30">
            <CardTitle className="text-sm flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Zap className="h-4 w-4" />
              Quick Wins
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 space-y-2">
            {results.quickWins.map((win, i) => (
              <div
                key={i}
                className="flex gap-3 p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20"
              >
                <span className="text-emerald-500 text-sm shrink-0 font-bold">
                  ✓
                </span>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  {win}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Missing Keywords */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3 border-b bg-rose-50/50 dark:bg-rose-950/20">
          <CardTitle className="text-sm flex items-center gap-2 text-rose-700 dark:text-rose-400">
            <Search className="h-4 w-4" />
            Missing Keywords ({results.missingKeywords.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex flex-wrap gap-2">
          {results.missingKeywords.map((kw) => (
            <Badge
              key={kw}
              className="bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-0 font-medium"
            >
              ✗ {kw}
            </Badge>
          ))}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Issues Found",
            value: results.topIssues.length,
            color: "text-orange-500",
            bg: "bg-orange-50 dark:bg-orange-950/30",
          },
          {
            label: "Quick Wins",
            value: results.quickWins.length,
            color: "text-emerald-500",
            bg: "bg-emerald-50 dark:bg-emerald-950/30",
          },
          {
            label: "Missing Keywords",
            value: results.missingKeywords.length,
            color: "text-rose-500",
            bg: "bg-rose-50 dark:bg-rose-950/30",
          },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4 text-center`}>
            <p className={`text-3xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
