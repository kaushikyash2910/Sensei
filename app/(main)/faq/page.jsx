import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  FileText,
  Mic,
  Search,
  Mail,
  Code2,
  BarChart3,
  HelpCircle,
  Wrench,
} from "lucide-react";

const faqCategories = [
  {
    category: "General",
    icon: <HelpCircle className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    questions: [
      {
        question: "What is Sensei?",
        answer:
          "Sensei is an all-in-one AI-powered career coaching platform with 30+ tools to help you land your dream job. From resume building and ATS scoring to mock interviews, skill gap analysis, job tracking, salary negotiation, DSA study planners, code review, and system design tools — everything is in one place.",
      },
      {
        question: "What makes Sensei different from LinkedIn or Naukri?",
        answer:
          "Unlike LinkedIn or Naukri which are job listing platforms, Sensei is a career preparation platform. It actively helps you improve your resume, prepare for interviews, analyze skill gaps, generate cold emails, negotiate salary, practice DSA, and track applications — all powered by AI.",
      },
      {
        question: "Is my data secure with Sensei?",
        answer:
          "Yes. We use Clerk for authentication with industry-standard encryption. Your resume, cover letters, profile data, and tech history are stored securely in a PostgreSQL database and never shared with third parties.",
      },
      {
        question: "Is Sensei free to use?",
        answer:
          "Sensei is currently available for use. All 30+ AI-powered tools are accessible after signing up and completing your onboarding profile.",
      },
    ],
  },
  {
    category: "Resume Tools",
    icon: <FileText className="h-4 w-4" />,
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    questions: [
      {
        question: "How does the Resume ATS Score Checker work?",
        answer:
          "Upload your resume as a PDF (drag and drop supported) or paste the text. Sensei's AI gives you a score out of 100 with an interactive section-by-section breakdown — formatting, keywords, experience, education, and skills — plus top issues and quick wins to improve immediately.",
      },
      {
        question: "Can I upload a PDF resume for ATS analysis?",
        answer:
          "Yes! The Resume Score Checker supports PDF uploads via drag-and-drop or file browser. The AI extracts text from your PDF and analyzes it automatically. You can also paste text manually if you prefer.",
      },
      {
        question: "What is the Resume Comparison Tool?",
        answer:
          "The Resume Comparison Tool has 3 modes: (1) Paste your resume and compare it against a job description, (2) Upload a PDF resume and compare it against a JD, (3) Compare two resumes against each other to see which is stronger and what each is missing.",
      },
      {
        question: "How does the AI Resume Builder work?",
        answer:
          "The Resume Builder uses your industry, skills, and experience from your Sensei profile to generate a fully formatted, ATS-optimized resume. You can edit every section using the built-in markdown editor and save multiple versions.",
      },
    ],
  },
  {
    category: "Interview Tools",
    icon: <Mic className="h-4 w-4" />,
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    questions: [
      {
        question: "What is the Mock HR Interview Simulator?",
        answer:
          "A full conversational mock interview where the AI acts as a real HR interviewer. It asks 5 questions based on your role and company, gives live feedback after each answer, and provides a final score out of 10 with strengths and areas to improve. You can answer by typing or using voice input.",
      },
      {
        question: "How does the Interview Question Generator work?",
        answer:
          "Paste any job description and select your experience level. The AI generates the top 10 most likely interview questions with category labels (Technical/Behavioral/HR), difficulty ratings, how-to-answer tips, key points, and a full model answer for each question. You can download all questions as a PDF.",
      },
      {
        question: "What is Interview Answer Feedback?",
        answer:
          "Inside the Interview Prep section, you can switch to the 'Type/Speak Answer' tab on any question. Type your answer or speak it using the mic — the AI scores your answer out of 10, tells you what was good, what was missing, gives a model answer, and provides 3 improvement tips.",
      },
      {
        question: "Can I practice voice answers for interviews?",
        answer:
          "Yes! The Interview Answer Feedback and Mock HR Interview features both support voice input using the Web Speech API. Click the microphone button, speak your answer, and the AI evaluates it. Voice input works best in Chrome and Edge browsers.",
      },
    ],
  },
  {
    category: "AI Tools",
    icon: <Mail className="h-4 w-4" />,
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    questions: [
      {
        question: "How does the Skill Gap Analyzer work?",
        answer:
          "Paste any job description into the Skill Gap Analyzer. Sensei's AI compares it against your profile skills and gives you a match score out of 100, a list of skills you already have, skills you're missing, and a personalized learning plan with resources and timeframes for each missing skill.",
      },
      {
        question: "What is the Career Roadmap Generator?",
        answer:
          "Enter your current role and target role — the AI generates a detailed phase-by-phase roadmap. Each phase includes a goal, specific tasks with checkboxes to track completion, recommended resources, and a milestone. You can also download the roadmap as a PDF.",
      },
      {
        question: "How does the Cold Email Generator work?",
        answer:
          "Enter the company name, role, your name, and a brief background. The AI generates a personalized cold outreach email with a subject line, the main email, and a follow-up email to send after one week. Your last generated email is saved automatically.",
      },
      {
        question: "What is the LinkedIn Headline Generator?",
        answer:
          "Enter your current role, target role, top skills, and years of experience. The AI generates 5 different LinkedIn headlines — each with a different style — with character count, why it works, and a favourites system to save the ones you like.",
      },
      {
        question: "What is the GitHub README Generator?",
        answer:
          "Enter your project name, description, tech stack, and key features. The AI generates a complete professional README.md with badges, installation steps, and usage guide. Preview it rendered or view raw markdown, then copy or download the .md file directly.",
      },
      {
        question: "How does the Tech Stack Recommender work?",
        answer:
          "Describe your project idea, select your experience level, budget, and timeline. The AI recommends the best tech stack with reasons, learning curve, a job demand bar chart, a week-by-week learning path, and famous apps built with that stack. Results auto-update when you change preferences.",
      },
      {
        question: "What is the Salary Negotiation Script?",
        answer:
          "Enter your offered salary, expected salary, role, and company. The AI generates a word-for-word negotiation email, a phone call script, a counter-offer recommendation, key arguments to use, things to avoid, and your walk-away point.",
      },
    ],
  },
  {
    category: "Career Planning",
    icon: <Search className="h-4 w-4" />,
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    questions: [
      {
        question: "How does the Job Tracker work?",
        answer:
          "The Job Tracker is a Kanban-style board where you add jobs you've applied to and move them across columns — Applied, Interview, Offer, and Rejected. Each card shows the company, role, notes, deadline, and a link to the job posting.",
      },
      {
        question: "What are Weekly Career Goals?",
        answer:
          "Weekly Career Goals lets you set and track goals for the week with category labels, priority levels (High/Medium/Low), due dates, and notes. A progress bar shows your weekly completion rate and a 🔥 streak counter tracks how many weeks in a row you complete all your goals.",
      },
      {
        question: "What is the Profile Analyzer?",
        answer:
          "The Profile Analyzer reviews your LinkedIn or GitHub profile from a recruiter's perspective. For GitHub, you can enter your profile URL, fetch your public repositories, select which ones to include, and the AI auto-generates a profile description. The AI scores your profile out of 100 and gives specific improvements with actionable fixes.",
      },
    ],
  },
  {
    category: "Tech & DSA",
    icon: <Code2 className="h-4 w-4" />,
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
    questions: [
      {
        question: "What Tech & DSA tools does Sensei have?",
        answer:
          "Sensei has 11 Tech & DSA tools: DSA Study Planner, System Design Explainer, Coding Challenge Explainer, Code Review & Optimizer, Pattern Recognition Helper, Mock Coding Interview (with live timer and hint system), System Design Quiz (progressive difficulty), Architecture Explainer (with ASCII diagrams), Tech Concept Explainer, Code Language Converter, and Database Query Optimizer.",
      },
      {
        question: "What is the Mock Coding Interview?",
        answer:
          "The Mock Coding Interview gives you a real timed problem (30 minutes) based on your chosen difficulty and topic. You write your solution, can use up to 3 hints (each costs score points), then submit — the AI evaluates correctness, efficiency, code quality, approach, and time management, and gives you a verdict like a real interviewer.",
      },
      {
        question: "What is the System Design Quiz?",
        answer:
          "The System Design Quiz asks 5 progressive system design questions — difficulty adapts based on your answers. After each answer the AI gives detailed feedback, covered points, missed points, and a model answer. Your final score is saved to your Tech History.",
      },
      {
        question: "Is my Tech & DSA search history saved?",
        answer:
          "Yes! Every search across all Tech & DSA tools is saved to your account database. Visit the Tech History page to see all past searches, filter by tool type, search through history, delete individual items, clear by feature, or clear all history.",
      },
    ],
  },
  {
    category: "Technical",
    icon: <Wrench className="h-4 w-4" />,
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    questions: [
      {
        question: "Why does my last search result appear when I visit a page?",
        answer:
          "Sensei automatically saves your last generated result in your browser's local storage for tools like Cold Email, Career Roadmap, LinkedIn Headline, Skill Gap, and Profile Analyzer. This means your previous result loads instantly without regenerating. Click 'Clear' to remove it or click 'Generate' again to create a new one.",
      },
      {
        question: "Which browsers support voice input for interviews?",
        answer:
          "Voice input uses the Web Speech API, supported in Google Chrome and Microsoft Edge. It may not work in Safari or Firefox. If voice input doesn't work, you can always type your answer in the text area instead.",
      },
      {
        question: "Can I download my interview questions as a PDF?",
        answer:
          "Yes! After generating interview questions, click the 'Download PDF' button. This opens a formatted print view of all 10 questions with model answers, which you can save as a PDF using your browser's print-to-PDF feature.",
      },
      {
        question:
          "How do I update my industry or skills for better AI results?",
        answer:
          "Your industry and skills are set during onboarding and used by the Skill Gap Analyzer, Interview Prep, and Industry Insights. To update them, go to your profile settings in the top right corner.",
      },
    ],
  },
];

const categoryStats = [
  {
    icon: <FileText className="h-5 w-5" />,
    label: "Resume Tools",
    count: 4,
    color: "text-green-500",
  },
  {
    icon: <Mic className="h-5 w-5" />,
    label: "Interview",
    count: 4,
    color: "text-purple-500",
  },
  {
    icon: <Mail className="h-5 w-5" />,
    label: "AI Tools",
    count: 7,
    color: "text-orange-500",
  },
  {
    icon: <Search className="h-5 w-5" />,
    label: "Career Planning",
    count: 3,
    color: "text-yellow-500",
  },
  {
    icon: <Code2 className="h-5 w-5" />,
    label: "Tech & DSA",
    count: 4,
    color: "text-rose-500",
  },
  {
    icon: <Wrench className="h-5 w-5" />,
    label: "Technical",
    count: 4,
    color: "text-gray-500",
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <Badge variant="outline" className="mb-3">
              30+ Questions Answered
            </Badge>
            <h1 className="text-4xl font-bold mb-3">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Everything you need to know about Sensei's 30+ AI-powered career
              tools — from resume building to DSA prep.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        {categoryStats.map((stat) => (
          <div
            key={stat.label}
            className="border rounded-xl p-3 text-center bg-card hover:border-primary/40 transition-colors"
          >
            <div className={`${stat.color} flex justify-center mb-1`}>
              {stat.icon}
            </div>
            <p className="font-bold text-lg">{stat.count}</p>
            <p className="text-xs text-muted-foreground leading-tight">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        {faqCategories.map((cat) => (
          <Badge
            key={cat.category}
            className={`${cat.color} flex items-center gap-1.5 px-3 py-1`}
          >
            {cat.icon}
            {cat.category}
            <span className="opacity-70">· {cat.questions.length}</span>
          </Badge>
        ))}
      </div>

      {/* FAQ Sections */}
      <div className="space-y-10">
        {faqCategories.map((cat) => (
          <div key={cat.category}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.color}`}
              >
                {cat.icon}
              </div>
              <h2 className="text-xl font-bold">{cat.category}</h2>
              <Badge className={cat.color}>
                {cat.questions.length} questions
              </Badge>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {cat.questions.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`${cat.category}-${index}`}
                  className="border rounded-xl px-4 bg-card hover:border-primary/40 transition-colors"
                >
                  <AccordionTrigger className="text-left font-semibold text-sm py-4 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-14 relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-background to-muted/30 p-8 text-center">
        <div className="relative z-10">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="h-7 w-7 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Use the AI Chat Assistant — click the chat bubble in the bottom
            right corner on any page for instant answers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Go to Dashboard <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
