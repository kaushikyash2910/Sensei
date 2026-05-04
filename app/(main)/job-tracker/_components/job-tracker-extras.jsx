"use client";

import { useState } from "react";
import { generateFollowUp, compareOffers, getInterviewQuestions } from "@/actions/job-tracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2, Copy, CheckCheck, Calendar, Mail,
  BarChart2, GraduationCap, ChevronDown, ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { format, addDays } from "date-fns";

// ── Deadline Calendar ──────────────────────────────────────────
function DeadlineCalendar({ jobs }) {
  const jobsWithDeadlines = jobs
    .filter((j) => j.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const today = new Date();

  const urgencyColor = (deadline) => {
    const days = Math.floor((new Date(deadline) - today) / (1000 * 60 * 60 * 24));
    if (days < 0) return "border-red-400 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400";
    if (days <= 3) return "border-orange-400 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400";
    if (days <= 7) return "border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400";
    return "border-blue-400 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400";
  };

  const daysLabel = (deadline) => {
    const days = Math.floor((new Date(deadline) - today) / (1000 * 60 * 60 * 24));
    if (days < 0) return `${Math.abs(days)}d overdue`;
    if (days === 0) return "Due today!";
    if (days === 1) return "Due tomorrow";
    return `${days} days left`;
  };

  if (jobsWithDeadlines.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Calendar className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p className="font-semibold">No deadlines set</p>
        <p className="text-sm mt-1">Add deadlines to your job applications to see them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {jobsWithDeadlines.length} application{jobsWithDeadlines.length > 1 ? "s" : ""} with deadlines.
      </p>
      {jobsWithDeadlines.map((job) => (
        <div key={job.id} className={`border-l-4 rounded-xl p-4 ${urgencyColor(job.deadline)}`}>
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="font-semibold text-sm">{job.company}</p>
              <p className="text-xs opacity-80">{job.role}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">{format(new Date(job.deadline), "dd MMM yyyy")}</p>
              <p className="text-xs font-semibold">{daysLabel(job.deadline)}</p>
            </div>
          </div>
          <Badge variant="outline" className="mt-2 text-xs">{job.status}</Badge>
        </div>
      ))}
    </div>
  );
}

// ── Follow-up Generator ────────────────────────────────────────
function FollowUpGenerator({ jobs }) {
  const [selectedJob, setSelectedJob] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const eligibleJobs = jobs.filter((j) => j.status === "Applied" || j.status === "Interview");

  const handleGenerate = async () => {
    if (!selectedJob) { toast.error("Please select a job first."); return; }
    const job = jobs.find((j) => j.id === selectedJob);
    if (!job) return;
    setLoading(true);
    try {
      const data = await generateFollowUp({
        company: job.company,
        role: job.role,
        applyDate: job.applyDate || job.createdAt,
        status: job.status,
      });
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Failed to generate follow-up.");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(results.emailMessage);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const urgencyColor = {
    High: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    Low: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select a job application and get an AI-generated follow-up email with timing advice.
      </p>

      <div className="space-y-1">
        <select
          className="w-full border rounded-lg px-3 py-2 bg-background text-sm"
          value={selectedJob}
          onChange={(e) => { setSelectedJob(e.target.value); setResults(null); }}
        >
          <option value="">Select a job application...</option>
          {eligibleJobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.company} — {job.role} ({job.status})
            </option>
          ))}
        </select>
      </div>

      <Button onClick={handleGenerate} disabled={loading || !selectedJob} className="w-full gap-2">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Generating...</> : <><Mail className="h-4 w-4" />Generate Follow-up Email</>}
      </Button>

      {results && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={urgencyColor[results.urgency]}>
              {results.urgency} Urgency
            </Badge>
            <span className="text-xs text-muted-foreground">Best time: {results.timing}</span>
          </div>

          <Card className={results.shouldFollowUp ? "border-emerald-200 dark:border-emerald-800/50" : "border-red-200 dark:border-red-800/50"}>
            <CardContent className="pt-4">
              <p className={`text-sm font-semibold ${results.shouldFollowUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {results.shouldFollowUp ? "✅ You should follow up" : "⏳ Wait a bit longer"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{results.recommendation}</p>
            </CardContent>
          </Card>

          {results.shouldFollowUp && (
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm">📧 Follow-up Email</CardTitle>
                  <p className="text-xs text-muted-foreground">Subject: {results.emailSubject}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copy}>
                  {copied ? <CheckCheck className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">
                  {results.emailMessage}
                </pre>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">💡 Tips</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {results.tips?.map((tip, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="text-primary font-bold">{i + 1}.</span>
                  <span className="text-muted-foreground">{tip}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// ── Interview Prep Auto-Launcher ───────────────────────────────
function InterviewPrepLauncher({ jobs }) {
  const [selectedJob, setSelectedJob] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedQ, setExpandedQ] = useState({});

  const interviewJobs = jobs.filter((j) => j.status === "Interview");

  const handleGenerate = async () => {
    if (!selectedJob) { toast.error("Please select a job."); return; }
    const job = jobs.find((j) => j.id === selectedJob);
    if (!job) return;
    setLoading(true);
    try {
      const data = await getInterviewQuestions({ company: job.company, role: job.role });
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  };

  const categoryColor = {
    Technical: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    Behavioral: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    HR: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
  };

  return (
    <div className="space-y-4">
      {interviewJobs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <GraduationCap className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No interviews yet</p>
          <p className="text-sm mt-1">Move a job to "Interview" status to auto-launch prep.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Select a job in Interview stage — get instant AI prep questions for that company and role.
          </p>
          <select
            className="w-full border rounded-lg px-3 py-2 bg-background text-sm"
            value={selectedJob}
            onChange={(e) => { setSelectedJob(e.target.value); setResults(null); }}
          >
            <option value="">Select interview job...</option>
            {interviewJobs.map((job) => (
              <option key={job.id} value={job.id}>{job.company} — {job.role}</option>
            ))}
          </select>

          <Button onClick={handleGenerate} disabled={loading || !selectedJob} className="w-full gap-2">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Generating...</> : <><GraduationCap className="h-4 w-4" />Launch Interview Prep</>}
          </Button>

          {results && (
            <div className="space-y-3">
              {results.companySpecificTip && (
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="pt-4">
                    <p className="text-xs font-semibold mb-1">🎯 Company-Specific Tip</p>
                    <p className="text-sm text-muted-foreground">{results.companySpecificTip}</p>
                  </CardContent>
                </Card>
              )}
              {results.questions?.map((q, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpandedQ((p) => ({ ...p, [i]: !p[i] }))}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        <span className="text-primary font-bold text-sm shrink-0">{i + 1}.</span>
                        <p className="text-sm font-medium">{q.question}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Badge className={`text-xs ${categoryColor[q.category] || ""}`}>{q.category}</Badge>
                        {expandedQ[i] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </div>
                    </div>
                  </CardHeader>
                  {expandedQ[i] && (
                    <CardContent>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs font-semibold mb-1">💡 How to Answer</p>
                        <p className="text-xs text-muted-foreground">{q.tip}</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Offer Comparison Tool ──────────────────────────────────────
function OfferComparison({ jobs }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const offerJobs = jobs.filter((j) => j.status === "Offer");

  const verdictColor = {
    Recommended: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    Consider: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    Pass: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  };

  const handleCompare = async () => {
    if (offerJobs.length < 2) { toast.error("You need at least 2 offers to compare."); return; }
    setLoading(true);
    try {
      const data = await compareOffers(offerJobs.map((j) => ({
        company: j.company, role: j.role, salary: j.notes, notes: j.notes,
      })));
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Comparison failed.");
    } finally {
      setLoading(false);
    }
  };

  const ScoreBar = ({ score, label }) => (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold">{score}/10</span>
      </div>
      <div className="w-full bg-muted rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${score >= 8 ? "bg-emerald-500" : score >= 6 ? "bg-amber-500" : "bg-rose-500"}`}
          style={{ width: `${score * 10}%` }} />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {offerJobs.length < 2 ? (
        <div className="text-center py-8 text-muted-foreground">
          <BarChart2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Need at least 2 offers</p>
          <p className="text-sm mt-1">
            {offerJobs.length === 0
              ? "Move jobs to 'Offer' status to compare them."
              : "You have 1 offer — move another job to 'Offer' to compare."}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Comparing {offerJobs.length} offers: {offerJobs.map((j) => j.company).join(", ")}
          </p>
          <Button onClick={handleCompare} disabled={loading} className="w-full gap-2">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Comparing...</> : <><BarChart2 className="h-4 w-4" />Compare My Offers</>}
          </Button>

          {results && (
            <div className="space-y-4">
              <Card className="border-primary">
                <CardContent className="pt-6 text-center">
                  <p className="text-lg font-bold">🏆 {results.winner} wins!</p>
                  <p className="text-sm text-muted-foreground mt-1">{results.winnerReason}</p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                {results.comparison?.map((offer, i) => (
                  <Card key={i} className={results.winner === offer.company ? "border-primary ring-1 ring-primary" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{offer.company}</CardTitle>
                        <div className="flex items-center gap-1">
                          <span className={`text-xl font-black ${offer.overallScore >= 8 ? "text-emerald-500" : offer.overallScore >= 6 ? "text-amber-500" : "text-rose-500"}`}>
                            {offer.overallScore}
                          </span>
                          <Badge className={`text-xs ${verdictColor[offer.verdict] || ""}`}>{offer.verdict}</Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{offer.role}</p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <ScoreBar score={offer.salaryScore} label="Salary" />
                      <ScoreBar score={offer.growthScore} label="Growth" />
                      <ScoreBar score={offer.stabilityScore} label="Stability" />
                      <ScoreBar score={offer.cultureScore} label="Culture" />
                      <div className="pt-2 space-y-1">
                        {offer.pros?.map((p, j) => (
                          <p key={j} className="text-xs text-muted-foreground">✓ {p}</p>
                        ))}
                        {offer.cons?.map((c, j) => (
                          <p key={j} className="text-xs text-rose-500">✗ {c}</p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="pt-4 space-y-2">
                  <p className="text-xs font-semibold">🤝 Negotiation Tip</p>
                  <p className="text-sm text-muted-foreground">{results.negotiationTip}</p>
                  <p className="text-xs font-semibold mt-2">📋 Final Advice</p>
                  <p className="text-sm text-muted-foreground">{results.finalAdvice}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────
export function JobTrackerExtras({ jobs }) {
  return (
    <Tabs defaultValue="calendar">
      <TabsList className="w-full flex-wrap h-auto gap-1 p-1 mb-6">
        <TabsTrigger value="calendar" className="flex-1 text-xs">📅 Deadlines</TabsTrigger>
        <TabsTrigger value="followup" className="flex-1 text-xs">📧 Follow-up</TabsTrigger>
        <TabsTrigger value="prep" className="flex-1 text-xs">🎤 Interview Prep</TabsTrigger>
        <TabsTrigger value="offers" className="flex-1 text-xs">⚖️ Compare Offers</TabsTrigger>
      </TabsList>
      <TabsContent value="calendar"><DeadlineCalendar jobs={jobs} /></TabsContent>
      <TabsContent value="followup"><FollowUpGenerator jobs={jobs} /></TabsContent>
      <TabsContent value="prep"><InterviewPrepLauncher jobs={jobs} /></TabsContent>
      <TabsContent value="offers"><OfferComparison jobs={jobs} /></TabsContent>
    </Tabs>
  );
}