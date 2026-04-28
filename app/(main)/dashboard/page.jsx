import { getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_component/dashboard-view";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { AnalyticsCards } from "@/components/analytics-cards";
import Link from "next/link";
import {
  Search, User, LayoutDashboard, FileSearch, GitCompare,
  Map, Mail, Linkedin, DollarSign, Github, Layers,
  HelpCircle, GraduationCap, MessageCircle, Mic,
  FileText, PenBox, Target, MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const careerTools = [
  { title: "Skill Gap Analyzer", description: "Find missing skills for any job description", icon: Search, href: "/skill-gap", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950" },
  { title: "Profile Analyzer", description: "Get recruiter feedback on your LinkedIn or GitHub", icon: User, href: "/profile-analyzer", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950" },
  { title: "Job Tracker", description: "Track all your job applications in a Kanban board", icon: LayoutDashboard, href: "/job-tracker", color: "text-green-500", bg: "bg-green-50 dark:bg-green-950" },
  { title: "Resume Comparison", description: "Compare your resume vs job description side by side", icon: GitCompare, href: "/resume-compare", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950" },
  { title: "Resume Score Checker", description: "Get an ATS score out of 100 with detailed feedback", icon: FileSearch, href: "/resume-score", color: "text-red-500", bg: "bg-red-50 dark:bg-red-950" },
  { title: "Weekly Career Goals", description: "Set and track weekly goals with streak counter", icon: Target, href: "/career-goals", color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-950" },
];

const aiTools = [
  { title: "Career Roadmap", description: "Step-by-step AI roadmap to your dream role", icon: Map, href: "/career-roadmap", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950" },
  { title: "Cold Email Generator", description: "Generate personalized recruiter outreach emails", icon: Mail, href: "/cold-email", color: "text-green-500", bg: "bg-green-50 dark:bg-green-950" },
  { title: "LinkedIn Headline", description: "Generate 5 optimized LinkedIn headlines", icon: Linkedin, href: "/linkedin-headline", color: "text-blue-700", bg: "bg-blue-50 dark:bg-blue-950" },
  { title: "Salary Negotiation", description: "Word-for-word salary negotiation scripts", icon: DollarSign, href: "/salary-negotiation", color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950" },
  { title: "GitHub README", description: "Generate professional README.md for your projects", icon: Github, href: "/readme-generator", color: "text-gray-700", bg: "bg-gray-100 dark:bg-gray-900" },
  { title: "Tech Stack Recommender", description: "Get best tech stack recommendations for your project", icon: Layers, href: "/tech-stack", color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-950" },
];

const interviewTools = [
  { title: "Interview Questions", description: "Generate top 10 interview questions from any JD", icon: HelpCircle, href: "/interview-questions", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950" },
  { title: "Interview Prep (MCQ)", description: "Practice with AI-generated industry-specific quiz", icon: GraduationCap, href: "/interview", color: "text-green-500", bg: "bg-green-50 dark:bg-green-950" },
  { title: "Mock HR Interview", description: "Full conversational mock interview with AI feedback", icon: MessageCircle, href: "/hr-interview", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950" },
  { title: "Answer Feedback", description: "Type or speak answers and get AI scoring", icon: Mic, href: "/interview", color: "text-red-500", bg: "bg-red-50 dark:bg-red-950" },
];

const growthTools = [
  { title: "Resume Builder", description: "Build ATS-optimized resumes with AI assistance", icon: FileText, href: "/resume", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950" },
  { title: "Cover Letter", description: "Generate personalized cover letters in seconds", icon: PenBox, href: "/ai-cover-letter", color: "text-green-500", bg: "bg-green-50 dark:bg-green-950" },
  { title: "AI Chat Assistant", description: "Ask any career question — always available", icon: MessageSquare, href: "#", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950" },
];

function ToolSection({ title, tools, cols = 3 }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-4`}>
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.title}>
            <Card className="hover:shadow-md transition-all hover:border-primary cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{tool.title}</CardTitle>
                <div className={`p-2 rounded-lg ${tool.bg}`}>
                  <tool.icon className={`h-4 w-4 ${tool.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{tool.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) redirect("/onboarding");
  const insights = await getIndustryInsights();

  return (
    <div className="container mx-auto py-6 px-4">

      {/* Progress */}
      <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
      <AnalyticsCards />

      {/* All Tools */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">All Tools</h2>
          <Link href="/faq">
            <Button variant="outline" size="sm">
              Have questions? Visit FAQ →
            </Button>
          </Link>
        </div>

        <ToolSection title="🔍 Career Tools" tools={careerTools} cols={3} />
        <ToolSection title="🤖 AI Tools" tools={aiTools} cols={3} />
        <ToolSection title="🎤 Interview Tools" tools={interviewTools} cols={4} />
        <ToolSection title="🚀 Growth Tools" tools={growthTools} cols={3} />
      </div>

      {/* Industry Insights */}
      <h2 className="text-2xl font-bold mb-4 mt-4">Industry Insights</h2>
      <DashboardView insights={insights} />
    </div>
  );
}