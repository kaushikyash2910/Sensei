import { ReadmeForm } from "./_components/readme-form";

export default function ReadmeGeneratorPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">GitHub README Generator</h1>
      <p className="text-muted-foreground mb-8">
        Enter your project details and get a professional README.md with
        badges, installation steps, and usage guide — ready to copy or download.
      </p>
      <ReadmeForm />
    </div>
  );
}