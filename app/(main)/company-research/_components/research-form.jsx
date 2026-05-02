"use client";

import { useState, useEffect } from "react";
import { researchCompany } from "@/actions/company-research";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Building2, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const verdictColor = {
  "Great Place": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Good Place": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Average": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "Approach with Caution": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const sentimentColor = {
  Positive: "text-green-500",
  Neutral: "text-yellow-500",
  Negative: "text-red-500",
};

const STORAGE_KEY = "sensei_company_research";

export function ResearchForm() {
  const [form, setForm] = useState({ companyName: "", role: "" });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { results: r, form: f } = JSON.parse(saved);
      setResults(r);
      setForm(f);
    }
  }, []);

  useEffect(() => {
    if (results) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ results, form }));
    }
  }, [results]);

  const handleResearch = async () => {
    if (!form.companyName.trim()) {
      toast.error("Please enter a company name.");
      return;
    }
    setLoading(true);
    try {
      const data = await researchCompany(form);
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Research failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Company Name *</Label>
          <Input placeholder="e.g. Google, Flipkart, Infosys"
            value={form.companyName}
            onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))} />
        </div>
        <div className="space-y-1">
          <Label>Role You're Applying For</Label>
          <Input placeholder="e.g. Software Engineer"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleResearch} disabled={loading} className="flex-1">
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Researching...</>
          ) : (
            <><Building2 className="mr-2 h-4 w-4" />Research Company</>
          )}
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
            ✓ Showing your last saved result — click Research to refresh
          </p>

          <div className="space-y-5">
            {/* Header */}
            <Card className="border-primary">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="text-2xl font-bold">{results.companyName}</h2>
                    <p className="text-muted-foreground text-sm">{results.industry} · {results.headquarters} · {results.size}</p>
                    <p className="text-sm mt-2">{results.overview}</p>
                  </div>
                  <Badge className={`${verdictColor[results.verdict]} text-sm px-3 py-1`}>
                    {results.verdict}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Culture + Tech Stack */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">🏢 Culture</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{results.culture.summary}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">Work-Life Balance:</span>
                    <Badge variant="outline">{results.culture.workLifeBalance}</Badge>
                    <Badge variant="outline">⭐ {results.culture.rating}/5</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {results.culture.values.map((v) => (
                      <Badge key={v} variant="secondary" className="text-xs">{v}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">💻 Tech Stack</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {results.techStack.map((tech) => (
                    <Badge key={tech} variant="outline">{tech}</Badge>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Salary */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">💰 Salary Ranges</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { label: "Fresher", value: results.salaryRange.fresher },
                    { label: "Mid Level", value: results.salaryRange.midLevel },
                    { label: "Senior", value: results.salaryRange.senior },
                  ].map((s) => (
                    <div key={s.label} className="border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="font-bold text-sm mt-1">{s.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interview Process */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">🎤 Interview Process</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {results.interviewProcess.map((round, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{round.round} — {round.type}</p>
                      <p className="text-xs text-muted-foreground">{round.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Glassdoor Sentiment */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  ⭐ Employee Sentiment
                  <Badge variant="outline">{results.glassdoorSentiment.score}/5</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-green-600 mb-2">✓ Pros</p>
                    {results.glassdoorSentiment.pros.map((p, i) => (
                      <p key={i} className="text-sm text-muted-foreground">• {p}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-500 mb-2">✗ Cons</p>
                    {results.glassdoorSentiment.cons.map((c, i) => (
                      <p key={i} className="text-sm text-muted-foreground">• {c}</p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent News */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">📰 Recent News</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {results.recentNews.map((news, i) => (
                  <div key={i} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm">{news.headline}</p>
                      <span className={`text-xs font-medium shrink-0 ${sentimentColor[news.sentiment]}`}>
                        {news.sentiment}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{news.summary}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Interview Tips + Red Flags */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Interview Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {results.interviewTips.map((tip, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <span className="text-primary font-bold">{i + 1}.</span>
                      <span className="text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {results.redFlags?.length > 0 && (
                <Card className="border-red-200 dark:border-red-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Red Flags to Watch
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {results.redFlags.map((flag, i) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <span className="text-red-500">⚠</span>
                        <span className="text-muted-foreground">{flag}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}