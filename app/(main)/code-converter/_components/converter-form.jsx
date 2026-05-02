"use client";

import { useState, useEffect } from "react";
import { convertCode } from "@/actions/code-converter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Copy, CheckCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "sensei_code_converter";
const LANGUAGES = ["Python", "JavaScript", "TypeScript", "Java", "C++", "Go", "Rust", "C#", "Swift", "Kotlin"];

export function ConverterForm() {
  const [code, setCode] = useState("");
  const [fromLanguage, setFromLanguage] = useState("Python");
  const [toLanguage, setToLanguage] = useState("JavaScript");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { results: r, code: c, fromLanguage: f, toLanguage: t } = JSON.parse(saved);
      setResults(r); setCode(c); setFromLanguage(f); setToLanguage(t);
    }
  }, []);

  useEffect(() => {
    if (results) localStorage.setItem(STORAGE_KEY, JSON.stringify({ results, code, fromLanguage, toLanguage }));
  }, [results]);

  const handleConvert = async () => {
    if (!code.trim()) { toast.error("Please paste your code."); return; }
    if (fromLanguage === toLanguage) { toast.error("Please select different languages."); return; }
    setLoading(true);
    try {
      const data = await convertCode({ code, fromLanguage, toLanguage });
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Conversion failed.");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(results.convertedCode);
    setCopied(true);
    toast.success("Converted code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Language Selector */}
      <div className="flex items-center gap-3">
        <div className="flex-1 space-y-1">
          <Label>From</Label>
          <Select value={fromLanguage} onValueChange={setFromLanguage}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground mt-5 shrink-0" />
        <div className="flex-1 space-y-1">
          <Label>To</Label>
          <Select value={toLanguage} onValueChange={setToLanguage}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Side by side editors */}
      <div className={`grid ${results ? "md:grid-cols-2" : "grid-cols-1"} gap-4`}>
        <div className="space-y-1">
          <Label>{fromLanguage} Code *</Label>
          <Textarea placeholder={`Paste your ${fromLanguage} code here...`}
            value={code} onChange={(e) => setCode(e.target.value)}
            className="min-h-[250px] font-mono text-sm" />
        </div>
        {results && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label>{toLanguage} Code (Converted)</Label>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copy}>
                {copied ? <CheckCheck className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <Textarea value={results.convertedCode} readOnly
              className="min-h-[250px] font-mono text-sm bg-green-50 dark:bg-green-950/20" />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={handleConvert} disabled={loading} className="flex-1">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Converting...</> : `Convert ${fromLanguage} → ${toLanguage}`}
        </Button>
        {results && (
          <Button variant="outline" onClick={() => { setResults(null); localStorage.removeItem(STORAGE_KEY); }}>Clear</Button>
        )}
      </div>

      {results && (
        <>
          <p className="text-xs text-muted-foreground text-center">✓ Showing last saved result</p>
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">🔄 Key Syntax Differences</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {results.syntaxDifferences?.map((d, i) => (
                  <div key={i} className="border rounded-lg p-3">
                    <p className="font-semibold text-sm mb-2">{d.aspect}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-red-500 font-medium mb-1">{fromLanguage}</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{d.fromLang}</code>
                      </div>
                      <div>
                        <p className="text-xs text-green-500 font-medium mb-1">{toLanguage}</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{d.toLang}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {results.equivalentLibraries?.length > 0 && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">📦 Equivalent Libraries</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {results.equivalentLibraries.map((lib, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary">{lib.fromLib}</Badge>
                      <ArrowRight className="h-3 w-3" />
                      <Badge variant="secondary">{lib.toLib}</Badge>
                      <span className="text-xs text-muted-foreground">· {lib.purpose}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {results.importantNotes?.length > 0 && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">⚠️ Important Notes</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  {results.importantNotes.map((n, i) => (
                    <p key={i} className="text-sm text-muted-foreground">• {n}</p>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}