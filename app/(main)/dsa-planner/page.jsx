import { PlannerForm } from "./_components/planner-form";

export default function DSAPlannerPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">DSA Study Planner</h1>
      <p className="text-muted-foreground mb-8">
        Select your interview timeline and get a complete day-by-day DSA study
        plan with topics, LeetCode problems, and revision schedule.
      </p>
      <PlannerForm />
    </div>
  );
}