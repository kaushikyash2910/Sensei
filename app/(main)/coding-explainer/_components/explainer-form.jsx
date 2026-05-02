"use client";

import { useState, useEffect } from "react";
import { explainCodingChallenge } from "@/actions/coding-explainer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Copy, CheckCheck } from "lucide-react";
import { toast } from "sonner";

const difficultyColor = {
  Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const STORAGE_KEY = "sensei_coding_explainer";

export function ExplainerForm() {
  const [problem, setProblem] = useState("");
  const [language, setLanguage] = useState("Python");
  const [experienceLevel, setExperienceLevel] = useState("Intermediate");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { results: r, problem: p, language: l, experienceLevel: e } = JSON.parse(saved);
      setResults(r); setProblem(p); setLanguage(l); setExperienceLevel(e);
    }
  }, []);

  useEffect(() => {
    if (results) localStorage.setItem(STORAGE_KEY, JSON.stringify({ results, problem, language, experienceLevel }));
  }, [results]);

  const handleExplain = async () => {
    if (!problem.trim()) { toast.error("Please paste a coding problem."); return; }
    setLoading(true);
    try {
      const data = await explainCodingChallenge({ problem, language, experienceLevel });
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Failed to explain problem.");
    } finally {
      setLoading(false);
    }
  };

  const copySolution = () => {
    navigator.clipboard.writeText(results.solution);
    setCopied(true);
    toast.success("Solution copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Preferred Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Python", "Java", "C++", "JavaScript", "Go"].map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Your Level</Label>
          <Select value={experienceLevel} onValueChange={setExperienceLevel}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Beginner", "Intermediate", "Advanced"].map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1">
        <Label>Paste the Coding Problem *</Label>
        <Textarea
          placeholder="Paste the full LeetCode or HackerRank problem here including examples and constraints..."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className="min-h-[200px] font-mono text-sm"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleExplain} disabled={loading} className="flex-1">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Explaining...</> : "Explain This Problem"}
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
            ✓ Showing your last saved result — click Explain to refresh
          </p>
          <div className="space-y-5">
            <Card className="border-primary">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-bold">{results.problemTitle}</h2>
                  <Badge className={difficultyColor[results.difficulty]}>{results.difficulty}</Badge>
                  <Badge variant="outline">{results.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{results.understanding}</p>
              </CardContent>
            </Card>

            {/* Approach */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">🧠 Approach: {results.approach.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{results.approach.explanation}</p>
                <div className="space-y-2">
                  {results.approach.steps.map((step, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Solution */}
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm">💻 Solution ({language})</CardTitle>
                <Button variant="ghost" size="icon" onClick={copySolution}>
                  {copied ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-[400px] font-mono">
                  {results.solution}
                </pre>
              </CardContent>
            </Card>

            {/* Complexity */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">⏱ Complexity Analysis</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="border rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">Time Complexity</p>
                    <p className="font-bold">{results.complexity.time}</p>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">Space Complexity</p>
                    <p className="font-bold">{results.complexity.space}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{results.complexity.explanation}</p>
              </CardContent>
            </Card>

            {/* Dry Run */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">🔍 Dry Run with Example</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap font-mono text-xs bg-muted p-3 rounded-lg">
                  {results.dryRun}
                </p>
              </CardContent>
            </Card>

            {/* Edge Cases + Alternative Approaches */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">⚠️ Edge Cases</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  {results.edgeCases.map((e, i) => (
                    <p key={i} className="text-xs text-muted-foreground">• {e}</p>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">🔄 Alternative Approaches</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {results.alternativeApproaches.map((a, i) => (
                    <div key={i} className="text-xs">
                      <span className="font-medium">{a.name}</span>
                      <span className="text-muted-foreground"> · {a.complexity} · {a.whenToUse}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Similar Problems */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">🔗 Similar Problems to Practice</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {results.similarProblems.map((p) => (
                  <Badge key={p} variant="secondary">{p}</Badge>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}