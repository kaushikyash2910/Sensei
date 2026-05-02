import { DesignQuizSimulator } from "./_components/design-quiz-simulator";
export default function DesignQuizPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">System Design Quiz</h1>
      <p className="text-muted-foreground mb-8">
        Progressive difficulty quiz — AI asks system design questions, you
        answer, AI scores each answer and adapts difficulty based on performance.
      </p>
      <DesignQuizSimulator />
    </div>
  );
}