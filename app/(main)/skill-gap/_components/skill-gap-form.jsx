"use client";

import { useState, useEffect } from "react";
import { analyzeSkillGap } from "@/actions/skill-gap";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SkillGapResults } from "./skill-gap-results";

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
      <div className="space-y-2">
        <label className="text-sm font-medium">Paste the Job Description</label>
        <Textarea
          placeholder="Paste the full job description here..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          className="min-h-[200px]"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleAnalyze} disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Skill Gap"
          )}
        </Button>
        {results && (
          <Button
            variant="outline"
            onClick={() => {
              setResults(null);
              localStorage.removeItem(STORAGE_KEY);
            }}
          >
            Clear
          </Button>
        )}
      </div>
      
      {results && (
  <>
    <p className="text-xs text-muted-foreground text-center">
      ✓ Showing your last saved result — click Analyze Skill Gap to refresh
    </p>
    <SkillGapResults results={results} />
  </>
)}
    </div>
  );
}
