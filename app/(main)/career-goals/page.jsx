import { getGoals, getStreak } from "@/actions/career-goals";
import { GoalsBoard } from "./_components/goals-board";
import { AddGoalDialog } from "./_components/add-goal-dialog";

export default async function CareerGoalsPage() {
  const [goals, streak] = await Promise.all([getGoals(), getStreak()]);

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Weekly Career Goals</h1>
          <p className="text-muted-foreground mt-1">
            Set, track, and complete your weekly career goals.
          </p>
        </div>
        <AddGoalDialog />
      </div>
      <GoalsBoard initialGoals={goals} streak={streak} />
    </div>
  );
}