"use client";

import { useState } from "react";
import { recommendTechStack } from "@/actions/tech-stack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

const demandColor = {
  High: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Low: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const curveColor = {
  Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

function TechItem({ item }) {
  return (
    <div className="flex items-center justify-between border rounded-lg p-3">
      <div className="flex-1">
        <p className="font-semibold text-sm">{item.name}</p>
        <p className="text-xs text-muted-foreground">{item.reason}</p>
      </div>
      <div className="flex gap-1 ml-2 shrink-0">
        <Badge className={curveColor[item.learningCurve]}>{item.learningCurve}</Badge>
        <Badge className={demandColor[item.jobDemand]}>{item.jobDemand} demand</Badge>
      </div>
    </div>
  );
}

export function StackForm() {
  const [form, setForm] = useState({
    projectIdea: "", projectType: "Web App", experience: "Intermediate", budget: "Low/Free", timeline: "3 months",
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRecommend = async () => {
    if (!form.projectIdea) {
      toast.error("Please describe your project idea.");
      return;
    }
    setLoading(true);
    try {
      const data = await recommendTechStack(form);
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Failed to get recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Label>Project Idea *</Label>
        <Textarea
          placeholder="e.g. An AI-powered job portal where recruiters post jobs and candidates apply with AI-matched resumes..."
          value={form.projectIdea}
          onChange={(e) => setForm((f) => ({ ...f, projectIdea: e.target.value }))}
          className="min-h-[100px]"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Project Type</Label>
          <Select value={form.projectType} onValueChange={(v) => setForm((f) => ({ ...f, projectType: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Web App">Web App</SelectItem>
              <SelectItem value="Mobile App">Mobile App</SelectItem>
              <SelectItem value="API / Backend">API / Backend</SelectItem>
              <SelectItem value="Full Stack SaaS">Full Stack SaaS</SelectItem>
              <SelectItem value="Chrome Extension">Chrome Extension</SelectItem>
              <SelectItem value="AI / ML Project">AI / ML Project</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Your Experience Level</Label>
          <Select value={form.experience} onValueChange={(v) => setForm((f) => ({ ...f, experience: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Budget</Label>
          <Select value={form.budget} onValueChange={(v) => setForm((f) => ({ ...f, budget: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Low/Free">Low / Free</SelectItem>
              <SelectItem value="Medium ($50-200/mo)">Medium ($50-200/mo)</SelectItem>
              <SelectItem value="High (No limit)">High (No limit)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Timeline</Label>
          <Select value={form.timeline} onValueChange={(v) => setForm((f) => ({ ...f, timeline: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2 weeks">2 weeks (hackathon)</SelectItem>
              <SelectItem value="1 month">1 month</SelectItem>
              <SelectItem value="3 months">3 months</SelectItem>
              <SelectItem value="6+ months">6+ months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleRecommend} disabled={loading} className="w-full">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : "Recommend Tech Stack"}
      </Button>

      {results && (
        <div className="space-y-5 mt-4">
          <Card className="border-primary">
            <CardContent className="pt-6">
              <p className="text-xl font-bold mb-1">{results.stackName}</p>
              <p className="text-sm text-muted-foreground">{results.summary}</p>
              <p className="text-sm mt-2 text-primary font-medium">⏱ {results.estimatedLearningTime}</p>
            </CardContent>
          </Card>

          {[
            { label: "Frontend", items: results.frontend },
            { label: "Backend", items: results.backend },
            { label: "Database", items: results.database },
            { label: "DevOps / Deployment", items: results.devops },
          ].map(({ label, items }) => items?.length > 0 && (
            <Card key={label}>
              <CardHeader className="pb-2"><CardTitle className="text-sm">{label}</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {items.map((item, i) => <TechItem key={i} item={item} />)}
              </CardContent>
            </Card>
          ))}

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Pros</CardTitle></CardHeader>
              <CardContent className="space-y-1">
                {results.pros.map((p, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span className="text-muted-foreground">{p}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><XCircle className="h-4 w-4 text-red-500" />Cons</CardTitle></CardHeader>
              <CardContent className="space-y-1">
                {results.cons.map((c, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="text-red-500">✗</span>
                    <span className="text-muted-foreground">{c}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">🔄 Alternatives to Consider</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {results.alternatives.map((alt) => (
                <Badge key={alt} variant="outline">{alt}</Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}