import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, BookOpen } from "lucide-react";

export function SkillGapResults({ results }) {
  return (
    <div className="space-y-6 mt-6">
      {/* Match Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Match: {results.overallMatch}%</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-3 mb-3">
            <div
              className="bg-primary h-3 rounded-full transition-all"
              style={{ width: `${results.overallMatch}%` }}
            />
          </div>
          <p className="text-muted-foreground text-sm">{results.summary}</p>
        </CardContent>
      </Card>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Skills You Have
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {results.matchingSkills.map((s) => (
              <Badge key={s} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {s}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Skills You Need
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {results.missingSkills.map((s) => (
              <Badge key={s} variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                {s}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Learning Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Your Learning Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.learningPlan.map((item, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">{item.skill}</span>
                <Badge variant="outline">{item.timeframe}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{item.how}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}