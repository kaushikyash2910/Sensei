"use client";

import { useState, useEffect } from "react";
import { generateReferralRequest } from "@/actions/referral-request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Copy, CheckCheck } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "sensei_referral";

export function ReferralForm() {
  const [form, setForm] = useState({
    personName: "", relationship: "Ex-colleague",
    company: "", role: "", yourName: "", yourBackground: "", platform: "LinkedIn",
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { results: r, form: f } = JSON.parse(saved);
      setResults(r); setForm(f);
    }
  }, []);

  useEffect(() => {
    if (results) localStorage.setItem(STORAGE_KEY, JSON.stringify({ results, form }));
  }, [results]);

  const handleGenerate = async () => {
    if (!form.personName || !form.company || !form.role || !form.yourName) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const data = await generateReferralRequest(form);
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Failed to generate message.");
    } finally {
      setLoading(false);
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { label: "Person's Name *", key: "personName", placeholder: "e.g. Rahul Sharma" },
          { label: "Company *", key: "company", placeholder: "e.g. Google" },
          { label: "Role You're Applying For *", key: "role", placeholder: "e.g. Software Engineer" },
          { label: "Your Name *", key: "yourName", placeholder: "e.g. Yash Kaushik" },
        ].map(({ label, key, placeholder }) => (
          <div key={key} className="space-y-1">
            <Label>{label}</Label>
            <Input placeholder={placeholder} value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
          </div>
        ))}

        <div className="space-y-1">
          <Label>Your Relationship</Label>
          <Select value={form.relationship} onValueChange={(v) => setForm((f) => ({ ...f, relationship: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Ex-colleague", "College Friend", "Senior from College", "LinkedIn Connection", "Mutual Friend", "Ex-classmate"].map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Platform</Label>
          <Select value={form.platform} onValueChange={(v) => setForm((f) => ({ ...f, platform: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["LinkedIn", "WhatsApp", "Email", "Text Message"].map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1">
        <Label>Your Background</Label>
        <Textarea placeholder="Brief background: e.g. Final year CS student, 2 internships in React and Node.js..."
          value={form.yourBackground}
          onChange={(e) => setForm((f) => ({ ...f, yourBackground: e.target.value }))}
          className="min-h-[80px]" />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleGenerate} disabled={loading} className="flex-1">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : "Generate Referral Message"}
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
            ✓ Showing your last saved result — click Generate to refresh
          </p>
          <div className="space-y-4">
            {results.subject && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Subject Line</CardTitle></CardHeader>
                <CardContent><p className="font-medium">{results.subject}</p></CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Referral Request Message ({form.platform})</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => copy(results.message)}>
                  {copied ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">{results.message}</pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Follow-up Message (after 1 week)</CardTitle></CardHeader>
              <CardContent>
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">{results.followUpMessage}</pre>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">💡 Tips</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {results.tips.map((tip, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <span className="text-primary font-bold">{i + 1}.</span>
                      <span className="text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">⚠️ Do NOT Do This</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {results.doNots.map((d, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <span className="text-red-500">✗</span>
                      <span className="text-muted-foreground">{d}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}