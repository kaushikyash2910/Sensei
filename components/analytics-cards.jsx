import { FileText, Mail, Mic } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserStats } from "@/actions/analytics";

export async function AnalyticsCards() {
  const stats = await getUserStats();

  if (!stats) return null;

  const cards = [
    {
      title: "Resumes Generated",
      value: stats.resumesCreated,
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Cover Letters",
      value: stats.coverLetters,
      icon: Mail,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Interviews Done",
      value: stats.interviewsDone,
      icon: Mic,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total since you joined
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}