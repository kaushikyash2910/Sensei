"use client";

import { useState, useEffect } from "react";
import { generateReadme } from "@/actions/readme-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy, Download, CheckCheck } from "lucide-react";
import { toast } from "sonner";

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

  const STORAGE_KEY = "sensei_readme";

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
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("README.md downloaded!");
  };

  return (
    <div className="space-y-6">
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
            placeholder: "e.g. npm install, add .env, npx prisma migrate",
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
        <Textarea
          placeholder="Describe what your project does and who it's for..."
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-1">
        <Label>Key Features</Label>
        <Textarea
          placeholder="e.g. AI Resume Builder, Interview Prep, Skill Gap Analyzer, Job Tracker..."
          value={form.features}
          onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
          className="min-h-[80px]"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleGenerate} disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating README...
            </>
          ) : (
            "Generate README.md"
          )}
        </Button>
        {results && (
          <Button
            variant="outline"
            onClick={() => {
              setResults(null);
              localStorage.removeItem(STORAGE_KEY);
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {results && (
  <>
    <p className="text-xs text-muted-foreground text-center">
      ✓ Showing your last saved result — click Generate to refresh
    </p>
    <div className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Generated README.md</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyReadme}>
                  {copied ? (
                    <CheckCheck className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="ml-1">{copied ? "Copied!" : "Copy"}</span>
                </Button>
                <Button variant="outline" size="sm" onClick={downloadReadme}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono bg-muted p-4 rounded-lg overflow-auto max-h-[500px]">
                {results.readme}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">💡 Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {results.tips.map((tip, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="text-primary font-bold">{i + 1}.</span>
                  <span className="text-muted-foreground">{tip}</span>
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
