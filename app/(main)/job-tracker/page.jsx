import { getJobs } from "@/actions/job-tracker";
import { KanbanBoard } from "./_components/kanban-board";
import { AddJobDialog } from "./_components/add-job-dialog";
import { SuccessTracker } from "./_components/success-tracker";
import { JobTrackerExtras } from "./_components/job-tracker-extras";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function JobTrackerPage() {
  const jobs = await getJobs();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Job Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Track every application and analyze your success rate.
          </p>
        </div>
        <AddJobDialog />
      </div>

      <Tabs defaultValue="kanban">
        <TabsList className="mb-6 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="kanban">📋 Kanban Board</TabsTrigger>
          <TabsTrigger value="tools">🛠️ Smart Tools</TabsTrigger>
          <TabsTrigger value="analytics">📊 Success Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban">
          <KanbanBoard initialJobs={jobs} />
        </TabsContent>
        <TabsContent value="tools">
          <JobTrackerExtras jobs={jobs} />
        </TabsContent>
        <TabsContent value="analytics">
          <SuccessTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
}