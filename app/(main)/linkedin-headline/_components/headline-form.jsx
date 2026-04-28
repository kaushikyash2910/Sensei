"use client";

import { useState, useEffect } from "react";
import { generateHeadlines } from "@/actions/linkedin-headline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy } from "lucide-react";
import { toast } from "sonner";

export function HeadlineForm() {
  const [form, setForm] = useState({
    currentRole: "",
    targetRole: "",
    skills: "",
    experience: "",
    uniqueValue: "",
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const STORAGE_KEY = "sensei_linkedin_headline";

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
    if (!form.currentRole || !form.skills) {
      toast.error("Please fill in at least Current Role and Skills.");
      return;
    }
    setLoading(true);
    try {
      const data = await generateHeadlines(form);
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Failed to generate headlines.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {[
          {
            label: "Current Role *",
            key: "currentRole",
            placeholder: "e.g. CS Student / Junior Developer",
          },
          {
            label: "Target Role",
            key: "targetRole",
            placeholder: "e.g. Full Stack Engineer at a startup",
          },
          {
            label: "Top Skills *",
            key: "skills",
            placeholder: "e.g. React, Node.js, Python, AWS",
          },
          {
            label: "Years of Experience",
            key: "experience",
            placeholder: "e.g. 2 years / Fresher",
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
        <Label>Your Unique Value</Label>
        <Input
          placeholder="e.g. I build AI-powered apps and have won 2 hackathons"
          value={form.uniqueValue}
          onChange={(e) =>
            setForm((f) => ({ ...f, uniqueValue: e.target.value }))
          }
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
            "Generate Headlines"
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
          <h3 className="font-semibold text-lg">Your 5 LinkedIn Headlines</h3>
          {results.headlines.map((item, i) => (
            <Card key={i}>
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {item.style}
                  </Badge>
                  <CardTitle className="text-sm font-medium leading-relaxed">
                    {item.headline}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyText(item.headline)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{item.why}</p>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                💡 Tips to Optimize Further
              </CardTitle>
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
