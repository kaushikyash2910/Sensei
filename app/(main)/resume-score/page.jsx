import { ScoreForm } from "./_components/score-form";

export default function ResumeScorePage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Resume ATS Score Checker</h1>
      <p className="text-muted-foreground mb-8">
        Paste your resume and get an instant ATS score out of 100 with
        actionable feedback to land more interviews.
      </p>
      <ScoreForm />
    </div>
  );
}