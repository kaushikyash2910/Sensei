import { NegotiationForm } from "./_components/negotiation-form";

export default function SalaryNegotiationPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Salary Negotiation Script</h1>
      <p className="text-muted-foreground mb-8">
        Enter your job offer details and get a word-for-word negotiation
        script — email, phone call, and counter-offer strategy included.
      </p>
      <NegotiationForm />
    </div>
  );
}