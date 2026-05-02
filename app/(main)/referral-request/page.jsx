import { ReferralForm } from "./_components/referral-form";

export default function ReferralRequestPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Referral Request Generator</h1>
      <p className="text-muted-foreground mb-8">
        Generate a warm, non-awkward referral request message for LinkedIn,
        WhatsApp, or email — with a follow-up template included.
      </p>
      <ReferralForm />
    </div>
  );
}