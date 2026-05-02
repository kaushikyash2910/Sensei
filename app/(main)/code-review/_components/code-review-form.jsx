"use client";

import { useState, useEffect } from "react";
import { reviewCode } from "@/actions/code-review";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Copy, CheckCheck, AlertTriangle, Info, Zap } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "sensei_code_review";

const severityColor = {
  Critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

const severityIcon = {
  Critical: <AlertTriangle className="h-3 w-3" />,
  Warning: <Zap className="h-3 w-3" />,
  Info: <Info className="h-3 w-3" />,
};

export function CodeReviewForm() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");
  const [purpose, setPurpose] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState("split"); // split | original | optimized

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { results: r, code: c, language: l, purpose: p } = JSON.parse(saved);
      setResults(r); setCode(c); setLanguage(l); setPurpose(p);
    }
  }, []);

  useEffect(() => {
    if (results) localStorage.setItem(STORAGE_KEY, JSON.stringify({ results, code, language, purpose }));
  }, [results]);

  const handleReview = async () => {
    if (!code.trim()) { toast.error("Please paste your code."); return; }
    setLoading(true);
    try {
      const data = await reviewCode({ code, language, purpose });
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Review failed.");
    } finally {
      setLoading(false);
    }
  };

  const copyOptimized = () => {
    navigator.clipboard.writeText(results.optimizedCode);
    setCopied(true);
    toast.success("Optimized code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreColor = (s) => s >= 8 ? "text-green-500" : s >= 6 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-1 md:col-span-2">
          <Label>What does this code do? (optional)</Label>
          <Input placeholder="e.g. Binary search implementation, sorting algorithm..."
            value={purpose} onChange={(e) => setPurpose(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Python", "JavaScript", "TypeScript", "Java", "C++", "Go", "Rust"].map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1">
        <Label>Paste Your Code *</Label>
        <Textarea placeholder="Paste your code here..."
          value={code} onChange={(e) => setCode(e.target.value)}
          className="min-h-[250px] font-mono text-sm" />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleReview} disabled={loading} className="flex-1">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Reviewing...</> : "Review & Optimize Code"}
        </Button>
        {results && (
          <Button variant="outline" onClick={() => { setResults(null); localStorage.removeItem(STORAGE_KEY); }}>
            Clear
          </Button>
        )}
      </div>

      {results && (
        <>
          <p className="text-xs text-muted-foreground text-center">
            ✓ Showing your last saved result — click Review to refresh
          </p>
          <div className="space-y-5">
            {/* Quality Score */}
            <Card className="border-primary">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className={`text-5xl font-bold ${scoreColor(results.qualityScore)}`}>
                      {results.qualityScore}<span className="text-xl text-muted-foreground">/10</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{results.summary}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      {Object.entries(results.scoreBreakdown).map(([key, val]) => (
                        <div key={key} className="flex items-center gap-1">
                          <span className="text-muted-foreground capitalize">{key}:</span>
                          <span className={`font-bold ${scoreColor(val)}`}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Complexity Before/After */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">Before</p>
                    <p className="font-mono text-sm font-bold">{results.timeComplexityBefore}</p>
                    <p className="font-mono text-xs text-muted-foreground">{results.spaceComplexityBefore} space</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">After Optimization</p>
                    <p className="font-mono text-sm font-bold text-green-600">{results.timeComplexityAfter}</p>
                    <p className="font-mono text-xs text-muted-foreground">{results.spaceComplexityAfter} space</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Issues */}
            {results.issues?.length > 0 && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">🐛 Issues Found ({results.issues.length})</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {results.issues.map((issue, i) => (
                    <div key={i} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`text-xs flex items-center gap-1 ${severityColor[issue.severity]}`}>
                          {severityIcon[issue.severity]}{issue.severity}
                        </Badge>
                        {issue.line && <span className="text-xs text-muted-foreground">Line {issue.line}</span>}
                      </div>
                      <p className="text-sm font-medium">{issue.issue}</p>
                      <p className="text-xs text-muted-foreground mt-1">💡 {issue.fix}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Side-by-side Code View */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">📊 Before vs After</CardTitle>
                  <div className="flex gap-1">
                    {["split", "original", "optimized"].map((v) => (
                      <button key={v} onClick={() => setView(v)}
                        className={`text-xs px-2 py-1 rounded border transition-all capitalize ${
                          view === v ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground/30"
                        }`}>
                        {v}
                      </button>
                    ))}
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyOptimized}>
                      {copied ? <CheckCheck className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {view === "split" ? (
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-red-500 mb-1">Original</p>
                      <pre className="text-xs bg-red-50 dark:bg-red-950/30 p-3 rounded-lg overflow-auto max-h-[300px] font-mono">
                        {code}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-green-500 mb-1">Optimized</p>
                      <pre className="text-xs bg-green-50 dark:bg-green-950/30 p-3 rounded-lg overflow-auto max-h-[300px] font-mono">
                        {results.optimizedCode}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-[400px] font-mono">
                    {view === "original" ? code : results.optimizedCode}
                  </pre>
                )}
              </CardContent>
            </Card>

            {/* What Changed */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">✅ What Was Improved</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {results.whatChanged.map((c, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span className="text-muted-foreground">{c}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}