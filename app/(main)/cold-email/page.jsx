import { EmailForm } from "./_components/email-form";

export default function ColdEmailPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Cold Email Generator</h1>
      <p className="text-muted-foreground mb-8">
        Generate a personalized cold outreach email to a recruiter or hiring
        manager — plus a follow-up email if they don't reply.
      </p>
      <EmailForm />
    </div>
  );
}