import { HeadlineForm } from "./_components/headline-form";

export default function LinkedInHeadlinePage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">LinkedIn Headline Generator</h1>
      <p className="text-muted-foreground mb-8">
        Generate 5 powerful LinkedIn headlines that attract recruiters and
        showcase your personal brand.
      </p>
      <HeadlineForm />
    </div>
  );
}