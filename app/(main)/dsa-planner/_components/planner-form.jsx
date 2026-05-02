"use client";

import { useState } from "react";
import { generateDSAPlan } from "@/actions/dsa-planner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, ChevronDown, ChevronUp, Download } from "lucide-react";
import { toast } from "sonner";

const difficultyColor = {
  Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function PlannerForm() {
  const [form, setForm] = useState({
    timeline: "30 days", experience: "Beginner",
    targetCompany: "Product Companies (FAANG)", language: "Python",
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState({ 0: true });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateDSAPlan(form);
      setResults(data);
      setExpandedWeeks({ 0: true });
    } catch (err) {
      toast.error(err.message || "Failed to generate plan.");
    } finally {
      setLoading(false);
    }
  };

  const toggleWeek = (i) => setExpandedWeeks((prev) => ({ ...prev, [i]: !prev[i] }));

  const downloadPlan = () => {
    if (!results) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html><head><title>${results.planTitle}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; max-width: 900px; margin: 0 auto; }
        h1 { font-size: 24px; } h2 { font-size: 18px; color: #333; border-bottom: 1px solid #eee; padding-bottom: 6px; }
        h3 { font-size: 14px; color: #555; } .day { margin-bottom: 16px; padding: 12px; background: #f9f9f9; border-radius: 6px; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; background: #e0e7ff; color: #3730a3; margin: 2px; }
        .hard { background: #fee2e2; color: #991b1b; } .medium { background: #fef9c3; color: #854d0e; } .easy { background: #dcfce7; color: #166534; }
      </style></head><body>
      <h1>${results.planTitle}</h1>
      <p>${results.dailyHours} · ${results.totalDays} days total</p>
      ${results.weeks.map((week) => `
        <h2>Week ${week.week}: ${week.theme}</h2>
        ${week.days.map((day) => `
          <div class="day">
            <h3>Day ${day.day}: ${day.topic}</h3>
            <p><strong>Concepts:</strong> ${day.concepts.join(", ")}</p>
            <p><strong>Problems:</strong> ${day.problems.map((p) => `${p.name} (${p.difficulty})`).join(", ")}</p>
            ${day.revision ? `<p><strong>Revise:</strong> ${day.revision}</p>` : ""}
          </div>
        `).join("")}
      `).join("")}
      <script>window.onload = function() { window.print(); }</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { label: "Timeline", key: "timeline", options: ["2 weeks", "30 days", "2 months", "3 months"] },
          { label: "Your DSA Level", key: "experience", options: ["Beginner", "Intermediate", "Advanced"] },
          { label: "Target Company Type", key: "targetCompany", options: ["Product Companies (FAANG)", "Indian Startups", "Service Companies", "Any"] },
          { label: "Preferred Language", key: "language", options: ["Python", "Java", "C++", "JavaScript"] },
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

      <Button onClick={handleGenerate} disabled={loading} className="w-full">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Building Your Plan...</> : "Generate DSA Study Plan"}
      </Button>

      {results && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{results.planTitle}</h2>
              <p className="text-sm text-muted-foreground">{results.dailyHours} · {results.totalDays} days</p>
            </div>
            <Button variant="outline" size="sm" onClick={downloadPlan}>
              <Download className="h-4 w-4 mr-1" />Download PDF
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">🔑 Important Topics to Cover</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {results.importantTopics.map((t) => (
                <Badge key={t} variant="secondary">{t}</Badge>
              ))}
            </CardContent>
          </Card>

          {results.weeks.map((week, wi) => (
            <Card key={wi}>
              <CardHeader className="pb-2 cursor-pointer" onClick={() => toggleWeek(wi)}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Week {week.week}: {week.theme}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{week.days.length} days</Badge>
                    {expandedWeeks[wi] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
              </CardHeader>
              {expandedWeeks[wi] && (
                <CardContent className="space-y-3">
                  {week.days.map((day, di) => (
                    <div key={di} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-sm">Day {day.day}: {day.topic}</p>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {day.concepts.map((c) => (
                          <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                        ))}
                      </div>
                      <div className="space-y-1">
                        {day.problems.map((prob, pi) => (
                          <div key={pi} className="flex items-center gap-2 text-xs">
                            <Badge className={difficultyColor[prob.difficulty]}>{prob.difficulty}</Badge>
                            <span className="text-muted-foreground">{prob.name}</span>
                            <span className="text-muted-foreground">· {prob.platform}</span>
                          </div>
                        ))}
                      </div>
                      {day.revision && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          📝 Revise: {day.revision}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          ))}

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">💡 Study Tips</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {results.tips.map((tip, i) => (
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