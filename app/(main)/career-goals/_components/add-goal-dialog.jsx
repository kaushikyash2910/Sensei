"use client";

import { useState } from "react";
import { createGoal } from "@/actions/career-goals";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["Job Search", "Learning", "Networking", "Interview Prep", "Resume", "General"];
const PRIORITIES = ["High", "Medium", "Low"];

export function AddGoalDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", category: "General", priority: "Medium", notes: "", dueDate: "",
  });

  const handleSubmit = async () => {
    if (!form.title) { toast.error("Please enter a goal."); return; }
    setLoading(true);
    try {
      await createGoal({ ...form, dueDate: form.dueDate ? new Date(form.dueDate) : null });
      toast.success("Goal added!");
      setOpen(false);
      setForm({ title: "", category: "General", priority: "Medium", notes: "", dueDate: "" });
    } catch { toast.error("Failed to add goal."); }
    finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" />Add Goal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Weekly Career Goal</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Goal *</Label>
            <Input placeholder="e.g. Apply to 5 companies this week"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Due Date</Label>
            <Input type="date" value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
          </div>

          <div className="space-y-1">
            <Label>Notes (optional)</Label>
            <Textarea
              placeholder="e.g. Applied to Google, waiting for reply..."
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Goal"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}