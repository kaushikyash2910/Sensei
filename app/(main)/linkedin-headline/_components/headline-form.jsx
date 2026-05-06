"use client";

import { useState, useEffect } from "react";
import { generateHeadlines } from "@/actions/linkedin-headline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Copy,
  CheckCheck,
  Sparkles,
  RefreshCw,
  Star,
} from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "sensei_linkedin_headline";

const STYLE_COLORS = {
  "Achievement-focused":
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Keyword-rich":
    "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "Story-driven":
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  "Value-proposition":
    "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  "Bold & Direct":
    "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
};

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
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [charCounts, setCharCounts] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { results: r, form: f } = JSON.parse(saved);
      setResults(r);
      setForm(f);
    }
    const savedFavs = localStorage.getItem("sensei_headline_favourites");
    if (savedFavs) setFavourites(JSON.parse(savedFavs));
  }, []);

  useEffect(() => {
    if (results)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ results, form }));
  }, [results]);

  const handleGenerate = async () => {
    if (!form.currentRole || !form.skills) {
      toast.error("Please fill in Current Role and Skills.");
      return;
    }
    setLoading(true);
    try {
      const data = await generateHeadlines(form);
      setResults(data);
      const counts = {};
      data.headlines.forEach((h, i) => {
        counts[i] = h.headline.length;
      });
      setCharCounts(counts);
    } catch (err) {
      toast.error(err.message || "Failed to generate headlines.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text, i) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(i);
    toast.success("Headline copied!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleFavourite = (headline) => {
    const updated = favourites.includes(headline)
      ? favourites.filter((h) => h !== headline)
      : [...favourites, headline];
    setFavourites(updated);
    localStorage.setItem("sensei_headline_favourites", JSON.stringify(updated));
    toast.success(
      favourites.includes(headline)
        ? "Removed from favourites"
        : "Added to favourites ⭐"
    );
  };

  const charColor = (count) =>
    count <= 150
      ? "text-emerald-500"
      : count <= 200
      ? "text-amber-500"
      : "text-rose-500";

  return (
    <div className="space-y-6">
      {/* Form */}
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

      <div className="flex gap-3">
        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="flex-1 h-11 font-semibold gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate 5 Headlines
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Your 5 LinkedIn Headlines</h3>
              <Badge variant="outline" className="text-xs">
                220 char limit
              </Badge>
            </div>

            {results.headlines.map((item, i) => (
              <div
                key={i}
                className={`group relative border rounded-2xl p-4 transition-all hover:border-primary/40 hover:shadow-sm ${
                  favourites.includes(item.headline)
                    ? "border-amber-300 dark:border-amber-700 bg-amber-50/30 dark:bg-amber-950/10"
                    : "bg-card"
                }`}
              >
                {/* Style Badge */}
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    className={`text-xs ${
                      STYLE_COLORS[item.style] ||
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.style}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-xs font-mono ${charColor(
                        item.headline.length
                      )}`}
                    >
                      {item.headline.length}/220
                    </span>
                    <button
                      onClick={() => toggleFavourite(item.headline)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          favourites.includes(item.headline)
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => copyText(item.headline, i)}
                    >
                      {copiedIndex === i ? (
                        <CheckCheck className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Headline */}
                <p className="font-semibold text-sm leading-relaxed mb-2">
                  {item.headline}
                </p>

                {/* Why */}
                <p className="text-xs text-muted-foreground">{item.why}</p>
              </div>
            ))}
          </div>

          {/* Favourites */}
          {favourites.length > 0 && (
            <Card className="border-amber-200 dark:border-amber-800/50">
              <CardHeader className="pb-2 bg-amber-50/50 dark:bg-amber-950/20">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  Your Favourites ({favourites.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-2">
                {favourites.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 text-xs border rounded-lg p-2"
                  >
                    <span className="text-muted-foreground flex-1">{h}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText(h);
                        toast.success("Copied!");
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">💡 Optimization Tips</CardTitle>
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
