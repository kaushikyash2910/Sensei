"use client";

import { useState } from "react";
import { updateJobStatus, deleteJob } from "@/actions/job-tracker";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

const COLUMNS = ["Applied", "Interview", "Offer", "Rejected"];

const COLUMN_STYLES = {
  Applied:   "border-blue-400 bg-blue-50 dark:bg-blue-950/30",
  Interview: "border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30",
  Offer:     "border-green-400 bg-green-50 dark:bg-green-950/30",
  Rejected:  "border-red-400 bg-red-50 dark:bg-red-950/30",
};

const BADGE_STYLES = {
  Applied:   "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Interview: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Offer:     "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Rejected:  "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function KanbanBoard({ initialJobs }) {
  const [jobs, setJobs] = useState(initialJobs);

  const handleStatusChange = async (id, newStatus) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j))
    );
    try {
      await updateJobStatus(id, newStatus);
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    try {
      await deleteJob(id);
      toast.success("Job removed.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const colJobs = jobs.filter((j) => j.status === col);
        return (
          <div key={col} className={`rounded-xl border-t-4 ${COLUMN_STYLES[col]} p-3 min-h-[400px]`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{col}</h3>
              <Badge variant="secondary">{colJobs.length}</Badge>
            </div>

            <div className="space-y-3">
              {colJobs.map((job) => (
                <Card key={job.id} className="shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{job.company}</p>
                        <p className="text-xs text-muted-foreground truncate">{job.role}</p>
                        {job.deadline && (
                          <p className="text-xs text-orange-500 mt-1">
                           Deadline: {new Date(job.deadline).toLocaleDateString("en-GB")}
                          </p>
                        )}
                        {job.notes && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{job.notes}</p>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {job.jobUrl && (
                            <DropdownMenuItem onClick={() => window.open(job.jobUrl, "_blank")}>
                              <ExternalLink className="h-3 w-3 mr-2" /> View Job
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="font-medium text-xs text-muted-foreground" disabled>
                            Move to:
                          </DropdownMenuItem>
                          {COLUMNS.filter((c) => c !== col).map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() => handleStatusChange(job.id, status)}
                            >
                              <Badge className={`${BADGE_STYLES[status]} text-xs mr-2`}>{status}</Badge>
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => handleDelete(job.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {colJobs.length === 0 && (
                <p className="text-xs text-center text-muted-foreground py-8">
                  No jobs here yet
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}