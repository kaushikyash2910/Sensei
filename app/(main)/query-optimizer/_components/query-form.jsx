"use client";

import { useState, useEffect } from "react";
import { optimizeQuery } from "@/actions/query-optimizer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Copy, CheckCheck, Zap } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "sensei_query_optimizer";

const severityColor = {
  High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

export function QueryForm() {
  const [query, setQuery] = useState("");
  const [dbType, setDbType] = useState("PostgreSQL");
  const [tableInfo, setTableInfo] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { results: r, query: q, dbType: d, tableInfo: t } = JSON.parse(saved);
      setResults(r); setQuery(q); setDbType(d); setTableInfo(t);
    }
  }, []);

  useEffect(() => {
    if (results) localStorage.setItem(STORAGE_KEY, JSON.stringify({ results, query, dbType, tableInfo }));
  }, [results]);

  const handleOptimize = async () => {
    if (!query.trim()) { toast.error("Please paste a SQL query."); return; }
    setLoading(true);
    try {
      const data = await optimizeQuery({ query, dbType, tableInfo });
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Optimization failed.");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(results.optimizedQuery);
    setCopied(true);
    toast.success("Optimized query copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreColor = (s) => s >= 8 ? "text-green-500" : s >= 6 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Database Type</Label>
          <Select value={dbType} onValueChange={setDbType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["PostgreSQL", "MySQL", "SQLite", "Microsoft SQL Server", "Oracle"].map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Table Info (optional)</Label>
          <Input placeholder="e.g. users(id, name, email), orders(id, user_id, amount)"
            value={tableInfo} onChange={(e) => setTableInfo(e.target.value)} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Your SQL Query *</Label>
          <Textarea placeholder="Paste your SQL query here..."
            value={query} onChange={(e) => setQuery(e.target.value)}
            className="min-h-[200px] font-mono text-sm" />
        </div>
        {results && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label>Optimized Query</Label>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copy}>
                {copied ? <CheckCheck className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <Textarea value={results.optimizedQuery} readOnly
              className="min-h-[200px] font-mono text-sm bg-green-50 dark:bg-green-950/20" />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={handleOptimize} disabled={loading} className="flex-1">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Optimizing...</> : "Optimize Query"}
        </Button>
        {results && (
          <Button variant="outline" onClick={() => { setResults(null); localStorage.removeItem(STORAGE_KEY); }}>Clear</Button>
        )}
      </div>

      {results && (
        <>
          <p className="text-xs text-muted-foreground text-center">✓ Showing last saved result</p>
          <div className="space-y-4">
            <Card className="border-primary">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className={`text-4xl font-bold ${scoreColor(results.performanceScore)}`}>
                      {results.performanceScore}<span className="text-lg text-muted-foreground">/10</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{results.queryAnalysis}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm px-3 py-1">
                    <Zap className="h-3 w-3 mr-1" />
                    {results.estimatedSpeedup}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {results.issues?.length > 0 && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">🐛 Performance Issues</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {results.issues.map((issue, i) => (
                    <div key={i} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`text-xs ${severityColor[issue.severity]}`}>{issue.severity}</Badge>
                        <span className="font-semibold text-sm">{issue.type}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{issue.description}</p>
                      <p className="text-xs text-orange-500 mt-1">Impact: {issue.impact}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Execution Plan */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm text-red-500">Before</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground font-mono">{results.executionPlanBefore}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm text-green-500">After</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground font-mono">{results.executionPlanAfter}</p>
                </CardContent>
              </Card>
            </div>

            {results.indexSuggestions?.length > 0 && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">📊 Index Suggestions</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {results.indexSuggestions.map((idx, i) => (
                    <div key={i} className="border rounded-lg p-3">
                      <p className="text-sm font-medium">{idx.table} → [{idx.columns?.join(", ")}]</p>
                      <p className="text-xs text-muted-foreground">{idx.reason}</p>
                      <code className="text-xs bg-muted px-2 py-1 rounded mt-1 block">{idx.createStatement}</code>
                    </div>
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