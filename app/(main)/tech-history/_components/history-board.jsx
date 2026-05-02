"use client";

import { useState } from "react";
import { deleteHistoryItem, clearFeatureHistory, clearAllHistory } from "@/actions/tech-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ChevronDown, ChevronUp, Search, Trash } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const FEATURE_COLORS = {
  "Code Review": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Pattern Helper": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Mock Coding Interview": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "System Design Quiz": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "Architecture Explainer": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "Concept Explainer": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  "Code Converter": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  "Query Optimizer": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  "DSA Planner": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  "System Design": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  "Coding Explainer": "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
};

export function HistoryBoard({ initialHistory }) {
  const [history, setHistory] = useState(initialHistory);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedItems, setExpandedItems] = useState({});
  const [clearing, setClearing] = useState(false);

  const features = ["All", ...new Set(history.map((h) => h.feature))];

  const filtered = history.filter((h) => {
    const matchesFilter = activeFilter === "All" || h.feature === activeFilter;
    const matchesSearch = h.inputSummary.toLowerCase().includes(search.toLowerCase()) ||
      h.feature.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = async (id) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    await deleteHistoryItem(id);
    toast.success("Item deleted.");
  };

  const handleClearFeature = async (feature) => {
    if (!confirm(`Clear all ${feature} history?`)) return;
    setHistory((prev) => prev.filter((h) => h.feature !== feature));
    await clearFeatureHistory(feature);
    toast.success(`${feature} history cleared.`);
  };

  const handleClearAll = async () => {
    if (!confirm("Clear ALL history? This cannot be undone.")) return;
    setClearing(true);
    try {
      await clearAllHistory();
      setHistory([]);
      toast.success("All history cleared.");
    } catch { toast.error("Failed to clear history."); }
    finally { setClearing(false); }
  };

  const toggleExpand = (id) => setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));

  // Group by feature for the sidebar count
  const featureCounts = features.reduce((acc, f) => {
    acc[f] = f === "All" ? history.length : history.filter((h) => h.feature === f).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Stats + Clear All */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className="text-sm px-3 py-1">
            {history.length} total searches
          </Badge>
          {features.filter((f) => f !== "All").map((f) => (
            <Badge key={f} className={`text-xs ${FEATURE_COLORS[f] || ""}`}>
              {f}: {featureCounts[f]}
            </Badge>
          ))}
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleClearAll}
          disabled={clearing || history.length === 0}
        >
          <Trash className="h-4 w-4 mr-1" />
          {clearing ? "Clearing..." : "Clear All History"}
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search your history..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Feature Filter */}
      <div className="flex flex-wrap gap-2">
        {features.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`text-xs px-3 py-1 rounded-full border transition-all ${
              activeFilter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "border-muted-foreground/30 text-muted-foreground hover:border-primary"
            }`}
          >
            {f} ({featureCounts[f]})
          </button>
        ))}
      </div>

      {/* Clear Feature Button */}
      {activeFilter !== "All" && (
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 border-red-200"
          onClick={() => handleClearFeature(activeFilter)}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Clear all {activeFilter} history
        </Button>
      )}

      {/* History Items */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No history found</p>
          <p className="text-sm mt-1">
            {search ? "Try a different search term." : "Start using Tech & DSA tools to build your history."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={`text-xs ${FEATURE_COLORS[item.feature] || ""}`}>
                      {item.feature}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(item.createdAt), "dd MMM yyyy · hh:mm a")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => toggleExpand(item.id)}
                    >
                      {expandedItems[item.id] ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm font-medium mt-1">{item.inputSummary}</p>
              </CardHeader>

              {expandedItems[item.id] && (
                <CardContent>
                  <div className="bg-muted rounded-lg p-3 max-h-[300px] overflow-y-auto">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                      {JSON.stringify(item.result, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}