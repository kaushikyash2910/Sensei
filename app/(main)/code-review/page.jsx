import { CodeReviewForm } from "./_components/code-review-form";

export default function CodeReviewPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Code Review & Optimizer</h1>
      <p className="text-muted-foreground mb-8">
        Paste your code and get a quality score, bug detection, side-by-side
        before/after comparison, and a fully optimized rewrite.
      </p>
      <CodeReviewForm />
    </div>
  );
}