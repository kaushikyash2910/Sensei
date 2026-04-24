import { getJobs } from "@/actions/job-tracker";
import { KanbanBoard } from "./_components/kanban-board";
import { AddJobDialog } from "./_components/add-job-dialog";

export default async function JobTrackerPage() {
  const jobs = await getJobs();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Job Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Track every application from applied to offer.
          </p>
        </div>
        <AddJobDialog />
      </div>

      <KanbanBoard initialJobs={jobs} />
    </div>
  );
}