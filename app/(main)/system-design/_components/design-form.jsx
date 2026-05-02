"use client";

import { useState, useEffect } from "react";
import { explainSystemDesign } from "@/actions/system-design";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const POPULAR_TOPICS = [
  "Design Twitter", "Design YouTube", "Design WhatsApp",
  "Design Uber", "Design Netflix", "Design URL Shortener",
  "Design Instagram", "Design Google Drive",
];

const STORAGE_KEY = "sensei_system_design";

export function DesignForm() {
  const [topic, setTopic] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Mid-level");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { results: r, topic: t, experienceLevel: e } = JSON.parse(saved);
      setResults(r); setTopic(t); setExperienceLevel(e);
    }
  }, []);

  useEffect(() => {
    if (results) localStorage.setItem(STORAGE_KEY, JSON.stringify({ results, topic, experienceLevel }));
  }, [results]);

  const handleExplain = async (t = topic) => {
    if (!t.trim()) { toast.error("Please enter a system design topic."); return; }
    setLoading(true);
    setTopic(t);
    try {
      const data = await explainSystemDesign({ topic: t, experienceLevel });
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Failed to explain design.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-1 md:col-span-2">
          <Label>System Design Topic *</Label>
          <Input placeholder='e.g. "Design Twitter" or "Design a URL Shortener"'
            value={topic} onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleExplain()} />
        </div>
        <div className="space-y-1">
          <Label>Your Level</Label>
          <Select value={experienceLevel} onValueChange={setExperienceLevel}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Junior">Junior (1-3 years)</SelectItem>
              <SelectItem value="Mid-level">Mid-level (3-5 years)</SelectItem>
              <SelectItem value="Senior">Senior (5+ years)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Popular Topics */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Popular topics:</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TOPICS.map((t) => (
            <button key={t} onClick={() => handleExplain(t)}
              className="text-xs border rounded-full px-3 py-1 hover:bg-primary hover:text-primary-foreground transition-all">
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => handleExplain()} disabled={loading} className="flex-1">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Explaining...</> : "Explain System Design"}
        </Button>
        {results && (
          <Button variant="outline" onClick={() => { setResults(null); localStorage.removeItem(STORAGE_KEY); }}>
            Clear
          </Button>
        )}
      </div>

      {results && (
        <>
          <p className="text-xs text-muted-foreground text-center">
            ✓ Showing your last saved result — click Explain to refresh
          </p>
          <div className="space-y-5">
            <Card className="border-primary">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-1">{results.title}</h2>
                <p className="text-sm text-muted-foreground">{results.overview}</p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">✅ Functional Requirements</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  {results.requirements.functional.map((r, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <span className="text-green-500">•</span>
                      <span className="text-muted-foreground">{r}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">⚡ Non-Functional Requirements</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  {results.requirements.nonFunctional.map((r, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <span className="text-blue-500">•</span>
                      <span className="text-muted-foreground">{r}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Estimations */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">📊 Scale Estimations</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { label: "Users", value: results.estimations.users },
                    { label: "Storage", value: results.estimations.storage },
                    { label: "Bandwidth", value: results.estimations.bandwidth },
                  ].map((e) => (
                    <div key={e.label} className="border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">{e.label}</p>
                      <p className="font-bold text-sm mt-1">{e.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Components */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">🧩 System Components</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {results.components.map((comp, i) => (
                  <div key={i} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm">{comp.name}</p>
                      <Badge variant="outline" className="text-xs">{comp.technology}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{comp.purpose}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Architecture */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">🏗️ Architecture & Data Flow</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{results.architecture}</p>
              </CardContent>
            </Card>

            {/* Tradeoffs */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">⚖️ Key Design Tradeoffs</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {results.tradeoffs.map((t, i) => (
                  <div key={i} className="border rounded-lg p-3">
                    <p className="font-semibold text-sm mb-1">{t.decision}</p>
                    <div className="grid md:grid-cols-2 gap-2">
                      <p className="text-xs text-green-600">✓ {t.pros}</p>
                      <p className="text-xs text-red-500">✗ {t.cons}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Scaling + Tips + Mistakes */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">📈 Scaling Strategies</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  {results.scalingStrategies.map((s, i) => (
                    <p key={i} className="text-xs text-muted-foreground">• {s}</p>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">💡 Interview Tips</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  {results.interviewTips.map((t, i) => (
                    <p key={i} className="text-xs text-muted-foreground">{i + 1}. {t}</p>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">⚠️ Common Mistakes</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  {results.commonMistakes.map((m, i) => (
                    <p key={i} className="text-xs text-muted-foreground">✗ {m}</p>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Follow Up Questions */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">❓ Likely Follow-up Questions</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {results.followUpQuestions.map((q, i) => (
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