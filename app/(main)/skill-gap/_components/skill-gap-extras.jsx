"use client";

import { useState } from "react";
import {
  analyzeSkillHeatmap, estimateLearningBudget,
  autoJobMatchScore, analyzeSkillTrends,
} from "@/actions/skill-gap";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Flame, Snowflake, TrendingUp, TrendingDown, Minus,
  DollarSign, Clock, Target, BarChart2, Loader2, Plus, Trash2,
} from "lucide-react";
import { toast } from "sonner";

// ── Skill Heatmap ──────────────────────────────────────────────
function SkillHeatmap({ jobDesc }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const demandColor = {
    Hot: "bg-red-500",
    Warm: "bg-orange-400",
    Cold: "bg-blue-400",
  };

  const demandBg = {
    Hot: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50",
    Warm: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800/50",
    Cold: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50",
  };

  const trendIcon = (trend) => {
    if (trend === "Rising") return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (trend === "Declining") return <TrendingDown className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  const handleGenerate = async () => {
    if (!jobDesc?.trim()) { toast.error("Please paste a job description first."); return; }
    setLoading(true);
    try {
      const data = await analyzeSkillHeatmap(jobDesc);
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Failed to generate heatmap.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        See how each of your skills rates in current market demand — Hot, Warm, or Cold.
      </p>
      <Button onClick={handleGenerate} disabled={loading} className="w-full gap-2">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Generating Heatmap...</> : <><Flame className="h-4 w-4" />Generate Skill Heatmap</>}
      </Button>

      {results && (
        <div className="space-y-4">
          {/* Heatmap Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {results.heatmap?.map((item, i) => (
              <div key={i} className={`border rounded-xl p-3 ${demandBg[item.demand] || "bg-muted"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm truncate">{item.skill}</span>
                  <div className="flex items-center gap-1">
                    {trendIcon(item.trend)}
                    <div className={`w-2 h-2 rounded-full ${demandColor[item.demand] || "bg-gray-400"}`} />
                  </div>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-1.5 mb-1">
                  <div className={`${demandColor[item.demand] || "bg-gray-400"} h-1.5 rounded-full`}
                    style={{ width: `${item.demandScore}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${item.demand === "Hot" ? "text-red-500" : item.demand === "Cold" ? "text-blue-500" : "text-orange-500"}`}>
                    {item.demand}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.demandScore}/100</span>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500" /><span>Hot — High demand</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-orange-400" /><span>Warm — Moderate demand</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-400" /><span>Cold — Low demand</span></div>
          </div>

          {results.topMissingHotSkills?.length > 0 && (
            <Card className="border-red-200 dark:border-red-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Flame className="h-4 w-4" />🔥 Hot Skills You're Missing
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {results.topMissingHotSkills.map((s) => (
                  <Badge key={s} className="bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-0">
                    {s}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ── Learning Budget Estimator ──────────────────────────────────
function LearningBudget({ missingSkills }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("free");

  const handleEstimate = async () => {
    if (!missingSkills?.length) { toast.error("Analyze your skill gap first to get missing skills."); return; }
    setLoading(true);
    try {
      const data = await estimateLearningBudget(missingSkills);
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Failed to estimate budget.");
    } finally {
      setLoading(false);
    }
  };

  const difficultyColor = {
    Easy: "text-green-500",
    Medium: "text-yellow-500",
    Hard: "text-red-500",
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Based on your missing skills, get a cost and time estimate for two learning paths — free and paid.
      </p>
      <Button onClick={handleEstimate} disabled={loading} className="w-full gap-2">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Estimating...</> : <><DollarSign className="h-4 w-4" />Estimate Learning Budget</>}
      </Button>

      {results && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setMode("free")}
              className={`border rounded-xl p-4 text-left transition-all ${mode === "free" ? "border-primary ring-1 ring-primary bg-primary/5" : "hover:border-primary/40"}`}>
              <p className="text-xs text-muted-foreground mb-1">Free Path</p>
              <p className="text-2xl font-black text-green-500">₹0</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3" />{results.totalFreeTime}
              </div>
            </button>
            <button onClick={() => setMode("paid")}
              className={`border rounded-xl p-4 text-left transition-all ${mode === "paid" ? "border-primary ring-1 ring-primary bg-primary/5" : "hover:border-primary/40"}`}>
              <p className="text-xs text-muted-foreground mb-1">Paid Path</p>
              <p className="text-2xl font-black text-blue-500">₹{results.totalPaidCost?.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3" />{results.totalPaidTime}
              </div>
            </button>
          </div>

          {/* Skill Breakdown */}
          <div className="space-y-3">
            {results.skills?.map((item, i) => {
              const path = mode === "free" ? item.freePath : item.paidPath;
              return (
                <div key={i} className="border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">{item.skill}</p>
                    <span className={`text-xs font-bold ${difficultyColor[item.difficulty]}`}>{item.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>📚 {path?.resource}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{path?.timeWeeks}w</span>
                      <span className="flex items-center gap-1 font-bold text-foreground">
                        <DollarSign className="h-3 w-3" />
                        {path?.cost === 0 ? "Free" : `₹${path?.cost?.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-4">
              <p className="text-xs font-semibold mb-1">💡 Recommendation</p>
              <p className="text-sm text-muted-foreground">{results.recommendation}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// ── Auto Job Match Score ───────────────────────────────────────
function AutoJobMatch() {
  const [jobs, setJobs] = useState(["", "", ""]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    const filled = jobs.filter((j) => j.trim());
    if (filled.length < 2) { toast.error("Please paste at least 2 job descriptions."); return; }
    setLoading(true);
    try {
      const data = await autoJobMatchScore(filled);
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Failed to rank jobs.");
    } finally {
      setLoading(false);
    }
  };

  const rankColor = (rank) => rank === 1 ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30" : rank === 2 ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30" : "border-muted";
  const recColor = (rec) => {
    if (rec?.includes("Apply now")) return "text-emerald-500";
    if (rec?.includes("Skip")) return "text-red-500";
    return "text-amber-500";
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Paste up to 3 job descriptions — AI ranks which one you're closest to getting.
      </p>

      <div className="space-y-3">
        {jobs.map((jd, i) => (
          <div key={i} className="relative">
            <div className="absolute top-3 left-3 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{i + 1}</span>
            </div>
            <Textarea
              placeholder={`Paste Job ${i + 1} description here...`}
              value={jd}
              onChange={(e) => setJobs((prev) => prev.map((j, idx) => idx === i ? e.target.value : j))}
              className="min-h-[100px] pl-10 text-sm"
            />
          </div>
        ))}
      </div>

      <Button onClick={handleMatch} disabled={loading} className="w-full gap-2">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Ranking...</> : <><Target className="h-4 w-4" />Rank My Best Job Match</>}
      </Button>

      {results && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{results.summary}</p>
          {results.rankings?.map((r, i) => (
            <div key={i} className={`border-2 rounded-xl p-4 ${rankColor(r.rank)}`}>
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-black ${r.rank === 1 ? "text-emerald-500" : r.rank === 2 ? "text-blue-500" : "text-muted-foreground"}`}>
                    #{r.rank}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{r.jobTitle}</p>
                    <p className="text-xs text-muted-foreground">{r.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-black ${r.rank === 1 ? "text-emerald-500" : "text-blue-500"}`}>{r.matchScore}%</p>
                  <p className={`text-xs font-semibold ${recColor(r.applyRecommendation)}`}>{r.applyRecommendation}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{r.verdict}</p>
              <div className="flex flex-wrap gap-1">
                {r.matchingSkills?.slice(0, 4).map((s) => (
                  <Badge key={s} className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-0 text-xs">✓ {s}</Badge>
                ))}
                {r.missingSkills?.slice(0, 2).map((s) => (
                  <Badge key={s} className="bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-0 text-xs">✗ {s}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Skill Trend Tracker ────────────────────────────────────────
function SkillTrends() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const trendConfig = {
    Rising: { icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800/50" },
    Stable: { icon: Minus, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800/50" },
    Declining: { icon: TrendingDown, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/30", border: "border-rose-200 dark:border-rose-800/50" },
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const data = await analyzeSkillTrends();
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Failed to analyze trends.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        See which of your skills are growing in market demand vs declining in 2025.
      </p>
      <Button onClick={handleAnalyze} disabled={loading} className="w-full gap-2">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Analyzing Trends...</> : <><BarChart2 className="h-4 w-4" />Analyze My Skill Trends</>}
      </Button>

      {results && (
        <div className="space-y-4">
          {/* Top/Bottom */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground">🚀 Fastest Growing</p>
              <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-1">{results.topRisingSkill}</p>
            </div>
            <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground">⚠️ Most at Risk</p>
              <p className="font-bold text-rose-600 dark:text-rose-400 mt-1">{results.topDecliningSkill}</p>
            </div>
          </div>

          {/* Skill List */}
          <div className="space-y-2">
            {results.skills?.map((item, i) => {
              const config = trendConfig[item.trend] || trendConfig.Stable;
              const Icon = config.icon;
              return (
                <div key={i} className={`border rounded-xl p-3 ${config.bg} ${config.border}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${config.color} shrink-0`} />
                      <div>
                        <p className="font-semibold text-sm">{item.skill}</p>
                        <p className="text-xs text-muted-foreground">{item.insight}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge className={`${config.color} border border-current bg-transparent text-xs`}>
                        {item.trend}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{item.salaryImpact}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-4">
              <p className="text-xs font-semibold mb-1">📊 Market Advice</p>
              <p className="text-sm text-muted-foreground">{results.marketAdvice}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────
export function SkillGapExtras({ results }) {
  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-bold mb-1">Advanced Analysis</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Deeper insights beyond the basic skill gap analysis.
      </p>
      <Tabs defaultValue="heatmap">
        <TabsList className="w-full flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="heatmap" className="flex-1 text-xs">🔥 Skill Heatmap</TabsTrigger>
          <TabsTrigger value="budget" className="flex-1 text-xs">💰 Learning Budget</TabsTrigger>
          <TabsTrigger value="match" className="flex-1 text-xs">🎯 Job Match</TabsTrigger>
          <TabsTrigger value="trends" className="flex-1 text-xs">📈 Skill Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="heatmap" className="mt-4">
          <SkillHeatmap jobDesc={results?.jobDesc} />
        </TabsContent>
        <TabsContent value="budget" className="mt-4">
          <LearningBudget missingSkills={results?.missingSkills || []} />
        </TabsContent>
        <TabsContent value="match" className="mt-4">
          <AutoJobMatch />
        </TabsContent>
        <TabsContent value="trends" className="mt-4">
          <SkillTrends />
        </TabsContent>
      </Tabs>
    </div>
  );
}