import { ConceptForm } from "./_components/concept-form";
export default function ConceptExplainerPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Tech Concept Explainer</h1>
      <p className="text-muted-foreground mb-8">
        Type any tech concept and get it explained at your level — ELI5,
        Intermediate, or Senior Dev — with analogies and interview questions.
      </p>
      <ConceptForm />
    </div>
  );
}