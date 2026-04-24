"use client";

import { useState } from "react";
import { analyzeProfile } from "@/actions/profile-analyzer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AnalyzerResults } from "./analyzer-results";

export function AnalyzerForm() {
  const [profileType, setProfileType] = useState("LinkedIn");
  const [profileUrl, setProfileUrl] = useState("");
  const [profileText, setProfileText] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!profileText.trim()) {
      toast.error("Please paste your profile content.");
      return;
    }
    setLoading(true);
    try {
      const data = await analyzeProfile({ profileType, profileText, profileUrl });
      setResults(data);
    } catch (err) {
      toast.error(err.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="LinkedIn" onValueChange={setProfileType}>
        <TabsList className="w-full">
          <TabsTrigger value="LinkedIn" className="flex-1">LinkedIn</TabsTrigger>
          <TabsTrigger value="GitHub" className="flex-1">GitHub</TabsTrigger>
        </TabsList>

        <TabsContent value="LinkedIn" className="space-y-4 mt-4">
          <Input
            placeholder="Your LinkedIn profile URL (optional)"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
          />
          <Textarea
            placeholder="Paste your LinkedIn About section + Experience here..."
            className="min-h-[200px]"
            value={profileText}
            onChange={(e) => setProfileText(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            💡 Go to your LinkedIn profile → click "More" → "Save to PDF" or copy-paste your About + Experience sections.
          </p>
        </TabsContent>

        <TabsContent value="GitHub" className="space-y-4 mt-4">
          <Input
            placeholder="Your GitHub profile URL (optional)"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
          />
          <Textarea
            placeholder="Paste your GitHub bio, top repos with descriptions, README highlights..."
            className="min-h-[200px]"
            value={profileText}
            onChange={(e) => setProfileText(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            💡 Paste your GitHub bio + list your top pinned repositories with descriptions and tech stack.
          </p>
        </TabsContent>
      </Tabs>

      <Button onClick={handleAnalyze} disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing Profile...
          </>
        ) : (
          "Analyze My Profile"
        )}
      </Button>

      {results && <AnalyzerResults results={results} profileType={profileType} />}
    </div>
  );
}