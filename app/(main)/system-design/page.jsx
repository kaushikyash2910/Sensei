import { DesignForm } from "./_components/design-form";

export default function SystemDesignPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">System Design Explainer</h1>
      <p className="text-muted-foreground mb-8">
        Enter any system design topic and get a complete structured explanation
        — requirements, components, architecture, tradeoffs, and interview tips.
      </p>
      <DesignForm />
    </div>
  );
}