import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Code2,
  FileText,
  Mic,
  Search,
  BarChart3,
  Mail,
} from "lucide-react";
import HeroSection from "@/components/hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { howItWorks } from "@/data/howItWorks";

const toolCategories = [
  {
    icon: <FileText className="h-5 w-5" />,
    label: "Resume Tools",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    tools: ["ATS Score Checker", "Resume Builder", "Resume Comparison", "Cover Letter AI"],
  },
  {
    icon: <Mic className="h-5 w-5" />,
    label: "Interview Tools",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    tools: ["Mock HR Interview", "Interview Questions", "Answer Feedback", "MCQ Practice"],
  },
  {
    icon: <Search className="h-5 w-5" />,
    label: "Career Tools",
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    tools: ["Skill Gap Analyzer", "Profile Analyzer", "Job Tracker", "Career Goals"],
  },
  {
    icon: <Mail className="h-5 w-5" />,
    label: "AI Tools",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    tools: ["Cold Email", "LinkedIn Headline", "Career Roadmap", "Salary Negotiation"],
  },
  {
    icon: <Code2 className="h-5 w-5" />,
    label: "Tech & DSA",
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
    tools: ["DSA Study Planner", "Code Review", "Mock Coding Interview", "System Design Quiz"],
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    label: "Analytics",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
    tools: ["Industry Insights", "Dashboard Analytics", "Tech History", "App Success Rate"],
  },
];

const trustBadges = [
  { icon: <Zap className="h-4 w-4" />, text: "Powered by Groq + LLaMA 3.3 70B" },
  { icon: <Shield className="h-4 w-4" />, text: "Secure with Clerk Auth" },
  { icon: <Star className="h-4 w-4" />, text: "30+ AI-Powered Tools" },
  { icon: <Users className="h-4 w-4" />, text: "Built for Students & Professionals" },
];

export default function LandingPage() {
  return (
    <>
      <div className="grid-background"></div>

      {/* Hero Section */}
      <HeroSection />

      {/* Trust Badges */}
      <section className="w-full py-6 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-primary">{badge.icon}</span>
                {badge.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool Categories — "What's Inside" */}
      <section className="w-full py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="outline" className="mb-3">30+ Tools in One Place</Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-muted-foreground">
              From resume building to DSA prep — Sensei covers your entire career journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {toolCategories.map((cat, i) => (
              <div key={i}
                className="group relative rounded-2xl border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cat.color}`}>
                    {cat.icon}
                  </div>
                  <h3 className="font-bold text-base">{cat.label}</h3>
                </div>
                <div className="space-y-1.5">
                  {cat.tools.map((tool) => (
                    <div key={tool} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      {tool}
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Explore All Tools <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-3">Core Features</Badge>
            <h2 className="text-3xl font-bold tracking-tighter mb-3">
              Powerful Features for Your Career Growth
            </h2>
            <p className="text-muted-foreground">
              Every tool is AI-powered, personalized to your profile, and built to get you hired faster.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary hover:shadow-lg transition-all duration-300 group"
              >
                <CardContent className="pt-6 text-center flex flex-col items-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="p-3 rounded-2xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { value: "30+", label: "AI-Powered Tools", icon: <Zap className="h-5 w-5 text-primary mx-auto mb-2" /> },
              { value: "50+", label: "Industries Covered", icon: <TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" /> },
              { value: "1000+", label: "Interview Questions", icon: <Mic className="h-5 w-5 text-primary mx-auto mb-2" /> },
              { value: "24/7", label: "AI Support", icon: <Shield className="h-5 w-5 text-primary mx-auto mb-2" /> },
            ].map(({ value, label, icon }) => (
              <div key={label} className="flex flex-col items-center justify-center space-y-1 p-6 rounded-2xl bg-muted/40 border hover:border-primary/40 transition-colors">
                {icon}
                <h3 className="text-4xl font-black text-primary">{value}</h3>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="mb-3">Simple Process</Badge>
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground">
              Six simple steps to accelerate your career growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center text-center space-y-4 p-6 rounded-2xl border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-300"
              >
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-3">Testimonials</Badge>
            <h2 className="text-3xl font-bold mb-3">What Our Users Say</h2>
            <p className="text-muted-foreground">Real results from real users who used Sensei to level up their careers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonial.map((item, index) => (
              <Card key={index} className="bg-card border-2 hover:border-primary/40 hover:shadow-md transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-4">
                    {/* Stars */}
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          width={48}
                          height={48}
                          src={item.image}
                          alt={item.author}
                          className="rounded-full object-cover border-2 border-primary/20"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.author}</p>
                        <p className="text-xs text-muted-foreground">{item.role}</p>
                        <p className="text-xs text-primary font-medium">{item.company}</p>
                      </div>
                    </div>
                    <blockquote>
                      <p className="text-muted-foreground text-sm italic leading-relaxed relative">
                        <span className="text-3xl text-primary absolute -top-4 -left-2">&quot;</span>
                        {item.quote}
                        <span className="text-3xl text-primary absolute -bottom-4">&quot;</span>
                      </p>
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="mb-3">FAQ</Badge>
            <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Find answers to common questions about Sensei's tools and features.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
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
            <div className="text-center mt-8">
              <Link href="/faq">
                <Button variant="outline" size="lg">
                  See all FAQs (30+ questions) →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl gradient p-10 md:p-16">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
            <div className="relative flex flex-col items-center justify-center space-y-5 text-center max-w-3xl mx-auto">
              <Badge className="bg-white/20 text-white border-white/30">
                🚀 Start for Free
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl">
                Ready to Accelerate Your Career?
              </h2>
              <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
                Join professionals who are using Sensei's 30+ AI tools to build better resumes,
                ace interviews, and land their dream jobs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Link href="/dashboard" passHref>
                  <Button size="lg" variant="secondary" className="h-12 px-8 gap-2 animate-bounce">
                    Start Your Journey Today <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/faq" passHref>
                  <Button size="lg" variant="outline" className="h-12 px-8 border-white/40 text-white hover:bg-white/10">
                    See All Features →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}