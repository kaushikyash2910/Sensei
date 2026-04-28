import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft } from "lucide-react";

const faqCategories = [
  {
    category: "General",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    questions: [
      {
        question: "What is Sensei?",
        answer: "Sensei is an all-in-one AI-powered career coaching platform with 20+ tools to help you land your dream job. From resume building and ATS scoring to mock interviews, skill gap analysis, job tracking, and salary negotiation — everything is in one place.",
      },
      {
        question: "What makes Sensei different from LinkedIn or Naukri?",
        answer: "Unlike LinkedIn or Naukri which are job listing platforms, Sensei is a career preparation platform. It actively helps you improve your resume, prepare for interviews, analyze skill gaps, generate cold emails, negotiate salary, and track applications — all powered by AI.",
      },
      {
        question: "Is my data secure with Sensei?",
        answer: "Yes. We use Clerk for authentication with industry-standard encryption. Your resume, cover letters, and profile data are stored securely and never shared with third parties.",
      },
      {
        question: "Is Sensei free to use?",
        answer: "Sensei is currently available for use. All AI-powered tools are accessible after signing up and completing your onboarding profile.",
      },
    ],
  },
  {
    category: "Resume Tools",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    questions: [
      {
        question: "How does the Resume ATS Score Checker work?",
        answer: "You can either upload your resume as a PDF or paste the text. Sensei's AI analyzes it against ATS (Applicant Tracking System) standards and gives you a score out of 100 with a detailed breakdown of formatting, keywords, experience, education, and quick wins to improve your score.",
      },
      {
        question: "Can I upload a PDF resume for ATS analysis?",
        answer: "Yes! The Resume Score Checker supports PDF uploads via drag-and-drop or file browser. The AI extracts text from your PDF and analyzes it automatically. You can also paste text manually if you prefer.",
      },
      {
        question: "What is the Resume Comparison Tool?",
        answer: "The Resume Comparison Tool has 3 modes: (1) Paste your resume and compare it against a job description to see what matches and what's missing, (2) Upload a PDF resume and compare it against a JD, (3) Compare two resumes against each other to see which is stronger and what each is missing.",
      },
      {
        question: "How does the AI Resume Builder work?",
        answer: "The Resume Builder uses your industry, skills, and experience from your Sensei profile to generate a fully formatted, ATS-optimized resume. You can edit every section using the built-in markdown editor and save multiple versions.",
      },
    ],
  },
  {
    category: "Interview Tools",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    questions: [
      {
        question: "What is the Mock HR Interview Simulator?",
        answer: "The Mock HR Interview Simulator is a full conversational interview where the AI acts as a real HR interviewer. It asks you 5 questions based on your role and company, gives live feedback after each answer, and provides a final score out of 10 with strengths and areas to improve.",
      },
      {
        question: "How does the Interview Question Generator work?",
        answer: "Paste any job description and select your experience level. The AI generates the top 10 most likely interview questions with category labels (Technical/Behavioral/HR), difficulty ratings, how-to-answer tips, key points, and a full model answer for each question. You can download all questions as a PDF.",
      },
      {
        question: "What is Interview Answer Feedback?",
        answer: "Inside the Interview Prep section, you can switch to the 'Type/Speak Answer' tab on any question. Type your answer or use voice input — the AI scores your answer out of 10, tells you what was good, what was missing, gives a model answer, and provides 3 improvement tips.",
      },
      {
        question: "Can I practice voice answers for interviews?",
        answer: "Yes! The Interview Answer Feedback feature supports voice input using the Web Speech API. Click the microphone button, speak your answer, and the AI evaluates it just like a typed answer. Note: voice input works best in Chrome and Edge browsers.",
      },
    ],
  },
  {
    category: "AI Tools",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    questions: [
      {
        question: "How does the Skill Gap Analyzer work?",
        answer: "Paste any job description into the Skill Gap Analyzer. Sensei's AI compares it against your profile skills and gives you a match score, a list of skills you already have, skills you're missing, and a personalized learning plan with resources and timeframes for each missing skill.",
      },
      {
        question: "What is the Career Roadmap?",
        answer: "Enter your current role and target role — the AI generates a detailed phase-by-phase roadmap to get there. Each phase includes a goal, specific tasks, recommended resources, and a milestone to hit. It also shows your expected salary at the target role.",
      },
      {
        question: "How does the Cold Email Generator work?",
        answer: "Enter the company name, role, your name, and a brief background. The AI generates a personalized cold outreach email to a recruiter with a compelling subject line, the main email, and a follow-up email to send after one week of no reply. Your last generated email is saved automatically.",
      },
      {
        question: "What is the LinkedIn Headline Generator?",
        answer: "Enter your current role, target role, top skills, and years of experience. The AI generates 5 different LinkedIn headlines — each with a different style (achievement-focused, keyword-rich, story-driven, value-proposition, bold & direct) with an explanation of why each works. You can copy any headline with one click.",
      },
      {
        question: "What is the GitHub README Generator?",
        answer: "Enter your project name, description, tech stack, and key features. The AI generates a complete professional README.md file with badges, installation steps, usage guide, contributing section, and license. You can copy it to clipboard or download it directly as a README.md file.",
      },
      {
        question: "How does the Tech Stack Recommender work?",
        answer: "Describe your project idea, select your experience level, budget, and timeline. The AI recommends the best tech stack with reasons, learning curve, and job market demand for each technology. Results auto-update when you change your preferences. You can also compare two stacks side by side and save your favourite recommendation.",
      },
      {
        question: "What is the Salary Negotiation Script?",
        answer: "Enter your offered salary, expected salary, role, and company. The AI generates a word-for-word negotiation email, a phone call script, a recommended counter-offer, key arguments to use, things to avoid, best case outcome, and your walk-away point.",
      },
    ],
  },
  {
    category: "Career Planning",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    questions: [
      {
        question: "How does the Job Tracker work?",
        answer: "The Job Tracker is a Kanban-style board where you add jobs you've applied to and move them across columns — Applied, Interview, Offer, and Rejected. Each card shows the company, role, notes, deadline, and a link to the job posting. Use the dropdown menu on each card to move it to a different status or delete it.",
      },
      {
        question: "What are Weekly Career Goals?",
        answer: "Weekly Career Goals lets you set and track goals for the week — like 'Apply to 5 companies' or 'Complete a React course'. Each goal has a category, priority level (High/Medium/Low), due date, and notes. A progress bar shows your weekly completion rate and a 🔥 streak counter tracks how many weeks in a row you complete all your goals.",
      },
      {
        question: "What is the Profile Analyzer?",
        answer: "The Profile Analyzer reviews your LinkedIn or GitHub profile from a recruiter's perspective. For GitHub, you can enter your profile URL, fetch your repositories, select the ones you want included, and the AI auto-generates a profile description. The AI then scores your profile out of 100 and gives specific improvements with actionable fixes.",
      },
    ],
  },
  {
    category: "Technical",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    questions: [
      {
        question: "Why does my last search result appear when I visit a page?",
        answer: "Sensei automatically saves your last generated result in your browser's local storage. This means when you revisit a page like Cold Email Generator or Career Roadmap, your previous result loads instantly without needing to regenerate. Click 'Clear' to remove the saved result or click 'Generate' again to create a new one.",
      },
      {
        question: "Which browsers support voice input for interviews?",
        answer: "Voice input for interview answers uses the Web Speech API which is supported in Google Chrome and Microsoft Edge. It may not work in Safari or Firefox. If voice input doesn't work, you can always type your answer in the text area instead.",
      },
      {
        question: "Can I download my interview questions as a PDF?",
        answer: "Yes! After generating interview questions, click the 'Download PDF' button in the top right of the results. This opens a formatted print view of all 10 questions with model answers, which you can save as a PDF using your browser's print-to-PDF feature.",
      },
      {
        question: "How do I update my industry or skills for better AI results?",
        answer: "Your industry and skills are set during onboarding and are used by the Skill Gap Analyzer, Interview Prep, and Industry Insights. To update them, go to your profile settings in the top right corner and update your industry, experience, and skills.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-4xl font-bold mb-3">Frequently Asked Questions</h1>
        <p className="text-muted-foreground text-lg">
          Everything you need to know about Sensei's 20+ AI-powered career tools.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {faqCategories.map((cat) => (
          <Badge key={cat.category} className={cat.color}>
            {cat.category}
          </Badge>
        ))}
      </div>

      {/* FAQ Sections */}
      <div className="space-y-10">
        {faqCategories.map((cat) => (
          <div key={cat.category}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold">{cat.category}</h2>
              <Badge className={cat.color}>{cat.questions.length} questions</Badge>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {cat.questions.map((faq, index) => (
                <AccordionItem key={index} value={`${cat.category}-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-12 text-center border rounded-xl p-8 bg-muted/30">
        <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
        <p className="text-muted-foreground mb-4">
          Use the AI Chat Assistant — click the chat bubble in the bottom right corner of any page.
        </p>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}