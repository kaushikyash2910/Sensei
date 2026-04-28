"use client";

import { useState, useEffect } from "react";
import { generateColdEmail } from "@/actions/cold-email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy, CheckCheck } from "lucide-react";
import { toast } from "sonner";

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
  const [copied, setCopied] = useState(false);

  const STORAGE_KEY = "sensei_cold_email";

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
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

      <div className="space-y-1">
        <Label>Your Background *</Label>
        <Textarea
          placeholder="Brief background: e.g. Final year CS student with 2 internships in React and Node.js, built 3 production apps..."
          value={form.yourBackground}
          onChange={(e) =>
            setForm((f) => ({ ...f, yourBackground: e.target.value }))
          }
          className="min-h-[100px]"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleGenerate} disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Cold Email"
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
              <CardTitle className="text-sm">Subject Line</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{results.subject}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm">Cold Email</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(results.email)}
              >
                {copied ? (
                  <CheckCheck className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">
                {results.email}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Follow-up Email (send after 1 week)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">
                {results.followUpEmail}
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
