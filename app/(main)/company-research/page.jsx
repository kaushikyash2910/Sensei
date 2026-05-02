import { ResearchForm } from "./_components/research-form";

export default function CompanyResearchPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Company Research Tool</h1>
      <p className="text-muted-foreground mb-8">
        Enter any company name and get a complete overview — culture, tech
        stack, interview process, salary ranges, employee sentiment, and
        interview tips.
      </p>
      <ResearchForm />
    </div>
  );
}