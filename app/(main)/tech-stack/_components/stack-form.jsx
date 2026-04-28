"use client";

import { useState, useEffect } from "react";
import { recommendTechStack, compareTwoStacks } from "@/actions/tech-stack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Loader2, CheckCircle, XCircle, Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";

const demandColor = {
  High: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Low: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const curveColor = {
  Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

function TechItem({ item }) {
  return (
    <div className="flex items-center justify-between border rounded-lg p-3">
      <div className="flex-1">
        <p className="font-semibold text-sm">{item.name}</p>
        <p className="text-xs text-muted-foreground">{item.reason}</p>
      </div>
      <div className="flex gap-1 ml-2 shrink-0">
        <Badge className={curveColor[item.learningCurve]}>{item.learningCurve}</Badge>
        <Badge className={demandColor[item.jobDemand]}>{item.jobDemand} demand</Badge>
      </div>
    </div>
  );
}

export function StackForm() {
  const [form, setForm] = useState({
    projectIdea: "", projectType: "Web App", experience: "Intermediate",
    budget: "Low/Free", timeline: "3 months",
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Compare stacks state
  const [compareForm, setCompareForm] = useState({ stack1: "", stack2: "", projectIdea: "" });
  const [compareResults, setCompareResults] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);

  useEffect(() => {
    if (!form.projectIdea.trim()) return;
    const timeout = setTimeout(() => { handleRecommend(); }, 500);
    return () => clearTimeout(timeout);
  }, [form.projectType, form.experience, form.budget, form.timeline]);

  const handleRecommend = async () => {
    if (!form.projectIdea) { toast.error("Please describe your project idea."); return; }
    setLoading(true);
    setSaved(false);
    try {
      const data = await recommendTechStack(form);
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Failed to get recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!compareForm.stack1 || !compareForm.stack2 || !compareForm.projectIdea) {
      toast.error("Please fill in all fields.");
      return;
    }
    setCompareLoading(true);
    try {
      const data = await compareTwoStacks(compareForm);
      setCompareResults(data);
    } catch (err) {
      toast.error(err.message || "Comparison failed.");
    } finally {
      setCompareLoading(false);
    }
  };

  const handleSave = () => {
    if (!results) return;
    localStorage.setItem("savedStack", JSON.stringify({ results, form, savedAt: new Date().toISOString() }));
    setSaved(true);
    toast.success("Stack saved to favourites!");
  };

  const handleLoadSaved = () => {
    const saved = localStorage.getItem("savedStack");
    if (!saved) { toast.error("No saved stack found."); return; }
    const { results: r, form: f } = JSON.parse(saved);
    setResults(r);
    setForm(f);
    toast.success("Loaded saved stack!");
  };

  // Build demand chart data from all tech items
  const demandChartData = results
    ? [
        ...(results.frontend || []),
        ...(results.backend || []),
        ...(results.database || []),
        ...(results.devops || []),
      ].filter((t) => t.demandScore).map((t) => ({ name: t.name, demand: t.demandScore }))
    : [];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="recommend">
        <TabsList className="w-full">
          <TabsTrigger value="recommend" className="flex-1">🤖 Get Recommendation</TabsTrigger>
          <TabsTrigger value="compare" className="flex-1">⚖️ Compare Two Stacks</TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Recommend ── */}
        <TabsContent value="recommend" className="space-y-6 mt-4">
          <div className="space-y-1">
            <Label>Project Idea *</Label>
            <Textarea
              placeholder="e.g. An AI-powered job portal where recruiters post jobs..."
              value={form.projectIdea}
              onChange={(e) => setForm((f) => ({ ...f, projectIdea: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: "Project Type", key: "projectType", options: ["Web App", "Mobile App", "API / Backend", "Full Stack SaaS", "Chrome Extension", "AI / ML Project"] },
              { label: "Experience Level", key: "experience", options: ["Beginner", "Intermediate", "Advanced"] },
              { label: "Budget", key: "budget", options: ["Low/Free", "Medium ($50-200/mo)", "High (No limit)"] },
              { label: "Timeline", key: "timeline", options: ["2 weeks", "1 month", "3 months", "6+ months"] },
            ].map(({ label, key, options }) => (
              <div key={key} className="space-y-1">
                <Label>{label}</Label>
                <Select value={form[key]} onValueChange={(v) => setForm((f) => ({ ...f, [key]: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleRecommend} disabled={loading} className="flex-1">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : results ? "Regenerate" : "Recommend Tech Stack"}
            </Button>
            <Button variant="outline" onClick={handleLoadSaved}>
              <BookmarkCheck className="h-4 w-4 mr-1" />Load Saved
            </Button>
          </div>

          {results && (
            <div className="space-y-5">
              {/* Header + Save */}
              <Card className="border-primary">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xl font-bold mb-1">{results.stackName}</p>
                      <p className="text-sm text-muted-foreground">{results.summary}</p>
                      <p className="text-sm mt-2 text-primary font-medium">⏱ {results.estimatedLearningTime}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleSave}>
                      {saved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
                      <span className="ml-1">{saved ? "Saved!" : "Save"}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tech Items */}
              {[
                { label: "Frontend", items: results.frontend },
                { label: "Backend", items: results.backend },
                { label: "Database", items: results.database },
                { label: "DevOps / Deployment", items: results.devops },
              ].map(({ label, items }) => items?.length > 0 && (
                <Card key={label}>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">{label}</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {items.map((item, i) => <TechItem key={i} item={item} />)}
                  </CardContent>
                </Card>
              ))}

              {/* Job Demand Chart */}
              {demandChartData.length > 0 && (
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">📊 Job Market Demand by Technology</CardTitle></CardHeader>
                  <CardContent>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={demandChartData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
                          <Tooltip formatter={(v) => [`${v}/100`, "Demand Score"]} />
                          <Bar dataKey="demand" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pros + Cons */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Pros</CardTitle></CardHeader>
                  <CardContent className="space-y-1">
                    {results.pros.map((p, i) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <span className="text-green-500">✓</span>
                        <span className="text-muted-foreground">{p}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><XCircle className="h-4 w-4 text-red-500" />Cons</CardTitle></CardHeader>
                  <CardContent className="space-y-1">
                    {results.cons.map((c, i) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <span className="text-red-500">✗</span>
                        <span className="text-muted-foreground">{c}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Learning Path */}
              {results.learningPath?.length > 0 && (
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">🗓️ Week-by-Week Learning Path</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {results.learningPath.map((step, i) => (
                      <div key={i} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-sm">{step.week}</p>
                          <Badge variant="outline">Step {i + 1}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{step.focus}</p>
                        <div className="flex flex-wrap gap-1">
                          {step.resources.map((r, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">{r}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Similar Projects */}
              {results.similarProjects?.length > 0 && (
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">🌟 Famous Apps Built With This Stack</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {results.similarProjects.map((proj, i) => (
                      <div key={i} className="border rounded-lg p-3">
                        <p className="font-semibold text-sm">{proj.name}</p>
                        <p className="text-xs text-muted-foreground mb-2">{proj.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {proj.techUsed.map((t) => (
                            <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Alternatives */}
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">🔄 Alternatives to Consider</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {results.alternatives.map((alt) => (
                    <Badge key={alt} variant="outline">{alt}</Badge>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* ── Tab 2: Compare ── */}
        <TabsContent value="compare" className="space-y-4 mt-4">
          <div className="space-y-1">
            <Label>Your Project Idea *</Label>
            <Textarea
              placeholder="e.g. E-commerce website with real-time inventory..."
              value={compareForm.projectIdea}
              onChange={(e) => setCompareForm((f) => ({ ...f, projectIdea: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Stack 1 *</Label>
              <Input placeholder="e.g. MERN Stack" value={compareForm.stack1}
                onChange={(e) => setCompareForm((f) => ({ ...f, stack1: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Stack 2 *</Label>
              <Input placeholder="e.g. T3 Stack" value={compareForm.stack2}
                onChange={(e) => setCompareForm((f) => ({ ...f, stack2: e.target.value }))} />
            </div>
          </div>
          <Button onClick={handleCompare} disabled={compareLoading} className="w-full">
            {compareLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Comparing...</> : "Compare Stacks"}
          </Button>

          {compareResults && (
            <div className="space-y-4 mt-4">
              {/* Winner */}
              <Card className="border-primary">
                <CardContent className="pt-6 text-center">
                  <p className="text-lg font-bold">🏆 {compareResults.winner} wins!</p>
                  <p className="text-sm text-muted-foreground mt-1">{compareResults.winnerReason}</p>
                  <p className="text-xs text-muted-foreground mt-2 italic">{compareResults.verdict}</p>
                </CardContent>
              </Card>

              {/* Side by side */}
              <div className="grid md:grid-cols-2 gap-4">
                {[compareResults.stack1, compareResults.stack2].map((stack, i) => (
                  <Card key={i} className={compareResults.winner === stack.name ? "border-primary" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{stack.name}</CardTitle>
                        <p className="text-2xl font-bold">{stack.score}<span className="text-sm text-muted-foreground">/100</span></p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-2">
                        <Badge className={curveColor[stack.learningCurve]}>{stack.learningCurve}</Badge>
                        <Badge className={demandColor[stack.jobDemand]}>{stack.jobDemand} demand</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{stack.bestFor}</p>
                      <div>
                        <p className="text-xs font-semibold text-green-600 mb-1">✓ Pros</p>
                        {stack.pros.map((p, j) => <p key={j} className="text-xs text-muted-foreground">• {p}</p>)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-red-500 mb-1">✗ Cons</p>
                        {stack.cons.map((c, j) => <p key={j} className="text-xs text-muted-foreground">• {c}</p>)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}