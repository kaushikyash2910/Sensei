"use client";

import { useState, useEffect } from "react";
import { identifyPattern } from "@/actions/pattern-helper";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "sensei_pattern_helper";

export function PatternForm() {
  const [problem, setProblem] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { results: r, problem: p } = JSON.parse(saved);
      setResults(r); setProblem(p);
    }
  }, []);

  useEffect(() => {
    if (results) localStorage.setItem(STORAGE_KEY, JSON.stringify({ results, problem }));
  }, [results]);

  const handleIdentify = async () => {
    if (!problem.trim()) { toast.error("Please describe the problem."); return; }
    setLoading(true);
    try {
      const data = await identifyPattern({ problemDescription: problem });
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Failed to identify pattern.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Label>Describe the Problem *</Label>
        <Textarea
          placeholder="e.g. Find the maximum sum of a contiguous subarray of size k..."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className="min-h-[120px]"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleIdentify} disabled={loading} className="flex-1">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Identifying...</> : "Identify DSA Pattern"}
        </Button>
        {results && (
          <Button variant="outline" onClick={() => { setResults(null); localStorage.removeItem(STORAGE_KEY); }}>Clear</Button>
        )}
      </div>

      {results && (
        <>
          <p className="text-xs text-muted-foreground text-center">✓ Showing your last saved result</p>
          <div className="space-y-4">
            <Card className="border-primary">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-2xl font-bold">{results.primaryPattern}</p>
                    <p className="text-sm text-muted-foreground mt-1">{results.patternExplanation}</p>
                  </div>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {results.confidence}% confidence
                  </Badge>
                </div>
                {results.alternativePatterns?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">Also consider:</p>
                    <div className="flex gap-2 flex-wrap">
                      {results.alternativePatterns.map((p) => (
                        <Badge key={p} variant="secondary">{p}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">🔍 When to Use This Pattern</CardTitle></CardHeader>
              <CardContent className="space-y-1">
                {results.whenToUseThisPattern?.map((clue, i) => (
                  <p key={i} className="text-sm text-muted-foreground">• {clue}</p>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">📋 How to Apply</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{results.approach}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">💻 Code Template</CardTitle></CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-3 rounded-lg font-mono overflow-auto">{results.template}</pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">🔗 Similar Problems</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {results.similarProblems?.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{p.difficulty}</Badge>
                    <span className="text-sm">{p.name}</span>
                    <span className="text-xs text-muted-foreground">· {p.platform}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Pattern Library */}
            <Card>
              <CardHeader className="pb-2 cursor-pointer" onClick={() => setShowLibrary(!showLibrary)}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">📚 Full DSA Pattern Library</CardTitle>
                  {showLibrary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </CardHeader>
              {showLibrary && (
                <CardContent className="space-y-3">
                  {results.allPatterns?.map((p, i) => (
                    <div key={i} className={`border rounded-lg p-3 ${p.name === results.primaryPattern ? "border-primary bg-primary/5" : ""}`}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm">{p.name}</p>
                        <Badge variant="outline" className="text-xs font-mono">{p.timeComplexity}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{p.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">📌 Use when: {p.useWhen}</p>
                      <p className="text-xs text-primary mt-1">Example: {p.example}</p>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}