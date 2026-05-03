"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, BookOpen, TrendingUp, Clock } from "lucide-react";

const scoreColor = (score) => {
  if (score >= 75) return { text: "text-emerald-500", bg: "bg-emerald-500", label: "Strong Match", ring: "ring-emerald-500/20" };
  if (score >= 50) return { text: "text-amber-500", bg: "bg-amber-500", label: "Moderate Match", ring: "ring-amber-500/20" };
  return { text: "text-rose-500", bg: "bg-rose-500", label: "Weak Match", ring: "ring-rose-500/20" };
};

export function SkillGapResults({ results }) {
  const { text, bg, label, ring } = scoreColor(results.overallMatch);

  return (
    <div className="space-y-6 mt-6">

      {/* Hero Score Card */}
      <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background to-muted/30 p-6 ring-2 ${ring}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Overall Match Score
            </p>
            <div className="flex items-end gap-3">
              <span className={`text-7xl font-black leading-none ${text}`}>
                {results.overallMatch}
              </span>
              <span className="text-2xl text-muted-foreground mb-2">/ 100</span>
            </div>
            <Badge className={`mt-2 ${text} border border-current bg-transparent`}>
              {label}
            </Badge>
          </div>

          {/* Circular Progress */}
          <div className="relative w-24 h-24 shrink-0">
            <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none"
                className="stroke-muted" strokeWidth="2.5" />
              <circle cx="18" cy="18" r="15.9" fill="none"
                className={`${bg.replace("bg-", "stroke-")} transition-all duration-1000`}
                strokeWidth="2.5"
                strokeDasharray={`${results.overallMatch} 100`}
                strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-lg font-black ${text}`}>{results.overallMatch}%</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed border-t pt-4">
          {results.summary}
        </p>
      </div>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-emerald-200 dark:border-emerald-800/50 overflow-hidden">
          <CardHeader className="pb-3 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30">
            <CardTitle className="text-sm flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
              You Already Have ({results.matchingSkills.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-wrap gap-2">
            {results.matchingSkills.map((s) => (
              <Badge key={s} className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-0 font-medium">
                ✓ {s}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card className="border-rose-200 dark:border-rose-800/50 overflow-hidden">
          <CardHeader className="pb-3 bg-rose-50/50 dark:bg-rose-950/20 border-b border-rose-100 dark:border-rose-900/30">
            <CardTitle className="text-sm flex items-center gap-2 text-rose-700 dark:text-rose-400">
              <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
                <XCircle className="h-3 w-3 text-white" />
              </div>
              You Still Need ({results.missingSkills.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-wrap gap-2">
            {results.missingSkills.map((s) => (
              <Badge key={s} className="bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-0 font-medium">
                ✗ {s}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Learning Plan */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3 border-b bg-muted/30">
          <CardTitle className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            Personalised Learning Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {results.learningPlan.map((item, i) => (
            <div key={i}
              className="group relative flex gap-4 p-4 rounded-xl border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all duration-200">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-primary/0 group-hover:bg-primary/50 transition-all" />
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-sm">{item.skill}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Clock className="h-3 w-3" />
                    {item.timeframe}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.how}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: CheckCircle, label: "Skills Match", value: results.matchingSkills.length, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
          { icon: XCircle, label: "Skills Gap", value: results.missingSkills.length, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/30" },
          { icon: TrendingUp, label: "Learning Steps", value: results.learningPlan.length, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4 text-center`}>
            <Icon className={`h-5 w-5 ${color} mx-auto mb-1`} />
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}