"use client";

import { useState, useRef } from "react";
import { checkResumeScore } from "@/actions/resume-score";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { ScoreResults } from "./score-results";

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
        toast.error("Could not extract enough text from this PDF. Try pasting manually.");
        return;
      }

      setResumeText(data.text.trim());
      setUploadedFile(file);
      toast.success("PDF extracted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to read PDF. Please paste your resume text manually.");
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
      {/* PDF Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploadedFile && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all
          ${dragOver
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/30 hover:border-primary hover:bg-muted/50"
          }
          ${uploadedFile ? "cursor-default" : "cursor-pointer"}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {pdfLoading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Reading PDF...</p>
          </div>
        ) : uploadedFile ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="h-8 w-8 text-green-500" />
            <div className="text-left">
              <p className="font-medium text-sm">{uploadedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(uploadedFile.size / 1024).toFixed(1)} KB · Text extracted ✓
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 text-red-500 hover:text-red-600"
              onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium">Drop your resume PDF here</p>
            <p className="text-sm text-muted-foreground">or click to browse your files</p>
            <p className="text-xs text-muted-foreground mt-1">PDF files only</p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">OR paste manually</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Manual Text */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Paste Resume Text</label>
        <Textarea
          placeholder="Paste your resume content here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          className="min-h-[180px]"
        />
      </div>

      <Button
        onClick={handleCheck}
        disabled={loading || pdfLoading}
        className="w-full"
      >
        {loading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</>
        ) : "Check ATS Score"}
      </Button>

      {results && <ScoreResults results={results} />}
    </div>
  );
}