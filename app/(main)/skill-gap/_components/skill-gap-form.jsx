"use client";

import { useState } from "react";
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

      <Button onClick={handleAnalyze} disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Analyze Skill Gap"
        )}
      </Button>

      {results && <SkillGapResults results={results} />}
    </div>
  );
}