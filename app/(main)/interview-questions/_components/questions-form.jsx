"use client";

import { useState } from "react";
import { generateInterviewQuestions } from "@/actions/interview-questions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { Loader2, Download, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

const difficultyColor = {
  Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const categoryColor = {
  Technical: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Behavioral: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Situational: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  HR: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
};

export function QuestionsForm() {
  const [jobDescription, setJobDescription] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Mid-level");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedAnswers, setExpandedAnswers] = useState({});

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description.");
      return;
    }
    setLoading(true);
    setExpandedAnswers({});
    try {
      const data = await generateInterviewQuestions({ jobDescription, experienceLevel });
      setResults(data);
      toast.success("Questions generated!");
    } catch (err) {
      toast.error(err.message || "Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAnswer = (index) => {
    setExpandedAnswers((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const downloadPDF = async () => {
    if (!results) return;

    // Build plain text content
    let content = `INTERVIEW QUESTIONS — ${results.role}\n`;
    if (results.company !== "Unknown") content += `Company: ${results.company}\n`;
    content += `Experience Level: ${experienceLevel}\n`;
    content += `${"=".repeat(60)}\n\n`;

    results.questions.forEach((q, i) => {
      content += `Q${i + 1}. ${q.question}\n`;
      content += `Category: ${q.category} | Difficulty: ${q.difficulty}\n\n`;
      content += `HOW TO ANSWER:\n${q.howToAnswer}\n\n`;
      content += `KEY POINTS:\n${q.keyPoints.map((p) => `• ${p}`).join("\n")}\n\n`;
      if (q.modelAnswer) {
        content += `MODEL ANSWER:\n${q.modelAnswer}\n\n`;
      }
      content += `${"-".repeat(50)}\n\n`;
    });

    content += `\nBONUS TIPS:\n`;
    results.bonusTips.forEach((tip, i) => {
      content += `${i + 1}. ${tip}\n`;
    });

    // Use unpdf or browser print to generate PDF
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Interview Questions — ${results.role}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #111; }
            h1 { font-size: 24px; margin-bottom: 4px; }
            h2 { font-size: 16px; color: #555; font-weight: normal; margin-bottom: 20px; }
            .question { background: #f9f9f9; border-left: 4px solid #3b82f6; padding: 16px; margin-bottom: 24px; border-radius: 4px; }
            .question-title { font-size: 16px; font-weight: bold; margin-bottom: 8px; }
            .badges { display: flex; gap: 8px; margin-bottom: 12px; }
            .badge { padding: 2px 10px; border-radius: 999px; font-size: 12px; background: #e0e7ff; color: #3730a3; }
            .badge.hard { background: #fee2e2; color: #991b1b; }
            .badge.easy { background: #dcfce7; color: #166534; }
            .badge.medium { background: #fef9c3; color: #854d0e; }
            .section-label { font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase; margin-top: 10px; margin-bottom: 4px; }
            .section-content { font-size: 14px; color: #374151; line-height: 1.6; }
            .key-points { list-style: disc; padding-left: 20px; font-size: 14px; color: #374151; }
            .model-answer { background: #eff6ff; border-left: 4px solid #60a5fa; padding: 12px; border-radius: 4px; margin-top: 10px; font-size: 14px; color: #1e3a5f; }
            .tips { margin-top: 30px; padding: 16px; background: #f0fdf4; border-radius: 8px; }
            .tips h3 { margin-bottom: 8px; font-size: 16px; color: #166534; }
            .divider { border: none; border-top: 1px solid #e5e7eb; margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>Interview Questions — ${results.role}</h1>
          <h2>${results.company !== "Unknown" ? `${results.company} · ` : ""}${experienceLevel}</h2>
          <hr class="divider" />
          ${results.questions.map((q, i) => `
            <div class="question">
              <div class="question-title">Q${i + 1}. ${q.question}</div>
              <div class="badges">
                <span class="badge">${q.category}</span>
                <span class="badge ${q.difficulty.toLowerCase()}">${q.difficulty}</span>
              </div>
              <div class="section-label">How to Answer</div>
              <div class="section-content">${q.howToAnswer}</div>
              <div class="section-label">Key Points</div>
              <ul class="key-points">
                ${q.keyPoints.map((p) => `<li>${p}</li>`).join("")}
              </ul>
              ${q.modelAnswer ? `
                <div class="section-label">Model Answer</div>
                <div class="model-answer">${q.modelAnswer}</div>
              ` : ""}
            </div>
          `).join("")}
          <div class="tips">
            <h3>🎯 Bonus Tips</h3>
            ${results.bonusTips.map((tip, i) => `<div class="section-content">${i + 1}. ${tip}</div>`).join("")}
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Experience Level</Label>
        <Select value={experienceLevel} onValueChange={setExperienceLevel}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Fresher">Fresher (0-1 years)</SelectItem>
            <SelectItem value="Junior">Junior (1-3 years)</SelectItem>
            <SelectItem value="Mid-level">Mid-level (3-5 years)</SelectItem>
            <SelectItem value="Senior">Senior (5+ years)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Paste Job Description</Label>
        <Textarea
          placeholder="Paste the full job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="min-h-[200px]"
        />
      </div>

      <Button onClick={handleGenerate} disabled={loading} className="w-full">
        {loading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</>
        ) : results ? (
          <><RefreshCw className="mr-2 h-4 w-4" />Regenerate Questions</>
        ) : (
          "Generate Interview Questions"
        )}
      </Button>

      {results && (
        <div className="space-y-4 mt-4">
          {/* Header + Download */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg">Top 10 Questions for {results.role}</h3>
              {results.company !== "Unknown" && (
                <Badge variant="outline">{results.company}</Badge>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={downloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>

          {/* Questions */}
          {results.questions.map((q, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-semibold leading-relaxed">
                    {i + 1}. {q.question}
                  </CardTitle>
                  <div className="flex gap-1 shrink-0">
                    <Badge className={categoryColor[q.category] || ""}>{q.category}</Badge>
                    <Badge className={difficultyColor[q.difficulty] || ""}>{q.difficulty}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{q.howToAnswer}</p>
                <div className="flex flex-wrap gap-1">
                  {q.keyPoints.map((pt, j) => (
                    <Badge key={j} variant="secondary" className="text-xs">{pt}</Badge>
                  ))}
                </div>

                {/* Show/Hide Model Answer */}
                <button
                  onClick={() => toggleAnswer(i)}
                  className="flex items-center gap-1 text-xs text-primary font-medium mt-1 hover:underline"
                >
                  {expandedAnswers[i] ? (
                    <><ChevronUp className="h-3 w-3" />Hide Model Answer</>
                  ) : (
                    <><ChevronDown className="h-3 w-3" />Show Model Answer</>
                  )}
                </button>

                {expandedAnswers[i] && q.modelAnswer && (
                  <div className="bg-muted/60 border-l-4 border-primary rounded-lg p-3 mt-1">
                    <p className="text-xs font-semibold mb-1 text-primary">Model Answer</p>
                    <p className="text-sm text-muted-foreground">{q.modelAnswer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Bonus Tips */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">🎯 Bonus Interview Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {results.bonusTips.map((tip, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="text-primary font-bold">{i + 1}.</span>
                  <span className="text-muted-foreground">{tip}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Regenerate at bottom too */}
          <Button onClick={handleGenerate} disabled={loading} variant="outline" className="w-full">
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</>
            ) : (
              <><RefreshCw className="mr-2 h-4 w-4" />Generate New Questions</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}