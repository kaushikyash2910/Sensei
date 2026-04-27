import { CompareForm } from "./_components/compare-form";

export default function ResumeComparePage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Resume Comparison Tool</h1>
      <p className="text-muted-foreground mb-8">
        Paste your resume and a job description side by side — AI shows exactly
        what matches, what's missing, and suggests rewrites for weak sections.
      </p>
      <CompareForm />
    </div>
  );
}