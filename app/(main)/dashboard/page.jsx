import { getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_component/dashboard-view";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { AnalyticsCards } from "@/components/analytics-cards";
import Link from "next/link";
import { FileText, Mail, Mic, Search, User, LayoutDashboard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Skill Gap Analyzer",
    description: "Find missing skills for any job description",
    icon: Search,
    href: "/skill-gap",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950",
  },
  {
    title: "Profile Analyzer",
    description: "Get recruiter feedback on your LinkedIn or GitHub",
    icon: User,
    href: "/profile-analyzer",
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950",
  },
  {
    title: "Job Tracker",
    description: "Track all your applications in a Kanban board",
    icon: LayoutDashboard,
    href: "/job-tracker",
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950",
  },
];

export default async function DashboardPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) {
    redirect("/onboarding");
  }

  const insights = await getIndustryInsights();

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
      <AnalyticsCards />

      {/* Feature Quick Access */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.title}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {feature.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${feature.bg}`}>
                  <feature.icon className={`h-4 w-4 ${feature.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Industry Insights */}
      <h2 className="text-2xl font-bold mb-4">Industry Insights</h2>
      <DashboardView insights={insights} />
    </div>
  );
}