"use client";

import { useState } from "react";
import { rewriteProfile, simulateRecruiterEye, checkKeywordDensity } from "@/actions/profile-analyzer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Copy, CheckCheck, Eye, Wand2, Search, History } from "lucide-react";
import { toast } from "sonner";

// ── Before/After Profile Rewriter ─────────────────────────────
function ProfileRewriter({ profileType, profileText }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState("split");

  const handleRewrite = async () => {
    if (!profileText?.trim()) { toast.error("Please paste your profile content first."); return; }
    setLoading(true);
    try {
      const data = await rewriteProfile({ profileType, profileText });
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Failed to rewrite profile.");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(results.rewrittenProfile);
    setCopied(true);
    toast.success("Rewritten profile copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        AI rewrites your {profileType} profile to be more compelling and keyword-rich — with a side-by-side before/after view.
      </p>
      <Button onClick={handleRewrite} disabled={loading} className="w-full gap-2">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Rewriting Profile...</> : <><Wand2 className="h-4 w-4" />Rewrite My {profileType} Profile</>}
      </Button>

      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-0">
              ✨ Estimated {results.scoreImprovement} score improvement
            </Badge>
            <div className="flex gap-1">
              {["split", "before", "after"].map((v) => (
                <button key={v} onClick={() => setView(v)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all capitalize ${
                    view === v ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground/30 hover:border-primary"
                  }`}>
                  {v}
                </button>
              ))}
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copy}>
                {copied ? <CheckCheck className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          {view === "split" ? (
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-red-500 mb-1 uppercase tracking-wider">Before</p>
                <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4 min-h-[200px]">
                  <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">{profileText}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-green-500 mb-1 uppercase tracking-wider">After</p>
                <div className="bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50 rounded-xl p-4 min-h-[200px]">
                  <p className="text-xs whitespace-pre-wrap leading-relaxed">{results.rewrittenProfile}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className={`rounded-xl p-4 border ${view === "before" ? "bg-red-50/50 dark:bg-red-950/20 border-red-200" : "bg-green-50/50 dark:bg-green-950/20 border-green-200"}`}>
              <p className="text-xs whitespace-pre-wrap leading-relaxed">
                {view === "before" ? profileText : results.rewrittenProfile}
              </p>
            </div>
          )}

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">✅ What Was Improved</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {results.improvements?.map((imp, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                  <span className="text-muted-foreground">{imp}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <div>
            <p className="text-xs font-semibold mb-2 text-muted-foreground">Keywords Added:</p>
            <div className="flex flex-wrap gap-2">
              {results.keywordsAdded?.map((kw) => (
                <Badge key={kw} className="bg-primary/10 text-primary border-0">+ {kw}</Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Recruiter Eye Simulation ───────────────────────────────────
function RecruiterEye({ profileType, profileText }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const verdictColor = {
    "Strong First Impression": "text-emerald-500",
    "Average": "text-amber-500",
    "Weak First Impression": "text-rose-500",
  };

  const reactionColor = {
    Positive: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    Neutral: "bg-muted text-muted-foreground",
    Negative: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  };

  const handleSimulate = async () => {
    if (!profileText?.trim()) { toast.error("Please paste your profile content first."); return; }
    setLoading(true);
    try {
      const data = await simulateRecruiterEye({ profileType, profileText });
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Simulation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        AI simulates what a recruiter notices in the first 6 seconds of seeing your {profileType} profile.
      </p>
      <Button onClick={handleSimulate} disabled={loading} className="w-full gap-2">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Simulating...</> : <><Eye className="h-4 w-4" />Simulate Recruiter's Eye</>}
      </Button>

      {results && (
        <div className="space-y-4">
          {/* Verdict */}
          <div className="relative rounded-2xl border-2 bg-gradient-to-br from-background to-muted/20 p-6 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">First Impression</p>
            <p className={`text-2xl font-black ${verdictColor[results.overallVerdict] || "text-primary"}`}>
              {results.overallVerdict}
            </p>
            <p className="text-sm text-muted-foreground mt-2 italic">"{results.firstImpression}"</p>
            <div className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
              results.wouldContactYou
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                : "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
            }`}>
              {results.wouldContactYou ? "✅ Would Contact You" : "❌ Would Not Contact"}
            </div>
          </div>

          {/* 6-Second Breakdown */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">⏱ 6-Second Breakdown</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {results.secondsBreakdown?.map((s, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-14 shrink-0">
                    <Badge variant="outline" className="text-xs w-full justify-center">{s.second}</Badge>
                  </div>
                  <div className="flex-1 border rounded-lg p-3">
                    <p className="text-xs font-semibold mb-1">👀 {s.focus}</p>
                    <p className="text-xs text-muted-foreground">{s.reaction}</p>
                  </div>
                  <Badge className={`text-xs shrink-0 ${reactionColor[s.verdict] || ""}`}>{s.verdict}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-4">
              <p className="text-xs font-semibold mb-1">🎯 Top Fix for First Impression</p>
              <p className="text-sm text-muted-foreground">{results.topFixForFirstImpression}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <p className="text-xs font-semibold mb-1">💬 Why They Would/Would Not Contact</p>
              <p className="text-sm text-muted-foreground">{results.wouldContactReason}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// ── Keyword Density Checker ────────────────────────────────────
function KeywordDensity({ profileType, profileText }) {
  const [targetRole, setTargetRole] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const importanceColor = {
    Critical: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    High: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    Medium: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  };

  const rankColor = {
    High: "text-emerald-500",
    Medium: "text-amber-500",
    Low: "text-rose-500",
  };

  const handleCheck = async () => {
    if (!profileText?.trim()) { toast.error("Please paste your profile content first."); return; }
    setLoading(true);
    try {
      const data = await checkKeywordDensity({ profileType, profileText, targetRole });
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Keyword check failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        See which recruiter search terms your {profileType} profile ranks for and which it misses.
      </p>
      <div className="space-y-1">
        <Label>Target Role (optional)</Label>
        <Input placeholder="e.g. Full Stack Engineer, Data Scientist"
          value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
      </div>
      <Button onClick={handleCheck} disabled={loading} className="w-full gap-2">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Checking Keywords...</> : <><Search className="h-4 w-4" />Check Keyword Density</>}
      </Button>

      {results && (
        <div className="space-y-4">
          {/* Score */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Search Rank</p>
              <p className={`text-2xl font-black ${rankColor[results.overallSearchRank]}`}>{results.overallSearchRank}</p>
            </div>
            <div className="border rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Search Score</p>
              <p className={`text-2xl font-black ${results.searchScore >= 70 ? "text-emerald-500" : results.searchScore >= 50 ? "text-amber-500" : "text-rose-500"}`}>
                {results.searchScore}/100
              </p>
            </div>
          </div>

          {/* Missing Critical Keywords */}
          {results.missingCriticalKeywords?.length > 0 && (
            <Card className="border-red-200 dark:border-red-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-red-600 dark:text-red-400">🚨 Missing Critical Keywords</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {results.missingCriticalKeywords.map((kw) => (
                  <Badge key={kw} className="bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-0">✗ {kw}</Badge>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Top Recruiter Search Terms */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">🔍 Top Recruiter Search Terms</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {results.topRecruiterSearchTerms?.map((term) => (
                <Badge key={term} variant="outline" className="text-xs">{term}</Badge>
              ))}
            </CardContent>
          </Card>

          {/* Keyword Table */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">📊 Keyword Analysis</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {results.keywords?.map((item, i) => (
                <div key={i} className="flex items-start gap-3 border rounded-lg p-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-sm">{item.keyword}</span>
                      <Badge className={`text-xs ${importanceColor[item.importance] || ""}`}>{item.importance}</Badge>
                      {item.present ? (
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-0 text-xs">
                          ✓ Present ({item.frequency}x)
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-0 text-xs">✗ Missing</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{item.suggestion}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">💡 Search Tips</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {results.searchTips?.map((tip, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="text-primary font-bold">{i + 1}.</span>
                  <span className="text-muted-foreground">{tip}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// ── Profile Score History ──────────────────────────────────────
function ProfileScoreHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("sensei_profile_score_history");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("sensei_profile_score_history");
    toast.success("Score history cleared.");
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <History className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p className="font-semibold">No score history yet</p>
        <p className="text-sm mt-1">Analyze your profile multiple times to track improvement.</p>
      </div>
    );
  }

  const latest = history[history.length - 1];
  const first = history[0];
  const improvement = latest.score - first.score;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">First Score</p>
            <p className="text-2xl font-black text-muted-foreground">{first.score}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Latest Score</p>
            <p className="text-2xl font-black text-primary">{latest.score}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Improvement</p>
            <p className={`text-2xl font-black ${improvement >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
              {improvement >= 0 ? "+" : ""}{improvement}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={clearHistory} className="text-red-500">Clear</Button>
      </div>

      <div className="space-y-2">
        {history.map((entry, i) => (
          <div key={i} className="flex items-center gap-3 border rounded-lg p-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className={`text-sm font-black ${entry.score >= 80 ? "text-emerald-500" : entry.score >= 60 ? "text-amber-500" : "text-rose-500"}`}>
                {entry.score}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{entry.profileType} Profile</p>
              <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString("en-GB")} at {new Date(entry.date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
            </div>
            {i > 0 && (
              <Badge className={`text-xs ${history[i].score > history[i - 1].score ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"} border-0`}>
                {history[i].score > history[i - 1].score ? "+" : ""}{history[i].score - history[i - 1].score}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────
export function ProfileExtras({ profileType, profileText, currentScore }) {
  // Save score to history whenever it changes
  useState(() => {
    if (currentScore) {
      try {
        const saved = localStorage.getItem("sensei_profile_score_history");
        const history = saved ? JSON.parse(saved) : [];
        history.push({ score: currentScore, profileType, date: new Date().toISOString() });
        localStorage.setItem("sensei_profile_score_history", JSON.stringify(history.slice(-20)));
      } catch {}
    }
  });

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-bold mb-1">Advanced Profile Tools</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Go beyond the score — rewrite, simulate, and optimize your profile.
      </p>
      <Tabs defaultValue="rewrite">
        <TabsList className="w-full flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="rewrite" className="flex-1 text-xs">✍️ Rewrite</TabsTrigger>
          <TabsTrigger value="eye" className="flex-1 text-xs">👁 Recruiter Eye</TabsTrigger>
          <TabsTrigger value="keywords" className="flex-1 text-xs">🔍 Keywords</TabsTrigger>
          <TabsTrigger value="history" className="flex-1 text-xs">📈 Score History</TabsTrigger>
        </TabsList>
        <TabsContent value="rewrite" className="mt-4">
          <ProfileRewriter profileType={profileType} profileText={profileText} />
        </TabsContent>
        <TabsContent value="eye" className="mt-4">
          <RecruiterEye profileType={profileType} profileText={profileText} />
        </TabsContent>
        <TabsContent value="keywords" className="mt-4">
          <KeywordDensity profileType={profileType} profileText={profileText} />
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <ProfileScoreHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}