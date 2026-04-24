"use client";

import { useState } from "react";
import { createJob } from "@/actions/job-tracker";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AddJobDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company: "", role: "", jobUrl: "", notes: "", deadline: "",
  });

  const handleSubmit = async () => {
    if (!form.company || !form.role) {
      toast.error("Company and role are required.");
      return;
    }
    setLoading(true);
    try {
      await createJob({
        ...form,
        deadline: form.deadline ? new Date(form.deadline) : null,
      });
      toast.success("Job added!");
      setOpen(false);
      setForm({ company: "", role: "", jobUrl: "", notes: "", deadline: "" });
    } catch {
      toast.error("Failed to add job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Job
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Job Application</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {[
            { label: "Company *", key: "company", placeholder: "e.g. Google" },
            { label: "Role *", key: "role", placeholder: "e.g. Software Engineer" },
            { label: "Job URL", key: "jobUrl", placeholder: "https://..." },
            { label: "Notes", key: "notes", placeholder: "Any notes..." },
          ].map(({ label, key, placeholder }) => (
            <div key={key} className="space-y-1">
              <Label>{label}</Label>
              <Input
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}
          <div className="space-y-1">
            <Label>Application Deadline</Label>
            <Input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
            />
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Application"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}