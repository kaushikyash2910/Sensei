import { AnalyzerForm } from "./_components/analyzer-form";

export default function ProfileAnalyzerPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Profile Analyzer</h1>
      <p className="text-muted-foreground mb-8">
        Get AI-powered recruiter feedback on your LinkedIn or GitHub profile.
        Find out exactly what to improve to stand out.
      </p>
      <AnalyzerForm />
    </div>
  );
}