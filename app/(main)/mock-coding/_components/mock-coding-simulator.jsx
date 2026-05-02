"use client";

import { useState, useEffect, useRef } from "react";
import { startMockCoding, evaluateSolution } from "@/actions/mock-coding";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Timer, Lightbulb, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

const verdictColor = {
  "Strong Hire": "text-green-500",
  "Hire": "text-blue-500",
  "No Hire": "text-orange-500",
  "Strong No Hire": "text-red-500",
};

export function MockCodingSimulator() {
  const [setup, setSetup] = useState({ difficulty: "Medium", language: "Python", topic: "Arrays" });
  const [problem, setProblem] = useState(null);
  const [solution, setSolution] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [shownHints, setShownHints] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [timeTaken, setTimeTaken] = useState(0);
  const [showOptimal, setShowOptimal] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (started && !evaluation) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            toast.error("⏰ Time's up! Submitting your solution...");
            handleSubmit(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, evaluation]);

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const timeColor = timeLeft < 300 ? "text-red-500" : timeLeft < 600 ? "text-yellow-500" : "text-green-500";

  const handleStart = async () => {
    setLoading(true);
    try {
      const data = await startMockCoding(setup);
      setProblem(data);
      setStarted(true);
      setTimeLeft(data.timeLimit * 60);
      setSolution("");
      setEvaluation(null);
      setHintsUsed(0);
      setShownHints([]);
    } catch (err) {
      toast.error(err.message || "Failed to start interview.");
    } finally {
      setLoading(false);
    }
  };

  const useHint = () => {
    if (hintsUsed >= 3) { toast.error("No more hints available!"); return; }
    if (hintsUsed >= problem.hints.length) return;
    setShownHints((prev) => [...prev, problem.hints[hintsUsed]]);
    setHintsUsed((h) => h + 1);
    toast.info(`Hint ${hintsUsed + 1}/3 used (-1 point penalty)`);
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!solution.trim() && !autoSubmit) { toast.error("Please write your solution first."); return; }
    clearInterval(timerRef.current);
    const taken = Math.floor((problem.timeLimit * 60 - timeLeft) / 60);
    setTimeTaken(taken);
    setSubmitting(true);
    try {
      const data = await evaluateSolution({
        problem, solution: solution || "// No solution submitted (time ran out)",
        language: setup.language, timeTaken: taken, hintsUsed,
      });
      setEvaluation(data);
    } catch (err) {
      toast.error(err.message || "Evaluation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setProblem(null); setSolution(""); setEvaluation(null);
    setStarted(false); setHintsUsed(0); setShownHints([]);
    setTimeLeft(30 * 60); setShowOptimal(false);
  };

  if (!started) {
    return (
      <div className="space-y-6 max-w-xl mx-auto">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: "Difficulty", key: "difficulty", options: ["Easy", "Medium", "Hard"] },
            { label: "Language", key: "language", options: ["Python", "Java", "C++", "JavaScript"] },
            { label: "Topic", key: "topic", options: ["Arrays", "Strings", "Trees", "Graphs", "DP", "Sorting", "Random"] },
          ].map(({ label, key, options }) => (
            <div key={key} className="space-y-1">
              <Label>{label}</Label>
              <Select value={setup[key]} onValueChange={(v) => setSetup((s) => ({ ...s, [key]: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <Button onClick={handleStart} disabled={loading} className="w-full" size="lg">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Problem...</> : "🚀 Start Mock Interview"}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          You'll have 30 minutes · 3 hints available (costs points) · Solution evaluated by AI
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Timer Bar */}
      {!evaluation && (
        <div className="flex items-center justify-between border rounded-xl px-4 py-3 bg-muted/30">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span className={`font-mono text-2xl font-bold ${timeColor}`}>{formatTime(timeLeft)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{setup.language}</Badge>
            <Badge variant={setup.difficulty === "Easy" ? "secondary" : setup.difficulty === "Hard" ? "destructive" : "outline"}>
              {problem.difficulty}
            </Badge>
            <Button variant="outline" size="sm" onClick={useHint} disabled={hintsUsed >= 3}>
              <Lightbulb className="h-3 w-3 mr-1" />
              Hint ({3 - hintsUsed} left)
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-3 w-3 mr-1" />New
            </Button>
          </div>
        </div>
      )}

      {!evaluation ? (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Problem */}
          <div className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{problem.problemTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{problem.problem}</p>
                {problem.examples?.map((ex, i) => (
                  <div key={i} className="bg-muted rounded-lg p-3 text-xs font-mono">
                    <p><span className="font-bold">Input:</span> {ex.input}</p>
                    <p><span className="font-bold">Output:</span> {ex.output}</p>
                    {ex.explanation && <p className="text-muted-foreground mt-1">{ex.explanation}</p>}
                  </div>
                ))}
                <div>
                  <p className="text-xs font-semibold mb-1">Constraints:</p>
                  {problem.constraints?.map((c, i) => (
                    <p key={i} className="text-xs text-muted-foreground">• {c}</p>
                  ))}
                </div>
                {shownHints.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-yellow-500">Hints Used:</p>
                    {shownHints.map((h, i) => (
                      <div key={i} className="flex gap-2 text-xs">
                        <Lightbulb className="h-3 w-3 text-yellow-500 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{h}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Editor */}
          <div className="space-y-2">
            <Label>Your Solution ({setup.language})</Label>
            <Textarea
              placeholder={`# Write your ${setup.language} solution here...\n# Think through the approach before coding!`}
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              className="min-h-[380px] font-mono text-sm"
            />
            <Button onClick={() => handleSubmit(false)} disabled={submitting} className="w-full">
              {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Evaluating...</> : "✅ Submit Solution"}
            </Button>
          </div>
        </div>
      ) : (
        /* Results */
        <div className="space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className={`text-5xl font-bold ${verdictColor[evaluation.verdict]}`}>
                {evaluation.overallScore}<span className="text-2xl text-muted-foreground">/10</span>
              </p>
              <p className={`text-lg font-semibold mt-1 ${verdictColor[evaluation.verdict]}`}>
                {evaluation.verdict}
              </p>
            </div>
            <div className="text-right space-y-1 text-sm text-muted-foreground">
              <p>⏱ Time: {timeTaken} min</p>
              <p>💡 Hints: {hintsUsed}/3 used</p>
              <p>📝 {problem.problemTitle}</p>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Correctness", data: evaluation.correctness },
              { label: "Efficiency", data: evaluation.efficiency },
              { label: "Code Quality", data: evaluation.codeQuality },
              { label: "Approach", data: evaluation.approach },
              { label: "Time Mgmt", data: evaluation.timeManagement },
            ].map(({ label, data }) => (
              <Card key={label}>
                <CardContent className="pt-4 text-center">
                  <p className={`text-2xl font-bold ${data?.score >= 8 ? "text-green-500" : data?.score >= 6 ? "text-yellow-500" : "text-red-500"}`}>
                    {data?.score}
                  </p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Interviewer Notes */}
          <Card className="border-primary">
            <CardContent className="pt-6">
              <p className="text-sm font-semibold mb-1">👔 Interviewer Notes</p>
              <p className="text-sm text-muted-foreground italic">{evaluation.interviewerNotes}</p>
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">✅ How to Improve</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {evaluation.improvements?.map((imp, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="text-primary font-bold">{i + 1}.</span>
                  <span className="text-muted-foreground">{imp}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Optimal Solution toggle */}
          <Card>
            <CardHeader className="pb-2 cursor-pointer" onClick={() => setShowOptimal(!showOptimal)}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">💡 Optimal Solution</CardTitle>
                {showOptimal ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardHeader>
            {showOptimal && (
              <CardContent>
                <pre className="text-xs bg-muted p-3 rounded-lg font-mono overflow-auto">
                  {evaluation.optimalSolution}
                </pre>
              </CardContent>
            )}
          </Card>

          <Button onClick={handleReset} className="w-full" variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />Start New Interview
          </Button>
        </div>
      )}
    </div>
  );
}