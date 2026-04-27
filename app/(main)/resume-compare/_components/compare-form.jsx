"use client";

import { useState, useRef } from "react";
import { compareResume, compareResumeVsResume } from "@/actions/resume-compare";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CheckCircle, XCircle, Upload, FileText, X } from "lucide-react";
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

// ─── PDF Upload Box ───────────────────────────────────────────────
function PDFUploadBox({ label, file, onFile, onClear }) {
  const [dragOver, setDragOver] = useState(false);
  const ref = useRef(null);

  const extract = async (f) => {
    if (f.type !== "application/pdf") {
      toast.error("Only PDF files supported.");
      return;
    }
    const formData = new FormData();
    formData.append("pdf", f);
    const res = await fetch("/api/parse-pdf", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Failed to parse PDF");
    const data = await res.json();
    if (!data.text || data.text.trim().length < 50) {
      throw new Error("Could not extract enough text from PDF.");
    }
    return data.text.trim();
  };

  const handleFile = async (f) => {
    try {
      const text = await extract(f);
      onFile(f, text);
      toast.success(`${label} extracted!`);
    } catch (err) {
      toast.error(err.message || "Failed to read PDF.");
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      onClick={() => !file && ref.current?.click()}
      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all
        ${dragOver ? "border-primary bg-primary/10" : "border-muted-foreground/30 hover:border-primary hover:bg-muted/50"}
        ${file ? "cursor-default" : "cursor-pointer"}
      `}
    >
      <input ref={ref} type="file" accept=".pdf" className="hidden"
        onChange={(e) => { const f = e.target.files[0]; if (f) handleFile(f); }} />

      {file ? (
        <div className="flex items-center justify-center gap-3">
          <FileText className="h-6 w-6 text-green-500" />
          <div className="text-left">
            <p className="font-medium text-sm">{file.name}</p>
            <p className="text-xs text-muted-foreground">Extracted ✓</p>
          </div>
          <Button variant="ghost" size="icon" className="text-red-500"
            onClick={(e) => { e.stopPropagation(); onClear(); }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <Upload className="h-6 w-6 text-muted-foreground" />
          <p className="font-medium text-sm">{label}</p>
          <p className="text-xs text-muted-foreground">Drop PDF or click to browse</p>
        </div>
      )}
    </div>
  );
}

// ─── Results for Resume vs JD ─────────────────────────────────────
function ResumeVsJDResults({ results }) {
  return (
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

      {results.weakSections?.length > 0 && (
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
            <Badge key={kw} variant="secondary"
              className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">{kw}</Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Results for Resume vs Resume ─────────────────────────────────
function ResumeVsResumeResults({ results }) {
  return (
    <div className="space-y-5 mt-4">
      {/* Scores */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { label: "Resume 1", score: results.resume1Score, verdict: results.resume1Verdict },
          { label: "Resume 2", score: results.resume2Score, verdict: results.resume2Verdict },
        ].map((r) => (
          <Card key={r.label}>
            <CardContent className="pt-6 text-center">
              <p className="text-sm font-semibold text-muted-foreground mb-1">{r.label}</p>
              <p className={`text-4xl font-bold ${verdictColor[r.verdict]}`}>
                {r.score}<span className="text-lg text-muted-foreground">/100</span>
              </p>
              <Badge className={`mt-2 ${verdictColor[r.verdict]}`}>{r.verdict}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Winner */}
      <Card className="border-primary">
        <CardContent className="pt-6 text-center">
          <p className="text-lg font-bold">🏆 {results.winner}</p>
          <p className="text-sm text-muted-foreground mt-1">{results.winnerReason}</p>
        </CardContent>
      </Card>

      {/* What Resume 1 is missing that Resume 2 has */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <XCircle className="h-4 w-4 text-orange-500" />
            Resume 1 is missing (that Resume 2 has)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {results.resume1Missing.map((item, i) => (
            <div key={i} className="border rounded-lg p-3">
              <p className="font-semibold text-sm">{item.point}</p>
              <p className="text-xs text-muted-foreground mt-1">💡 {item.suggestion}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* What Resume 2 is missing that Resume 1 has */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <XCircle className="h-4 w-4 text-blue-500" />
            Resume 2 is missing (that Resume 1 has)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {results.resume2Missing.map((item, i) => (
            <div key={i} className="border rounded-lg p-3">
              <p className="font-semibold text-sm">{item.point}</p>
              <p className="text-xs text-muted-foreground mt-1">💡 {item.suggestion}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Both missing */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            Both Resumes Are Missing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {results.bothMissing.map((item, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <span className="text-red-500">✗</span>
              <span className="text-muted-foreground">{item}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Common Strengths */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Strengths in Both Resumes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {results.commonStrengths.map((item, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <span className="text-green-500">✓</span>
              <span className="text-muted-foreground">{item}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export function CompareForm() {
  const [activeTab, setActiveTab] = useState("paste");

  // Mode 1 & 2 — Resume vs JD
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mode 3 — Resume vs Resume
  const [resume1Text, setResume1Text] = useState("");
  const [resume2Text, setResume2Text] = useState("");
  const [resume1File, setResume1File] = useState(null);
  const [resume2File, setResume2File] = useState(null);
  const [rvResults, setRvResults] = useState(null);
  const [rvLoading, setRvLoading] = useState(false);

  const handleCompare = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast.error("Please provide your resume and job description.");
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

  const handleResumeVsResume = async () => {
    if (!resume1Text.trim() || !resume2Text.trim()) {
      toast.error("Please provide both resumes.");
      return;
    }
    setRvLoading(true);
    try {
      const data = await compareResumeVsResume({ resume1Text, resume2Text });
      setRvResults(data);
    } catch (err) {
      toast.error(err.message || "Comparison failed.");
    } finally {
      setRvLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="paste" onValueChange={(v) => { setActiveTab(v); setResults(null); setRvResults(null); }}>
        <TabsList className="w-full">
          <TabsTrigger value="paste" className="flex-1">📝 Paste Resume vs JD</TabsTrigger>
          <TabsTrigger value="pdf" className="flex-1">📄 Upload PDF vs JD</TabsTrigger>
          <TabsTrigger value="rvr" className="flex-1">⚖️ Resume vs Resume</TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Paste Resume vs JD ── */}
        <TabsContent value="paste" className="space-y-4 mt-4">
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
          {results && <ResumeVsJDResults results={results} />}
        </TabsContent>

        {/* ── Tab 2: Upload PDF vs JD ── */}
        <TabsContent value="pdf" className="space-y-4 mt-4">
          <PDFUploadBox
            label="Drop your Resume PDF here"
            file={resumeFile}
            onFile={(f, text) => { setResumeFile(f); setResumeText(text); }}
            onClear={() => { setResumeFile(null); setResumeText(""); }}
          />
          <div className="space-y-1">
            <Label>Job Description *</Label>
            <Textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
          <Button onClick={handleCompare} disabled={loading || !resumeFile} className="w-full">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Comparing...</> : "Compare PDF Resume vs Job Description"}
          </Button>
          {results && <ResumeVsJDResults results={results} />}
        </TabsContent>

        {/* ── Tab 3: Resume vs Resume ── */}
        <TabsContent value="rvr" className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="font-semibold">Resume 1</Label>
              <PDFUploadBox
                label="Drop Resume 1 PDF"
                file={resume1File}
                onFile={(f, text) => { setResume1File(f); setResume1Text(text); }}
                onClear={() => { setResume1File(null); setResume1Text(""); }}
              />
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">OR paste</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <Textarea
                placeholder="Paste Resume 1 text here..."
                value={resume1Text}
                onChange={(e) => setResume1Text(e.target.value)}
                className="min-h-[180px]"
              />
            </div>
            <div className="space-y-3">
              <Label className="font-semibold">Resume 2</Label>
              <PDFUploadBox
                label="Drop Resume 2 PDF"
                file={resume2File}
                onFile={(f, text) => { setResume2File(f); setResume2Text(text); }}
                onClear={() => { setResume2File(null); setResume2Text(""); }}
              />
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">OR paste</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <Textarea
                placeholder="Paste Resume 2 text here..."
                value={resume2Text}
                onChange={(e) => setResume2Text(e.target.value)}
                className="min-h-[180px]"
              />
            </div>
          </div>
          <Button onClick={handleResumeVsResume} disabled={rvLoading} className="w-full">
            {rvLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Comparing Resumes...</> : "Compare Resume 1 vs Resume 2"}
          </Button>
          {rvResults && <ResumeVsResumeResults results={rvResults} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}