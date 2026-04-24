import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Star, AlertTriangle } from "lucide-react";

export function AnalyzerResults({ results, profileType }) {
  return (
    <div className="space-y-5 mt-6">
      {/* Score */}
      <Card>
        <CardHeader>
          <CardTitle>{profileType} Profile Score: {results.overallScore}/100</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-3 mb-3">
            <div
              className="bg-primary h-3 rounded-full"
              style={{ width: `${results.overallScore}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">{results.summary}</p>
        </CardContent>
      </Card>

      {/* Recruiter Tip */}
      <Card className="border-yellow-200 dark:border-yellow-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Top Recruiter Tip</p>
              <p className="text-sm text-muted-foreground">{results.recruiterTip}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-4 w-4 text-green-500" />
            Strengths
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {results.strengths.map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>{s}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Improvements */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            Areas to Improve
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.improvements.map((item, i) => (
            <div key={i} className="border rounded-lg p-3">
              <p className="font-semibold text-sm mb-1">{item.area}</p>
              <p className="text-xs text-muted-foreground mb-2">{item.issue}</p>
              <p className="text-xs bg-muted p-2 rounded">
                <span className="font-medium">Fix: </span>{item.fix}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Keywords */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Keywords Present</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {results.keywords.present.map((k) => (
              <Badge key={k} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {k}
              </Badge>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Keywords Missing</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {results.keywords.missing.map((k) => (
              <Badge key={k} variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                {k}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}