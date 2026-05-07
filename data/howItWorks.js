import {
  UserPlus, FileEdit, Search, Users,
  Briefcase, LineChart, Code2, Map,
} from "lucide-react";

export const howItWorks = [
  {
    title: "Complete Your Profile",
    description:
      "Share your industry, skills, and experience level during onboarding for fully personalized AI guidance.",
    icon: <UserPlus className="w-8 h-8 text-primary" />,
  },
  {
    title: "Build Your Documents",
    description:
      "Create ATS-optimized resumes and cover letters, then check your resume ATS score with PDF upload support.",
    icon: <FileEdit className="w-8 h-8 text-primary" />,
  },
  {
    title: "Analyze Your Profile & Skills",
    description:
      "Use Skill Gap Analyzer, Profile Analyzer, and Resume Comparison to find exactly what recruiters want.",
    icon: <Search className="w-8 h-8 text-primary" />,
  },
  {
    title: "Prepare for Interviews",
    description:
      "Generate role-specific interview questions with model answers, practice mock HR interviews with voice input.",
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    title: "Use AI Tools & Tech Tools",
    description:
      "Generate cold emails, LinkedIn headlines, salary scripts, career roadmaps, DSA plans, and code reviews.",
    icon: <Code2 className="w-8 h-8 text-primary" />,
  },
  {
    title: "Track & Improve",
    description:
      "Monitor job applications on a Kanban board, set weekly career goals, and track your progress over time.",
    icon: <LineChart className="w-8 h-8 text-primary" />,
  },
];