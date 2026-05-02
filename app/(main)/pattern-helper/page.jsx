import { PatternForm } from "./_components/pattern-form";
export default function PatternHelperPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Pattern Recognition Helper</h1>
      <p className="text-muted-foreground mb-8">
        Describe any coding problem and instantly identify which DSA pattern
        applies — with a full pattern library and code templates.
      </p>
      <PatternForm />
    </div>
  );
}