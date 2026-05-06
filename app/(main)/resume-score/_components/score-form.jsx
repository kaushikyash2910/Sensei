"use client";

import { useState, useRef } from "react";
import { checkResumeScore } from "@/actions/resume-score";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, FileText, X, Sparkles, Shield } from "lucide-react";
import { toast } from "sonner";
import { ScoreResults } from "./score-results";

const CHECKLIST = [
  "ATS compatibility check",
  "Keyword density analysis",
  "Section-by-section scoring",
  "Quick win suggestions",
  "Missing keyword detection",
];

export function ScoreForm() {
  const [resumeText, setResumeText] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const extractTextFromPDF = async (file) => {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported.");
      return;
    }
    setPdfLoading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to parse PDF");
      const data = await res.json();
      if (!data.text || data.text.trim().length < 50) {
        toast.error("Could not extract enough text. Try pasting manually.");
        return;
      }
      setResumeText(data.text.trim());
      setUploadedFile(file);
      toast.success("PDF extracted successfully!");
    } catch (err) {
      toast.error("Failed to read PDF. Please paste manually.");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) extractTextFromPDF(file);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) extractTextFromPDF(file);
  };
  const handleRemoveFile = () => {
    setUploadedFile(null);
    setResumeText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCheck = async () => {
    if (!resumeText.trim()) {
      toast.error("Please upload a PDF or paste your resume text first.");
      return;
    }
    setLoading(true);
    try {
      const data = await checkResumeScore(resumeText);
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* What We Check */}
      {!results && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-2">
          {CHECKLIST.map((item) => (
            <div
              key={item}
              className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 rounded-lg px-2 py-1.5"
            >
              <Shield className="h-3 w-3 text-primary shrink-0" />
              {item}
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploadedFile && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all
          ${
            dragOver
              ? "border-primary bg-primary/10 scale-[1.01]"
              : "border-muted-foreground/20 hover:border-primary/60 hover:bg-muted/30"
          }
          ${uploadedFile ? "cursor-default" : "cursor-pointer"}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {pdfLoading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Extracting text from PDF...</p>
              <p className="text-xs text-muted-foreground mt-1">
                This takes a few seconds
              </p>
            </div>
          </div>
        ) : uploadedFile ? (
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
              <FileText className="h-6 w-6 text-emerald-500" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">{uploadedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
              <p className="text-xs text-emerald-500 mt-0.5">
                ✓ Text extracted successfully
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-400 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Upload className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">Drop your resume PDF here</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                or click to browse your files
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              PDF only · Instant extraction
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground bg-background px-2">
          OR paste manually
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Manual Text */}
      <div className="relative rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 transition-colors bg-muted/10 p-5">
        <Textarea
          placeholder="Paste your resume content here — work experience, skills, education, projects..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          className="min-h-[160px] border-0 bg-transparent p-0 resize-none focus-visible:ring-0 text-sm"
        />
        {resumeText && (
          <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
            {resumeText.split(" ").filter(Boolean).length} words ·{" "}
            {resumeText.length} characters
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleCheck}
          disabled={loading || pdfLoading}
          className="flex-1 h-11 font-semibold gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing Resume...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Check ATS Score
            </>
          )}
        </Button>
        {results && (
          <Button
            variant="outline"
            className="h-11"
            onClick={() => setResults(null)}
          >
            Clear
          </Button>
        )}
      </div>

      {results && (
        <>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <p className="text-xs text-muted-foreground px-2">
              Analysis complete
            </p>
            <div className="flex-1 h-px bg-border" />
          </div>
          <ScoreResults results={results} />
        </>
      )}
    </div>
  );
}
