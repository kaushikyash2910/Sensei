"use client";

import { useState, useEffect } from "react";
import { generateColdEmail } from "@/actions/cold-email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Copy,
  CheckCheck,
  Sparkles,
  Mail,
  RefreshCw,
  Send,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "sensei_cold_email";

const TEMPLATES = [
  {
    label: "Internship",
    company: "Google",
    role: "Software Engineering Intern",
    hiringManagerName: "",
  },
  {
    label: "Full-time",
    company: "Flipkart",
    role: "Software Engineer",
    hiringManagerName: "",
  },
  {
    label: "Startup",
    company: "Razorpay",
    role: "Backend Engineer",
    hiringManagerName: "",
  },
];

export function EmailForm() {
  const [form, setForm] = useState({
    company: "",
    role: "",
    yourName: "",
    yourBackground: "",
    hiringManagerName: "",
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedFollowup, setCopiedFollowup] = useState(false);
  const [activeEmail, setActiveEmail] = useState("main");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { results: r, form: f } = JSON.parse(saved);
      setResults(r);
      setForm(f);
    }
  }, []);

  useEffect(() => {
    if (results)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ results, form }));
  }, [results]);

  const handleGenerate = async () => {
    if (!form.company || !form.role || !form.yourName || !form.yourBackground) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const data = await generateColdEmail(form);
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Failed to generate email.");
    } finally {
      setLoading(false);
    }
  };

  const copy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "main") {
      setCopiedMain(true);
      setTimeout(() => setCopiedMain(false), 2000);
    } else {
      setCopiedFollowup(true);
      setTimeout(() => setCopiedFollowup(false), 2000);
    }
    toast.success("Copied!");
  };

  const applyTemplate = (t) => {
    setForm((f) => ({
      ...f,
      company: t.company,
      role: t.role,
      hiringManagerName: t.hiringManagerName,
    }));
    toast.success(`Template applied!`);
  };

  return (
    <div className="space-y-6">
      {/* Quick Templates */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quick Templates
        </p>
        <div className="flex gap-2 flex-wrap">
          {TEMPLATES.map((t) => (
            <button
              key={t.label}
              onClick={() => applyTemplate(t)}
              className="text-xs border rounded-full px-3 py-1.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center gap-1"
            >
              <Mail className="h-3 w-3" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          {
            label: "Company Name *",
            key: "company",
            placeholder: "e.g. Google",
          },
          {
            label: "Role *",
            key: "role",
            placeholder: "e.g. Software Engineer",
          },
          {
            label: "Your Name *",
            key: "yourName",
            placeholder: "e.g. Yash Kaushik",
          },
          {
            label: "Hiring Manager Name",
            key: "hiringManagerName",
            placeholder: "e.g. Priya Sharma (optional)",
          },
        ].map(({ label, key, placeholder }) => (
          <div key={key} className="space-y-1">
            <Label>{label}</Label>
            <Input
              placeholder={placeholder}
              value={form[key]}
              onChange={(e) =>
                setForm((f) => ({ ...f, [key]: e.target.value }))
              }
            />
          </div>
        ))}
      </div>

      <div className="relative rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 transition-colors bg-muted/10 p-5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          Your Background *
        </Label>
        <Textarea
          placeholder="e.g. Final year CS student with 2 internships in React and Node.js, built 3 production apps..."
          value={form.yourBackground}
          onChange={(e) =>
            setForm((f) => ({ ...f, yourBackground: e.target.value }))
          }
          className="min-h-[90px] border-0 bg-transparent p-0 resize-none focus-visible:ring-0 text-sm"
        />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="flex-1 h-11 font-semibold gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Email...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Cold Email
            </>
          )}
        </Button>
        {results && (
          <Button
            variant="outline"
            className="h-11 gap-2"
            onClick={() => {
              setResults(null);
              localStorage.removeItem(STORAGE_KEY);
            }}
          >
            <RefreshCw className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {results && (
        <>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <p className="text-xs text-muted-foreground px-2">
              ✓ Last saved result
            </p>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Subject */}
          <div className="relative rounded-xl border bg-muted/20 px-4 py-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Subject Line
            </p>
            <p className="font-semibold text-sm">{results.subject}</p>
          </div>

          {/* Email Toggle */}
          <div className="flex gap-2 p-1 bg-muted/40 rounded-xl">
            <button
              onClick={() => setActiveEmail("main")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                activeEmail === "main"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Send className="h-4 w-4" />
              Cold Email
            </button>
            <button
              onClick={() => setActiveEmail("followup")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                activeEmail === "followup"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="h-4 w-4" />
              Follow-up
              <Badge variant="secondary" className="text-xs ml-1">
                +7 days
              </Badge>
            </button>
          </div>

          {/* Email Content */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 border-b bg-muted/20 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">
                {activeEmail === "main"
                  ? "Cold Email"
                  : "Follow-up Email (send after 1 week)"}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  copy(
                    activeEmail === "main"
                      ? results.email
                      : results.followUpEmail,
                    activeEmail === "main" ? "main" : "followup"
                  )
                }
              >
                {(activeEmail === "main" ? copiedMain : copiedFollowup) ? (
                  <CheckCheck className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">
                {activeEmail === "main" ? results.email : results.followUpEmail}
              </pre>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">💡 Pro Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {results.tips.map((tip, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="text-primary font-bold shrink-0">
                    {i + 1}.
                  </span>
                  <span className="text-muted-foreground">{tip}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
