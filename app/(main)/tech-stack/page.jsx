import { StackForm } from "./_components/stack-form";

export default function TechStackPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Tech Stack Recommender</h1>
      <p className="text-muted-foreground mb-8">
        Describe your project idea and get AI-powered tech stack recommendations
        with learning curve, job demand, pros and cons.
      </p>
      <StackForm />
    </div>
  );
}