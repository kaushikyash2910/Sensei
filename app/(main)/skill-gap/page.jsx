import { SkillGapForm } from "./_components/skill-gap-form";

export default function SkillGapPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Skill Gap Analyzer</h1>
      <p className="text-muted-foreground mb-8">
        Paste any job description and find out exactly which skills you're
        missing — with a personalised learning plan.
      </p>
      <SkillGapForm />
    </div>
  );
}