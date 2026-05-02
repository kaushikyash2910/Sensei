import { ExplainerForm } from "./_components/explainer-form";

export default function CodingExplainerPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Coding Challenge Explainer</h1>
      <p className="text-muted-foreground mb-8">
        Paste any LeetCode or HackerRank problem and get a complete explanation
        — approach, step-by-step solution, complexity analysis, dry run, and
        similar problems to practice.
      </p>
      <ExplainerForm />
    </div>
  );
}