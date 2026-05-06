"use client";

import { useState, useEffect } from "react";
import { generateReadme } from "@/actions/readme-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Copy,
  Download,
  CheckCheck,
  Sparkles,
  RefreshCw,
  Eye,
  Code2,
  Github,
} from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "sensei_readme";

const QUICK_STACKS = [
  {
    label: "Next.js Full Stack",
    value: "Next.js, Tailwind CSS, Prisma, PostgreSQL, Clerk",
  },
  { label: "MERN Stack", value: "MongoDB, Express.js, React, Node.js" },
  {
    label: "Python ML",
    value: "Python, FastAPI, TensorFlow, PostgreSQL, Docker",
  },
  { label: "React Native", value: "React Native, Expo, Firebase, TypeScript" },
];

export function ReadmeForm() {
  const [form, setForm] = useState({
    projectName: "",
    description: "",
    techStack: "",
    features: "",
    installation: "",
    author: "",
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState("preview"); // preview | raw

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
    if (!form.projectName || !form.description || !form.techStack) {
      toast.error("Please fill in Project Name, Description and Tech Stack.");
      return;
    }
    setLoading(true);
    try {
      const data = await generateReadme(form);
      setResults(data);
      toast.success("README generated!");
    } catch (err) {
      toast.error(err.message || "Failed to generate README.");
    } finally {
      setLoading(false);
    }
  };

  const copyReadme = () => {
    navigator.clipboard.writeText(results.readme);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReadme = () => {
    const blob = new Blob([results.readme], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.projectName.replace(/\s+/g, "-")}-README.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("README.md downloaded!");
  };

  // Simple markdown to HTML renderer for preview
  const renderPreview = (md) => {
    if (!md) return "";
    return md
      .replace(/^# (.+)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(
        /^## (.+)/gm,
        '<h2 class="text-xl font-bold mt-4 mb-2 border-b pb-1">$1</h2>'
      )
      .replace(
        /^### (.+)/gm,
        '<h3 class="text-lg font-semibold mt-3 mb-1">$1</h3>'
      )
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(
        /`(.+?)`/g,
        '<code class="bg-muted px-1 py-0.5 rounded text-xs font-mono">$1</code>'
      )
      .replace(/^- (.+)/gm, '<li class="ml-4 text-sm">• $1</li>')
      .replace(
        /!\[(.+?)\]\((.+?)\)/g,
        '<img src="$2" alt="$1" class="max-w-full rounded" />'
      )
      .replace(
        /\[(.+?)\]\((.+?)\)/g,
        '<a href="$2" class="text-primary underline">$1</a>'
      )
      .replace(/\n\n/g, "<br/><br/>")
      .replace(
        /^(?!<[h|l|c|b|i])/gm,
        '<p class="text-sm text-muted-foreground">$&</p>'
      );
  };

  return (
    <div className="space-y-6">
      {/* Quick Stack Templates */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quick Tech Stacks
        </p>
        <div className="flex gap-2 flex-wrap">
          {QUICK_STACKS.map((s) => (
            <button
              key={s.label}
              onClick={() => setForm((f) => ({ ...f, techStack: s.value }))}
              className="text-xs border rounded-full px-3 py-1.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center gap-1"
            >
              <Code2 className="h-3 w-3" />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          {
            label: "Project Name *",
            key: "projectName",
            placeholder: "e.g. Sensei AI Career Coach",
          },
          {
            label: "Author / GitHub Username",
            key: "author",
            placeholder: "e.g. kaushikyash2910",
          },
          {
            label: "Tech Stack *",
            key: "techStack",
            placeholder: "e.g. Next.js, Tailwind, Prisma, Groq AI",
          },
          {
            label: "Installation Steps",
            key: "installation",
            placeholder: "e.g. npm install, add .env, prisma migrate",
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

      <div className="space-y-1">
        <Label>Project Description *</Label>
        <div className="relative rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 transition-colors bg-muted/10 p-4">
          <Textarea
            placeholder="Describe what your project does and who it's for..."
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="min-h-[80px] border-0 bg-transparent p-0 resize-none focus-visible:ring-0 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label>Key Features</Label>
        <div className="relative rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 transition-colors bg-muted/10 p-4">
          <Textarea
            placeholder="e.g. AI Resume Builder, Interview Prep, Skill Gap Analyzer..."
            value={form.features}
            onChange={(e) =>
              setForm((f) => ({ ...f, features: e.target.value }))
            }
            className="min-h-[60px] border-0 bg-transparent p-0 resize-none focus-visible:ring-0 text-sm"
          />
        </div>
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
              Generating README...
            </>
          ) : (
            <>
              <Github className="h-4 w-4" />
              Generate README.md
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

          {/* Badges */}
          {results.badges?.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Generated Badges
              </p>
              <div className="flex flex-wrap gap-2">
                {results.badges.map((badge, i) => (
                  <code
                    key={i}
                    className="text-xs bg-muted px-2 py-1 rounded font-mono"
                  >
                    {badge}
                  </code>
                ))}
              </div>
            </div>
          )}

          {/* View Toggle + Actions */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-1 p-1 bg-muted/40 rounded-xl">
              <button
                onClick={() => setView("preview")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  view === "preview"
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                <Eye className="h-3 w-3" />
                Preview
              </button>
              <button
                onClick={() => setView("raw")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  view === "raw"
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                <Code2 className="h-3 w-3" />
                Raw Markdown
              </button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyReadme}>
                {copied ? (
                  <CheckCheck className="h-4 w-4 text-emerald-500 mr-1" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button variant="outline" size="sm" onClick={downloadReadme}>
                <Download className="h-4 w-4 mr-1" />
                Download .md
              </Button>
            </div>
          </div>

          {/* README Content */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 border-b bg-muted/20 flex flex-row items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                README.md
              </span>
            </CardHeader>
            <CardContent className="pt-4 max-h-[500px] overflow-auto">
              {view === "preview" ? (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: renderPreview(results.readme),
                  }}
                />
              ) : (
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                  {results.readme}
                </pre>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">💡 README Tips</CardTitle>
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
