import { UserPlus, FileEdit, Users, LineChart, Search, Briefcase } from "lucide-react";

export const howItWorks = [
  {
    title: "Professional Onboarding",
    description: "Share your industry and expertise for personalized AI guidance tailored to your goals",
    icon: <UserPlus className="w-8 h-8 text-primary" />,
  },
  {
    title: "Craft Your Documents",
    description: "Create ATS-optimized resumes, cover letters, and check your resume ATS score instantly",
    icon: <FileEdit className="w-8 h-8 text-primary" />,
  },
  {
    title: "Analyze & Optimize",
    description: "Use the Skill Gap Analyzer and Profile Analyzer to find exactly what recruiters are looking for",
    icon: <Search className="w-8 h-8 text-primary" />,
  },
  {
    title: "Prepare for Interviews",
    description: "Generate role-specific interview questions with model answers and practice with AI mock interviews",
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    title: "Track Applications",
    description: "Manage all your job applications in a Kanban board — from Applied to Offer",
    icon: <Briefcase className="w-8 h-8 text-primary" />,
  },
  {
    title: "Track Your Progress",
    description: "Monitor improvements with detailed performance analytics and your career roadmap",
    icon: <LineChart className="w-8 h-8 text-primary" />,
  },
];