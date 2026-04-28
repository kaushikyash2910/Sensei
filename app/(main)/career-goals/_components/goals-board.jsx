"use client";

import { useState } from "react";
import { toggleGoal, deleteGoal, resetWeek, updateGoalNotes } from "@/actions/career-goals";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const categoryColor = {
  "Job Search": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Learning": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Networking": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Interview Prep": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "Resume": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "General": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

const priorityColor = {
  High: "text-red-500 font-bold",
  Medium: "text-yellow-500 font-bold",
  Low: "text-green-500 font-bold",
};

const priorityBadge = {
  High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

const CATEGORIES = ["All", "Job Search", "Learning", "Networking", "Interview Prep", "Resume", "General"];

export function GoalsBoard({ initialGoals, streak }) {
  const [goals, setGoals] = useState(initialGoals);
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedNotes, setExpandedNotes] = useState({});
  const [editingNote, setEditingNote] = useState({});
  const [resetting, setResetting] = useState(false);

  const filteredGoals = activeFilter === "All"
    ? goals
    : goals.filter((g) => g.category === activeFilter);

  const completed = goals.filter((g) => g.completed).length;
  const progress = goals.length > 0 ? Math.round((completed / goals.length) * 100) : 0;
  const allCompleted = goals.length > 0 && completed === goals.length;

  const handleToggle = async (id, current) => {
    setGoals((prev) => prev.map((g) => g.id === id ? { ...g, completed: !current } : g));
    await toggleGoal(id, !current);
  };

  const handleDelete = async (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    await deleteGoal(id);
    toast.success("Goal removed.");
  };

  const handleReset = async () => {
    if (!confirm("Archive all current goals and start a fresh week?")) return;
    setResetting(true);
    try {
      await resetWeek();
      setGoals([]);
      toast.success("Week reset! Start adding new goals 🎯");
    } catch { toast.error("Failed to reset."); }
    finally { setResetting(false); }
  };

  const handleSaveNote = async (id, note) => {
    await updateGoalNotes(id, note);
    setGoals((prev) => prev.map((g) => g.id === id ? { ...g, notes: note } : g));
    setEditingNote((prev) => ({ ...prev, [id]: false }));
    toast.success("Note saved!");
  };

  const toggleNotes = (id) => {
    setExpandedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Streak + Progress */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold">Weekly Progress</p>
              <p className="text-sm text-muted-foreground">{completed}/{goals.length} completed</p>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-right text-sm font-semibold mt-1">{progress}%</p>
            {allCompleted && goals.length > 0 && (
              <p className="text-center text-green-500 font-semibold mt-2 text-sm">
                🎉 All goals completed this week!
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-5xl mb-1">🔥</p>
            <p className="text-3xl font-bold">{streak}</p>
            <p className="text-sm text-muted-foreground">
              {streak === 1 ? "week streak" : "week streak"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Complete all goals every week to keep your streak!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter + Reset */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`text-xs px-3 py-1 rounded-full border transition-all ${
                activeFilter === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-muted-foreground/30 text-muted-foreground hover:border-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={handleReset} disabled={resetting}>
          <RotateCcw className="h-3 w-3 mr-1" />
          {resetting ? "Resetting..." : "Reset Week"}
        </Button>
      </div>

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No goals here!</p>
          <p className="text-sm">
            {activeFilter !== "All"
              ? `No goals in "${activeFilter}" category.`
              : `Click "Add Goal" to set your first weekly career goal.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Sort by priority: High → Medium → Low */}
          {[...filteredGoals]
            .sort((a, b) => {
              const order = { High: 0, Medium: 1, Low: 2 };
              return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
            })
            .map((goal) => (
              <Card key={goal.id} className={`${goal.completed ? "opacity-60" : ""} transition-all`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={goal.completed}
                      onCheckedChange={() => handleToggle(goal.id, goal.completed)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${goal.completed ? "line-through text-muted-foreground" : ""}`}>
                        {goal.title}
                      </p>
                      <div className="flex items-center flex-wrap gap-2 mt-1">
                        <Badge className={`text-xs ${categoryColor[goal.category]}`}>
                          {goal.category}
                        </Badge>
                        <Badge className={`text-xs ${priorityBadge[goal.priority]}`}>
                          {goal.priority === "High" ? "🔴" : goal.priority === "Medium" ? "🟡" : "🟢"} {goal.priority}
                        </Badge>
                        {goal.dueDate && (
                          <span className="text-xs text-orange-500">
                            Due: {new Date(goal.dueDate).toLocaleDateString("en-GB")}
                          </span>
                        )}
                      </div>

                      {/* Notes Section */}
                      <div className="mt-2">
                        <button
                          onClick={() => toggleNotes(goal.id)}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                        >
                          {expandedNotes[goal.id] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          {goal.notes ? "View/Edit Notes" : "Add Notes"}
                        </button>

                        {expandedNotes[goal.id] && (
                          <div className="mt-2 space-y-2">
                            <Textarea
                              className="text-xs min-h-[60px]"
                              placeholder="Add notes here... e.g. Applied to Google, waiting for reply"
                              defaultValue={goal.notes || ""}
                              onChange={(e) => setEditingNote((prev) => ({ ...prev, [goal.id]: e.target.value }))}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-7"
                              onClick={() => handleSaveNote(goal.id, editingNote[goal.id] ?? goal.notes ?? "")}
                            >
                              Save Note
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button variant="ghost" size="icon" className="text-red-500 shrink-0"
                      onClick={() => handleDelete(goal.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}