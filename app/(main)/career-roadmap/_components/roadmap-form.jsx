"use client";

import { useState, useEffect } from "react";
import { generateCareerRoadmap } from "@/actions/career-roadmap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  CheckCircle,
  Target,
  Sparkles,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "sensei_career_roadmap";

const POPULAR_PATHS = [
  { from: "CS Student", to: "Full Stack Engineer" },
  { from: "Junior Developer", to: "Senior Engineer" },
  { from: "Backend Dev", to: "System Architect" },
  { from: "Fresher", to: "Data Scientist" },
];

export function RoadmapForm() {
  const [form, setForm] = useState({
    currentRole: "",
    targetRole: "",
    currentSkills: "",
    timeframe: "12 months",
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState({ 0: true });
  const [completedTasks, setCompletedTasks] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { results: r, form: f } = JSON.parse(saved);
      setResults(r);
      setForm(f);
    }
    const savedTasks = localStorage.getItem("sensei_roadmap_tasks");
    if (savedTasks) setCompletedTasks(JSON.parse(savedTasks));
  }, []);

  useEffect(() => {
    if (results)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ results, form }));
  }, [results]);

  const handleGenerate = async () => {
    if (!form.currentRole || !form.targetRole) {
      toast.error("Please fill in current and target role.");
      return;
    }
    setLoading(true);
    try {
      const data = await generateCareerRoadmap(form);
      setResults(data);
      setExpandedPhases({ 0: true });
      setCompletedTasks({});
    } catch (err) {
      toast.error(err.message || "Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  const togglePhase = (i) => setExpandedPhases((p) => ({ ...p, [i]: !p[i] }));

  const toggleTask = (phaseIdx, taskIdx) => {
    const key = `${phaseIdx}-${taskIdx}`;
    const updated = { ...completedTasks, [key]: !completedTasks[key] };
    setCompletedTasks(updated);
    localStorage.setItem("sensei_roadmap_tasks", JSON.stringify(updated));
  };

  const totalTasks =
    results?.phases?.reduce((acc, p) => acc + (p.tasks?.length || 0), 0) || 0;
  const doneTasks = Object.values(completedTasks).filter(Boolean).length;
  const progress =
    totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const downloadRoadmap = () => {
    if (!results) return;
    const win = window.open("", "_blank");
    win.document.write(`<html><head><title>${results.title}</title><style>
      body{font-family:Arial,sans-serif;padding:40px;max-width:800px;margin:0 auto}
      h1{font-size:24px}h2{font-size:18px;border-bottom:1px solid #eee;padding-bottom:6px;margin-top:24px}
      .phase{background:#f9f9f9;border-radius:8px;padding:16px;margin-bottom:16px}
      .task{margin:4px 0;font-size:14px}
    </style></head><body>
    <h1>${results.title}</h1>
    <p>${results.totalDuration} · ${results.salaryExpectation}</p>
    ${results.phases
      .map(
        (p) => `
      <div class="phase">
        <h2>Phase ${p.phase}: ${p.title} (${p.duration})</h2>
        <p>${p.goal}</p>
        <h3>Tasks:</h3>${p.tasks
          .map((t) => `<div class="task">• ${t}</div>`)
          .join("")}
        <h3>Resources:</h3>${p.resources
          .map((r) => `<div class="task">📚 ${r}</div>`)
          .join("")}
        <p><strong>Milestone:</strong> ${p.milestone}</p>
      </div>`
      )
      .join("")}
    <p><strong>Coach's Advice:</strong> ${results.advice}</p>
    <script>window.onload=()=>window.print()</script>
    </body></html>`);
    win.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Popular Paths */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Popular Career Paths
        </p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_PATHS.map((p) => (
            <button
              key={p.to}
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  currentRole: p.from,
                  targetRole: p.to,
                }))
              }
              className="text-xs border rounded-full px-3 py-1.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center gap-1"
            >
              {p.from} → {p.to}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          {
            label: "Current Role *",
            key: "currentRole",
            placeholder: "e.g. CS Student / Junior Developer",
          },
          {
            label: "Target Role *",
            key: "targetRole",
            placeholder: "e.g. Senior Full Stack Engineer",
          },
          {
            label: "Current Skills",
            key: "currentSkills",
            placeholder: "e.g. HTML, CSS, JavaScript, React",
          },
        ].map(({ label, key, placeholder }) => (
          <div key={key} className="space-y-1">
            <Label>{label}</Label>
            <Input
              placeholder={placeholder}
              value={form[key]}
              onChange={(e) =>
                setForm((f) => ({ ...f, [key]: e.target.value }))
              }
            />
          </div>
        ))}
        <div className="space-y-1">
          <Label>Timeframe</Label>
          <Select
            value={form.timeframe}
            onValueChange={(v) => setForm((f) => ({ ...f, timeframe: v }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["3 months", "6 months", "12 months", "2 years"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="flex-1 h-11 font-semibold gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Building Roadmap...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Career Roadmap
            </>
          )}
        </Button>
        {results && (
          <Button
            variant="outline"
            className="h-11 gap-2"
            onClick={() => {
              setResults(null);
              localStorage.removeItem(STORAGE_KEY);
            }}
          >
            <RefreshCw className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {results && (
        <>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <p className="text-xs text-muted-foreground px-2">
              ✓ Last saved result
            </p>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background to-muted/20 p-6">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-xl">{results.title}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="outline">⏱ {results.totalDuration}</Badge>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-0">
                    💰 {results.salaryExpectation}
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadRoadmap}
                className="gap-1"
              >
                <Download className="h-3 w-3" />
                Download PDF
              </Button>
            </div>

            {/* Progress Tracker */}
            {totalTasks > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold">Your Progress</p>
                  <p className="text-xs text-muted-foreground">
                    {doneTasks}/{totalTasks} tasks done
                  </p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-primary font-bold mt-1">
                  {progress}% complete
                </p>
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-emerald-200 dark:border-emerald-800/50 overflow-hidden">
              <CardHeader className="pb-2 bg-emerald-50/50 dark:bg-emerald-950/20 border-b">
                <CardTitle className="text-sm flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle className="h-4 w-4" />
                  Skills You Have
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 flex flex-wrap gap-2">
                {results.skillsYouHave.map((s) => (
                  <Badge
                    key={s}
                    className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-0"
                  >
                    ✓ {s}
                  </Badge>
                ))}
              </CardContent>
            </Card>
            <Card className="border-blue-200 dark:border-blue-800/50 overflow-hidden">
              <CardHeader className="pb-2 bg-blue-50/50 dark:bg-blue-950/20 border-b">
                <CardTitle className="text-sm flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Target className="h-4 w-4" />
                  Skills to Learn
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 flex flex-wrap gap-2">
                {results.skillsToLearn.map((s) => (
                  <Badge
                    key={s}
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-0"
                  >
                    {s}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Phases — Interactive with task checkboxes */}
          <div className="space-y-3">
            {results.phases.map((phase, pi) => {
              const phaseDone =
                phase.tasks?.filter((_, ti) => completedTasks[`${pi}-${ti}`])
                  .length || 0;
              const phaseProgress = phase.tasks?.length
                ? Math.round((phaseDone / phase.tasks.length) * 100)
                : 0;
              return (
                <Card
                  key={phase.phase}
                  className={
                    phaseProgress === 100
                      ? "border-emerald-400 dark:border-emerald-600"
                      : ""
                  }
                >
                  <CardHeader
                    className="pb-2 cursor-pointer"
                    onClick={() => togglePhase(pi)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            phaseProgress === 100
                              ? "bg-emerald-500 text-white"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {phaseProgress === 100 ? "✓" : phase.phase}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            Phase {phase.phase}: {phase.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {phase.goal}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className="text-xs">
                          {phase.duration}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {phaseDone}/{phase.tasks?.length}
                        </Badge>
                        {expandedPhases[pi] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    {phase.tasks?.length > 0 && (
                      <div className="w-full bg-muted rounded-full h-1 mt-2">
                        <div
                          className="bg-primary h-1 rounded-full transition-all"
                          style={{ width: `${phaseProgress}%` }}
                        />
                      </div>
                    )}
                  </CardHeader>
                  {expandedPhases[pi] && (
                    <CardContent className="space-y-4">
                      {/* Tasks with checkboxes */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Tasks
                        </p>
                        {phase.tasks?.map((task, ti) => {
                          const done = completedTasks[`${pi}-${ti}`];
                          return (
                            <div
                              key={ti}
                              onClick={() => toggleTask(pi, ti)}
                              className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
                                done ? "opacity-60" : ""
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                  done
                                    ? "bg-emerald-500 border-emerald-500"
                                    : "border-muted-foreground/40"
                                }`}
                              >
                                {done && (
                                  <span className="text-white text-xs">✓</span>
                                )}
                              </div>
                              <p
                                className={`text-sm ${
                                  done
                                    ? "line-through text-muted-foreground"
                                    : ""
                                }`}
                              >
                                {task}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                      {/* Resources */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Resources
                        </p>
                        {phase.resources?.map((res, i) => (
                          <div
                            key={i}
                            className="flex gap-2 text-sm text-muted-foreground p-1"
                          >
                            <span>📚</span>
                            <span>{res}</span>
                          </div>
                        ))}
                      </div>
                      {/* Milestone */}
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <p className="text-xs font-semibold text-primary mb-1">
                          🏁 Milestone
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {phase.milestone}
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Coach's Advice */}
          <Card className="border-primary overflow-hidden">
            <div className="h-1 bg-primary" />
            <CardContent className="pt-6">
              <p className="text-sm font-bold mb-2">💡 Coach's Advice</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {results.advice}
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
