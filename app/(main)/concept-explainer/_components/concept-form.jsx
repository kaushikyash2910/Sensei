"use client";

import { useState, useEffect } from "react";
import { explainConcept } from "@/actions/concept-explainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "sensei_concept_explainer";
const LEVELS = [
  { value: "ELI5 (Explain Like I'm 5)", label: "ELI5 🧒", desc: "Super simple" },
  { value: "Beginner Developer", label: "Beginner 👨‍💻", desc: "Just started coding" },
  { value: "Intermediate Developer", label: "Intermediate 🚀", desc: "1-3 years exp" },
  { value: "Senior Developer", label: "Senior 🧠", desc: "5+ years exp" },
];

const POPULAR = ["WebSockets", "CAP Theorem", "ACID Properties", "Load Balancing",
  "Microservices", "Docker", "JWT Authentication", "REST vs GraphQL",
  "Database Indexing", "Consistent Hashing"];

export function ConceptForm() {
  const [concept, setConcept] = useState("");
  const [level, setLevel] = useState("Intermediate Developer");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { results: r, concept: c, level: l } = JSON.parse(saved);
      setResults(r); setConcept(c); setLevel(l);
    }
  }, []);

  useEffect(() => {
    if (results) localStorage.setItem(STORAGE_KEY, JSON.stringify({ results, concept, level }));
  }, [results]);

  const handleExplain = async (c = concept) => {
    if (!c.trim()) { toast.error("Please enter a concept."); return; }
    setConcept(c);
    setLoading(true);
    try {
      const data = await explainConcept({ concept: c, level });
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Failed to explain concept.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Level Selector */}
      <div className="space-y-2">
        <Label>Explain at what level?</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {LEVELS.map((l) => (
            <button key={l.value} onClick={() => setLevel(l.value)}
              className={`border rounded-lg p-3 text-left transition-all ${
                level === l.value ? "border-primary bg-primary/10" : "hover:border-primary/50"
              }`}>
              <p className="font-medium text-sm">{l.label}</p>
              <p className="text-xs text-muted-foreground">{l.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <Label>Tech Concept *</Label>
        <div className="flex gap-2">
          <Input placeholder='e.g. "WebSockets", "CAP Theorem", "Docker"'
            value={concept} onChange={(e) => setConcept(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleExplain()} className="flex-1" />
          <Button onClick={() => handleExplain()} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Explain"}
          </Button>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">Popular concepts:</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR.map((c) => (
            <button key={c} onClick={() => handleExplain(c)}
              className="text-xs border rounded-full px-3 py-1 hover:bg-primary hover:text-primary-foreground transition-all">
              {c}
            </button>
          ))}
        </div>
      </div>

      {results && (
        <>
          <p className="text-xs text-muted-foreground text-center">✓ Showing last saved result</p>
          <div className="space-y-4">
            <Card className="border-primary">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h2 className="text-xl font-bold">{results.concept}</h2>
                  <Badge variant="outline">{results.category}</Badge>
                </div>
                <p className="font-medium">{results.oneLiner}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">📖 Explanation</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{results.explanation}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">🎯 Real-World Analogy</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">{results.analogy}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">💻 Example</CardTitle></CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-3 rounded-lg font-mono whitespace-pre-wrap">{results.example}</pre>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">⚠️ Common Misconceptions</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  {results.commonMisconceptions?.map((m, i) => (
                    <p key={i} className="text-xs text-muted-foreground">✗ {m}</p>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">🗺️ What to Learn Next</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  {results.learnNextOrder?.map((l, i) => (
                    <div key={i} className="flex gap-2 text-xs">
                      <span className="text-primary font-bold">{i + 1}.</span>
                      <span className="text-muted-foreground">{l}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">❓ Interview Questions</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {results.interviewQuestions?.map((q, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="text-primary font-bold">{i + 1}.</span>
                    <span className="text-muted-foreground">{q}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}