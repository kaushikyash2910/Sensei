"use client";

import { useState } from "react";
import { compareResume } from "@/actions/resume-compare";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

const importanceColor = {
  Critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Important: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "Nice-to-have": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

const verdictColor = {
  "Strong Match": "text-green-500",
  "Good Match": "text-blue-500",
  "Weak Match": "text-yellow-500",
  "Poor Match": "text-red-500",
};

export function CompareForm() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast.error("Please fill in both your resume and the job description.");
      return;
    }
    setLoading(true);
    try {
      const data = await compareResume({ resumeText, jobDescription });
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Comparison failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Your Resume *</Label>
          <Textarea
            placeholder="Paste your resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="min-h-[250px]"
          />
        </div>
        <div className="space-y-1">
          <Label>Job Description *</Label>
          <Textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[250px]"
          />
        </div>
      </div>

      <Button onClick={handleCompare} disabled={loading} className="w-full">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Comparing...</> : "Compare Resume vs Job Description"}
      </Button>

      {results && (
        <div className="space-y-5 mt-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className={`text-5xl font-bold ${verdictColor[results.verdict]}`}>
                {results.matchScore}<span className="text-2xl text-muted-foreground">/100</span>
              </p>
              <Badge className={`mt-2 ${verdictColor[results.verdict]}`}>{results.verdict}</Badge>
              <p className="text-sm text-muted-foreground mt-3">{results.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                What Matches ({results.matching.length} requirements)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.matching.map((item, i) => (
                <div key={i} className="border rounded-lg p-3">
                  <p className="font-semibold text-sm">{item.requirement}</p>
                  <p className="text-xs text-muted-foreground mt-1">✓ {item.resumeEvidence}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                What's Missing ({results.missing.length} gaps)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.missing.map((item, i) => (
                <div key={i} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm">{item.requirement}</p>
                    <Badge className={importanceColor[item.importance]}>{item.importance}</Badge>
                  </div>
                  <div className="bg-muted rounded p-2 mt-2">
                    <p className="text-xs font-semibold mb-1">💡 Add this to your resume:</p>
                    <p className="text-xs text-muted-foreground italic">{item.suggestedRewrite}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {results.weakSections.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">⚠️ Weak Sections — Suggested Rewrites</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.weakSections.map((item, i) => (
                  <div key={i} className="border rounded-lg p-3">
                    <p className="font-semibold text-sm mb-1">{item.section}</p>
                    <p className="text-xs text-muted-foreground mb-2">{item.issue}</p>
                    <div className="bg-muted rounded p-2">
                      <p className="text-xs font-semibold mb-1">Rewrite:</p>
                      <p className="text-xs text-muted-foreground">{item.rewrite}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">🔑 Keywords to Add</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {results.keywordsToAdd.map((kw) => (
                <Badge key={kw} variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">{kw}</Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}