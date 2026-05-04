"use client";

import { useState, useEffect } from "react";
import { analyzeSkillGap } from "@/actions/skill-gap";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, FileText, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { SkillGapResults } from "./skill-gap-results";
import { SkillGapExtras } from "./skill-gap-extras";

const EXAMPLE_JD = `We are looking for a Senior Full Stack Engineer proficient in React, Node.js, TypeScript, PostgreSQL, and AWS. Experience with Docker, CI/CD pipelines, and system design is required. Knowledge of Redis and GraphQL is a plus.`;

export function SkillGapForm() {
  const [jobDesc, setJobDesc] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const STORAGE_KEY = "sensei_skill_gap";

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { results: r, jobDesc: jd } = JSON.parse(saved);
      setResults(r);
      setJobDesc(jd);
    }
  }, []);

  useEffect(() => {
    if (results) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ results, jobDesc }));
    }
  }, [results]);

  const handleAnalyze = async () => {
    if (!jobDesc.trim()) {
      toast.error("Please paste a job description first.");
      return;
    }
    setLoading(true);
    try {
      const data = await analyzeSkillGap(jobDesc);
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <div className="relative rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 transition-colors bg-muted/10 p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <label className="text-sm font-semibold">
            Paste the Job Description
          </label>
          <button
            onClick={() => setJobDesc(EXAMPLE_JD)}
            className="ml-auto text-xs text-primary hover:underline"
          >
            Try example →
          </button>
        </div>
        <Textarea
          placeholder="Paste the full job description here — requirements, skills, responsibilities..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          className="min-h-[200px] border-0 bg-transparent p-0 resize-none focus-visible:ring-0 text-sm"
        />
        {jobDesc && (
          <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
            {jobDesc.split(" ").filter(Boolean).length} words
          </p>
        )}
      </div>
      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleAnalyze}
          disabled={loading}
          className="flex-1 h-11 text-sm font-semibold gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing your profile...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analyze Skill Gap
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
              ✓ Last saved result — click Analyze to refresh
            </p>
            <div className="flex-1 h-px bg-border" />
          </div>
          <SkillGapResults results={results} />
          <SkillGapExtras results={{ ...results, jobDesc }} />
        </>
      )}
    </div>
  );
}
