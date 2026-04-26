"use client";

import { useState } from "react";
import { generateCareerRoadmap } from "@/actions/career-roadmap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle, Target } from "lucide-react";
import { toast } from "sonner";

export function RoadmapForm() {
  const [form, setForm] = useState({
    currentRole: "", targetRole: "", currentSkills: "", timeframe: "12 months",
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!form.currentRole || !form.targetRole) {
      toast.error("Please fill in current and target role.");
      return;
    }
    setLoading(true);
    try {
      const data = await generateCareerRoadmap(form);
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { label: "Current Role *", key: "currentRole", placeholder: "e.g. CS Student / Junior Developer" },
          { label: "Target Role *", key: "targetRole", placeholder: "e.g. Senior Full Stack Engineer" },
          { label: "Current Skills", key: "currentSkills", placeholder: "e.g. HTML, CSS, JavaScript, React" },
        ].map(({ label, key, placeholder }) => (
          <div key={key} className="space-y-1">
            <Label>{label}</Label>
            <Input
              placeholder={placeholder}
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            />
          </div>
        ))}
        <div className="space-y-1">
          <Label>Timeframe</Label>
          <Select value={form.timeframe} onValueChange={(v) => setForm((f) => ({ ...f, timeframe: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="3 months">3 months</SelectItem>
              <SelectItem value="6 months">6 months</SelectItem>
              <SelectItem value="12 months">12 months</SelectItem>
              <SelectItem value="2 years">2 years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleGenerate} disabled={loading} className="w-full">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Building Roadmap...</> : "Generate Career Roadmap"}
      </Button>

      {results && (
        <div className="space-y-5 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xl">{results.title}</h3>
            <Badge variant="outline">⏱ {results.totalDuration}</Badge>
          </div>

          {/* Salary */}
          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Expected Salary at Target Role</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{results.salaryExpectation}</p>
            </CardContent>
          </Card>

          {/* Skills */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" /> Skills You Have
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {results.skillsYouHave.map((s) => (
                  <Badge key={s} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{s}</Badge>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" /> Skills to Learn
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {results.skillsToLearn.map((s) => (
                  <Badge key={s} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{s}</Badge>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Phases */}
          <div className="space-y-4">
            {results.phases.map((phase) => (
              <Card key={phase.phase}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Phase {phase.phase}: {phase.title}
                    </CardTitle>
                    <Badge variant="outline">{phase.duration}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{phase.goal}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold mb-1">Tasks:</p>
                    {phase.tasks.map((task, i) => (
                      <div key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <span>•</span><span>{task}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1">Resources:</p>
                    {phase.resources.map((res, i) => (
                      <div key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <span>📚</span><span>{res}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-muted rounded-lg p-3 mt-2">
                    <p className="text-xs font-semibold">🏁 Milestone:</p>
                    <p className="text-sm text-muted-foreground">{phase.milestone}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Advice */}
          <Card className="border-primary">
            <CardContent className="pt-6">
              <p className="text-sm font-semibold mb-1">💡 Coach's Advice</p>
              <p className="text-muted-foreground">{results.advice}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}