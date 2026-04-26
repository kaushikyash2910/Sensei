"use client";

import { useState } from "react";
import { generateNegotiationScript } from "@/actions/salary-negotiation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy } from "lucide-react";
import { toast } from "sonner";

export function NegotiationForm() {
  const [form, setForm] = useState({
    role: "", company: "", offeredSalary: "", expectedSalary: "", experience: "", competing: "",
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!form.role || !form.offeredSalary || !form.expectedSalary) {
      toast.error("Please fill in Role, Offered Salary, and Expected Salary.");
      return;
    }
    setLoading(true);
    try {
      const data = await generateNegotiationScript(form);
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Failed to generate script.");
    } finally {
      setLoading(false);
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { label: "Role *", key: "role", placeholder: "e.g. Software Engineer" },
          { label: "Company *", key: "company", placeholder: "e.g. Google" },
          { label: "Offered Salary *", key: "offeredSalary", placeholder: "e.g. ₹12 LPA or $80,000" },
          { label: "Your Expected Salary *", key: "expectedSalary", placeholder: "e.g. ₹16 LPA or $100,000" },
          { label: "Years of Experience", key: "experience", placeholder: "e.g. 3 years" },
          { label: "Competing Offers", key: "competing", placeholder: "e.g. ₹15 LPA from Flipkart (optional)" },
        ].map(({ label, key, placeholder }) => (
          <div key={key} className="space-y-1">
            <Label>{label}</Label>
            <Input
              placeholder={placeholder}
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      <Button onClick={handleGenerate} disabled={loading} className="w-full">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Script...</> : "Generate Negotiation Script"}
      </Button>

      {results && (
        <div className="space-y-4 mt-4">
          {/* Counter Offer */}
          <Card className="border-green-400">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Recommended Counter Offer</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{results.counterOffer}</p>
            </CardContent>
          </Card>

          {/* Email */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">📧 Negotiation Email</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => copy(results.emailScript)}>
                <Copy className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">{results.emailScript}</pre>
            </CardContent>
          </Card>

          {/* Phone Script */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">📞 Phone Call Script</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => copy(results.phoneScript)}>
                <Copy className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">{results.phoneScript}</pre>
            </CardContent>
          </Card>

          {/* Key Arguments + Things to Avoid */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">💪 Key Arguments</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {results.keyArguments.map((arg, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span className="text-muted-foreground">{arg}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">⚠️ Things to Avoid</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {results.thingsToAvoid.map((item, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="text-red-500">✗</span>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Best Case + Walk Away */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-green-200 dark:border-green-800">
              <CardContent className="pt-4">
                <p className="text-xs font-semibold mb-1">🎯 Best Case Outcome</p>
                <p className="text-sm text-muted-foreground">{results.bestCaseOutcome}</p>
              </CardContent>
            </Card>
            <Card className="border-red-200 dark:border-red-800">
              <CardContent className="pt-4">
                <p className="text-xs font-semibold mb-1">🚪 Walk Away Point</p>
                <p className="text-sm text-muted-foreground">{results.walkAwayPoint}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}