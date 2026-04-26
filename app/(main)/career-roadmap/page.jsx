import { RoadmapForm } from "./_components/roadmap-form";

export default function CareerRoadmapPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Career Roadmap</h1>
      <p className="text-muted-foreground mb-8">
        Enter your current role and target role — get a step-by-step AI
        roadmap to get there with phases, tasks, and milestones.
      </p>
      <RoadmapForm />
    </div>
  );
}