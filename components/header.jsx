import React from "react";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
  Search,
  User,
  Briefcase,
  BriefcaseIcon,
  FileSearch,
  Mail,
  HelpCircle,
  Map,
  DollarSign,
  Github,
  Layers,
  GitCompare,
  Target,
  MessageCircle,
  Linkedin,
  Building2,
  GitBranch,
  Code2,
  BookOpen,
  Users,
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function Header() {
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <Image
            src={"/senseilogo.jpg"}
            alt="Sensai logo"
            width={200}
            height={60}
            className="h-12 py-1 w-auto object-contain"
          />
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Industry Insights
              </Button>
              <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>

            {/* Career Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="hidden md:flex items-center gap-2"
                >
                  <BriefcaseIcon className="h-4 w-4" />
                  <span>Career Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem asChild>
                  <Link href="/skill-gap" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Skill Gap Analysis
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile-analyzer"
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Profile Analyzer
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/job-tracker" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Job Tracker
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/resume-compare"
                    className="flex items-center gap-2"
                  >
                    <GitCompare className="h-4 w-4" />
                    Resume Comparison
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/career-goals"
                    className="flex items-center gap-2"
                  >
                    <Target className="h-4 w-4" />
                    Weekly Career Goals
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* AI Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="hidden md:flex items-center gap-2"
                >
                  <StarsIcon className="h-4 w-4" />
                  <span>AI Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link
                    href="/resume-score"
                    className="flex items-center gap-2"
                  >
                    <FileSearch className="h-4 w-4" />
                    Resume Score Checker
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cold-email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Cold Email Generator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/linkedin-headline"
                    className="flex items-center gap-2"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn Headline Generator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/interview-questions"
                    className="flex items-center gap-2"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Interview Question Generator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/career-roadmap"
                    className="flex items-center gap-2"
                  >
                    <Map className="h-4 w-4" />
                    Career Roadmap
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/salary-negotiation"
                    className="flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Salary Negotiation Script
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/readme-generator"
                    className="flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    GitHub README Generator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/tech-stack" className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Tech Stack Recommender
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/company-research"
                    className="flex items-center gap-2"
                  >
                    <Building2 className="h-4 w-4" />
                    Company Research
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/referral-request"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Referral Request
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tech & DSA Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="hidden md:flex items-center gap-2"
                >
                  <Code2 className="h-4 w-4" />
                  <span>Tech & DSA</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem asChild>
                  <Link href="/dsa-planner" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    DSA Study Planner
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/system-design"
                    className="flex items-center gap-2"
                  >
                    <GitBranch className="h-4 w-4" />
                    System Design Explainer
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/coding-explainer"
                    className="flex items-center gap-2"
                  >
                    <Code2 className="h-4 w-4" />
                    Coding Challenge Explainer
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Growth Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <StarsIcon className="h-4 w-4" />
                  <span className="hidden md:block">Growth Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/resume" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Build Resume
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/ai-cover-letter"
                    className="flex items-center gap-2"
                  >
                    <PenBox className="h-4 w-4" />
                    Cover Letter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/interview" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Interview Prep
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/hr-interview"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Mock HR Interview
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>
          <ThemeToggle />
          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
