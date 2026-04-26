import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Zap, Search } from "lucide-react";

const sectionLabels = {
  formatting: "Formatting",
  keywords: "Keywords",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
};

export function ScoreResults({ results }) {
  const scoreColor =
    results.overallScore >= 80
      ? "text-green-500"
      : results.overallScore >= 60
      ? "text-yellow-500"
      : "text-red-500";

  return (
    <div className="space-y-5 mt-6">
      {/* Overall Score */}
      <Card>
        <CardContent className="pt-6 text-center">
          <p className={`text-6xl font-bold ${scoreColor}`}>
            {results.overallScore}
            <span className="text-2xl text-muted-foreground">/100</span>
          </p>
          <p className="text-muted-foreground mt-2">{results.summary}</p>
        </CardContent>
      </Card>

      {/* Section Scores */}
      <Card>
        <CardHeader><CardTitle className="text-base">Section Breakdown</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(results.sections).map(([key, val]) => (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{sectionLabels[key]}</span>
                <span>{val.score}/100</span>
              </div>
              <Progress value={val.score} className="h-2 mb-1" />
              <p className="text-xs text-muted-foreground">{val.feedback}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top Issues + Quick Wins */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Top Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {results.topIssues.map((issue, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="text-orange-500 font-bold">{i + 1}.</span>
                <span className="text-muted-foreground">{issue}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Quick Wins
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {results.quickWins.map((win, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span className="text-muted-foreground">{win}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Missing Keywords */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Search className="h-4 w-4 text-red-500" />
            Missing Keywords
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {results.missingKeywords.map((kw) => (
            <Badge key={kw} variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              {kw}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}