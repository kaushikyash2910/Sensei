"use client";

import { useState, useEffect } from "react";
import { getJobAnalytics, getAISuggestions } from "@/actions/job-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { Loader2, Lightbulb, TrendingUp, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const COLORS = ["#3b82f6", "#eab308", "#10b981", "#ef4444"];

export function SuccessTracker() {
  const [analytics, setAnalytics] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await getJobAnalytics();
      setAnalytics(data);
    } catch {
      toast.error("Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestions = async () => {
    if (!analytics) return;
    setAiLoading(true);
    try {
      const data = await getAISuggestions(analytics);
      setSuggestions(data);
    } catch {
      toast.error("Failed to get AI suggestions.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!analytics || analytics.total === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-lg font-semibold">No applications yet!</p>
        <p className="text-sm mt-1">Add jobs to your tracker to see analytics.</p>
      </div>
    );
  }

  const pieData = [
    { name: "Applied", value: analytics.applied },
    { name: "Interview", value: analytics.interview },
    { name: "Offer", value: analytics.offer },
    { name: "Rejected", value: analytics.rejected },
  ].filter((d) => d.value > 0);

  const barData = [
    { name: "Response Rate", value: analytics.responseRate },
    { name: "Interview→Offer", value: analytics.interviewConversion },
    { name: "Offer Rate", value: analytics.offerRate },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Applied", value: analytics.total, color: "text-blue-500" },
          { label: "Interviews", value: analytics.interview, color: "text-yellow-500" },
          { label: "Offers", value: analytics.offer, color: "text-green-500" },
          { label: "Rejected", value: analytics.rejected, color: "text-red-500" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6 text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Response Rate", value: analytics.responseRate, desc: "% of applications that got a response" },
          { label: "Interview Conversion", value: analytics.interviewConversion, desc: "% of interviews that led to an offer" },
          { label: "Overall Offer Rate", value: analytics.offerRate, desc: "% of total applications that became offers" },
        ].map((rate) => (
          <Card key={rate.label}>
            <CardContent className="pt-6">
              <div className="flex items-end justify-between mb-2">
                <p className="text-sm font-medium">{rate.label}</p>
                <p className="text-2xl font-bold">{rate.value}%</p>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(rate.value, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{rate.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Application Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80}
                    dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Conversion Rates (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Suggestions */}
      {!suggestions ? (
        <Button onClick={loadSuggestions} disabled={aiLoading} className="w-full">
          {aiLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Getting AI Suggestions...</>
          ) : (
            <><TrendingUp className="mr-2 h-4 w-4" />Get AI Suggestions to Improve</>
          )}
        </Button>
      ) : (
        <div className="space-y-4">
          <Card className="border-primary">
            <CardContent className="pt-6">
              <p className="text-sm font-semibold mb-1">📊 Overall Assessment</p>
              <p className="text-sm text-muted-foreground">{suggestions.overallAssessment}</p>
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="outline">🎯 Weekly Target: {suggestions.weeklyTarget} applications</Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-600">✓ What's Working</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestions.strengths.map((s, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span className="text-muted-foreground">{s}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  What to Improve
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestions.improvements.map((item, i) => (
                  <div key={i} className="border rounded-lg p-2">
                    <p className="text-xs font-semibold">{item.area}</p>
                    <p className="text-xs text-muted-foreground">{item.issue}</p>
                    <p className="text-xs bg-muted rounded p-1 mt-1">💡 {item.fix}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="border-yellow-300 dark:border-yellow-700">
            <CardContent className="pt-6 flex gap-3">
              <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold mb-1">🔥 Top Tip Right Now</p>
                <p className="text-sm text-muted-foreground">{suggestions.topTip}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}