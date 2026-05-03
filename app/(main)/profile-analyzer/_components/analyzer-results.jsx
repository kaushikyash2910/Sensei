"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Star, AlertTriangle, TrendingUp, KeyRound } from "lucide-react";

const scoreGrade = (score) => {
  if (score >= 85) return { grade: "A", color: "text-emerald-500", bg: "bg-emerald-500", label: "Excellent", ring: "ring-emerald-500/20" };
  if (score >= 70) return { grade: "B", color: "text-blue-500", bg: "bg-blue-500", label: "Good", ring: "ring-blue-500/20" };
  if (score >= 55) return { grade: "C", color: "text-amber-500", bg: "bg-amber-500", label: "Average", ring: "ring-amber-500/20" };
  return { grade: "D", color: "text-rose-500", bg: "bg-rose-500", label: "Needs Work", ring: "ring-rose-500/20" };
};

export function AnalyzerResults({ results, profileType }) {
  const { grade, color, bg, label, ring } = scoreGrade(results.overallScore);

  return (
    <div className="space-y-5 mt-6">

      {/* Hero Score */}
      <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background to-muted/20 p-6 ring-2 ${ring}`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              {profileType} Profile Score
            </p>
            <div className="flex items-end gap-2">
              <span className={`text-8xl font-black leading-none ${color}`}>{grade}</span>
              <div className="mb-3">
                <span className={`text-3xl font-bold ${color}`}>{results.overallScore}</span>
                <span className="text-muted-foreground">/100</span>
              </div>
            </div>
            <Badge className={`${color} border border-current bg-transparent mt-1`}>
              {label}
            </Badge>
          </div>

          <div className="flex flex-col items-end gap-2 min-w-[140px]">
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className={`${bg} h-2.5 rounded-full transition-all duration-1000`}
                style={{ width: `${results.overallScore}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{results.overallScore}% optimised</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed border-t border-dashed pt-4">
          {results.summary}
        </p>
      </div>

      {/* Recruiter Tip */}
      <div className="relative rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20 p-5">
        <div className="absolute -top-3 left-4">
          <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            👔 TOP RECRUITER TIP
          </span>
        </div>
        <div className="flex gap-3 mt-2">
          <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">{results.recruiterTip}</p>
        </div>
      </div>

      {/* Strengths */}
      <Card className="border-emerald-200 dark:border-emerald-800/50 overflow-hidden">
        <CardHeader className="pb-3 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30">
          <CardTitle className="text-sm flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <Star className="h-4 w-4" />
            What's Working Well
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-2">
          {results.strengths.map((s, i) => (
            <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">{i + 1}</span>
              </div>
              <span className="text-sm">{s}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Improvements */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3 border-b bg-orange-50/50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/30">
          <CardTitle className="text-sm flex items-center gap-2 text-orange-700 dark:text-orange-400">
            <AlertTriangle className="h-4 w-4" />
            Areas to Improve
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {results.improvements.map((item, i) => (
            <div key={i} className="rounded-xl border bg-card overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-2 bg-muted/30 border-b">
                <div className="w-6 h-6 rounded-md bg-orange-500/10 flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 text-orange-500" />
                </div>
                <p className="font-semibold text-sm">{item.area}</p>
              </div>
              <div className="p-4 space-y-2">
                <p className="text-xs text-muted-foreground">{item.issue}</p>
                <div className="flex gap-2 items-start bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <span className="text-primary text-xs font-bold shrink-0">FIX →</span>
                  <p className="text-xs">{item.fix}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Keywords */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 border-b bg-emerald-50/50 dark:bg-emerald-950/20">
            <CardTitle className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <KeyRound className="h-3 w-3" />
              Keywords Present ({results.keywords.present.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 flex flex-wrap gap-2">
            {results.keywords.present.map((k) => (
              <Badge key={k} className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-0">
                ✓ {k}
              </Badge>
            ))}
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 border-b bg-rose-50/50 dark:bg-rose-950/20">
            <CardTitle className="text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <KeyRound className="h-3 w-3" />
              Keywords Missing ({results.keywords.missing.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 flex flex-wrap gap-2">
            {results.keywords.missing.map((k) => (
              <Badge key={k} className="bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-0">
                ✗ {k}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Strengths", value: results.strengths.length, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
          { label: "To Improve", value: results.improvements.length, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
          { label: "Keywords OK", value: results.keywords.present.length, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
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