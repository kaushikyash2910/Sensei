"use client";

import { useState, useEffect } from "react";
import { explainArchitecture } from "@/actions/architecture-explainer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Copy, CheckCheck, Download } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "sensei_architecture";

export function ArchitectureForm() {
  const [description, setDescription] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { results: r, description: d } = JSON.parse(saved);
      setResults(r); setDescription(d);
    }
  }, []);

  useEffect(() => {
    if (results) localStorage.setItem(STORAGE_KEY, JSON.stringify({ results, description }));
  }, [results]);

  const handleExplain = async () => {
    if (!description.trim()) { toast.error("Please describe your system."); return; }
    setLoading(true);
    try {
      const data = await explainArchitecture({ systemDescription: description });
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Failed to analyze architecture.");
    } finally {
      setLoading(false);
    }
  };

  const copyMarkdown = () => {
    navigator.clipboard.writeText(results.markdownExport);
    setCopied(true);
    toast.success("Markdown copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([results.markdownExport], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${results.systemName.replace(/\s+/g, "-")}-architecture.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Label>Describe Your System *</Label>
        <Textarea
          placeholder="e.g. I built a food delivery app with a React frontend, Node.js backend, PostgreSQL database, Redis cache for sessions, and deployed on AWS with a load balancer..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[150px]"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleExplain} disabled={loading} className="flex-1">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : "Analyze Architecture"}
        </Button>
        {results && (
          <Button variant="outline" onClick={() => { setResults(null); localStorage.removeItem(STORAGE_KEY); }}>Clear</Button>
        )}
      </div>

      {results && (
        <>
          <p className="text-xs text-muted-foreground text-center">✓ Showing last saved result</p>
          <div className="space-y-5">
            <Card className="border-primary">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-xl font-bold">{results.systemName}</h2>
                    <Badge variant="outline" className="mt-1">{results.architectureType}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Scalability Score</p>
                    <p className={`text-2xl font-bold ${results.scalabilityScore >= 8 ? "text-green-500" : results.scalabilityScore >= 6 ? "text-yellow-500" : "text-red-500"}`}>
                      {results.scalabilityScore}/10
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ASCII Diagram */}
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm">🗺️ Architecture Diagram</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyMarkdown}>
                    {copied ? <CheckCheck className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={downloadMarkdown}>
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-4 rounded-lg font-mono overflow-auto whitespace-pre">
                  {results.asciiDiagram}
                </pre>
              </CardContent>
            </Card>

            {/* Components */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">🧩 Components</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {results.components?.map((comp, i) => (
                  <div key={i} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm">{comp.name}</p>
                      <div className="flex gap-1">
                        <Badge variant="secondary" className="text-xs">{comp.type}</Badge>
                        <Badge variant="outline" className="text-xs">{comp.technology}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{comp.purpose}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Data Flow */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">⬇️ Data Flow</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {results.dataFlow?.map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold">
                      {i + 1}
                    </div>
                    <p className="text-sm text-muted-foreground">{step}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Strengths + Weaknesses + Suggestions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm text-green-600">✓ Strengths</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  {results.strengths?.map((s, i) => <p key={i} className="text-xs text-muted-foreground">• {s}</p>)}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm text-red-500">✗ Weaknesses</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  {results.weaknesses?.map((w, i) => <p key={i} className="text-xs text-muted-foreground">• {w}</p>)}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm text-blue-500">💡 Suggestions</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  {results.suggestions?.map((s, i) => <p key={i} className="text-xs text-muted-foreground">{i + 1}. {s}</p>)}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}