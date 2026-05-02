import { ArchitectureForm } from "./_components/architecture-form";
export default function ArchitectureExplainerPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Architecture Diagram Explainer</h1>
      <p className="text-muted-foreground mb-8">
        Describe any system you built or want to understand — AI generates a
        text-based architecture diagram with components, data flow, and
        exportable markdown.
      </p>
      <ArchitectureForm />
    </div>
  );
}