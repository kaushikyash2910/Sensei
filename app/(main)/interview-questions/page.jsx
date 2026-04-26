import { QuestionsForm } from "./_components/questions-form";

export default function InterviewQuestionsPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Interview Question Generator</h1>
      <p className="text-muted-foreground mb-8">
        Paste any job description and get the top 10 most likely interview
        questions with tips on how to answer each one.
      </p>
      <QuestionsForm />
    </div>
  );
}