"use client";

import { useState, useEffect } from "react";
import { analyzeProfile } from "@/actions/profile-analyzer";
import { generateGithubDescription } from "@/actions/github-description";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Github, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AnalyzerResults } from "./analyzer-results";

export function AnalyzerForm() {
  const [profileType, setProfileType] = useState("LinkedIn");
  const [profileUrl, setProfileUrl] = useState("");
  const [profileText, setProfileText] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // GitHub repo fetching
  const [githubUrl, setGithubUrl] = useState("");
  const [repos, setRepos] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [fetchingRepos, setFetchingRepos] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const [githubUsername, setGithubUsername] = useState("");

  const STORAGE_KEY = "sensei_profile_analyzer";

  // Load saved results on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { results: r, profileType: pt } = JSON.parse(saved);
      setResults(r);
      setProfileType(pt);
    }
    const linkedinUrl = localStorage.getItem("sensei_linkedin_url") || "";
    const linkedinText = localStorage.getItem("sensei_linkedin_text") || "";
    setProfileUrl(linkedinUrl);
    setProfileText(linkedinText);
  }, []);

  // When tab switches load correct saved data
  useEffect(() => {
    if (profileType === "LinkedIn") {
      setProfileUrl(localStorage.getItem("sensei_linkedin_url") || "");
      setProfileText(localStorage.getItem("sensei_linkedin_text") || "");
    } else {
      const savedGithubUrl = localStorage.getItem("sensei_github_url") || "";
      setProfileUrl(savedGithubUrl);
      setGithubUrl(savedGithubUrl);
      setProfileText(localStorage.getItem("sensei_github_text") || "");
    }
  }, [profileType]);

  // Save URL
  useEffect(() => {
    if (profileUrl) {
      if (profileType === "LinkedIn") {
        localStorage.setItem("sensei_linkedin_url", profileUrl);
      } else {
        localStorage.setItem("sensei_github_url", profileUrl);
      }
    }
  }, [profileUrl, profileType]);

  // Save text
  useEffect(() => {
    if (profileText) {
      if (profileType === "LinkedIn") {
        localStorage.setItem("sensei_linkedin_text", profileText);
      } else {
        localStorage.setItem("sensei_github_text", profileText);
      }
    }
  }, [profileText, profileType]);

  // Save results
  useEffect(() => {
    if (results) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ results, profileType, profileText, profileUrl })
      );
    }
  }, [results]);

  const handleFetchRepos = async () => {
    if (!githubUrl.trim()) {
      toast.error("Please enter your GitHub profile URL.");
      return;
    }
    setFetchingRepos(true);
    setRepos([]);
    setSelectedRepos([]);
    try {
      const res = await fetch("/api/github-repos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch repos");
      setRepos(data.repos);
      setGithubUsername(data.username);
      setProfileUrl(githubUrl);
      toast.success(`Found ${data.repos.length} repositories!`);
    } catch (err) {
      toast.error(err.message || "Failed to fetch GitHub repos.");
    } finally {
      setFetchingRepos(false);
    }
  };

  const toggleRepo = (repoName) => {
    setSelectedRepos((prev) =>
      prev.includes(repoName)
        ? prev.filter((r) => r !== repoName)
        : [...prev, repoName]
    );
  };

  const handleGenerateDescription = async () => {
    if (selectedRepos.length === 0) {
      toast.error("Please select at least one repository.");
      return;
    }
    setGeneratingDesc(true);
    try {
      const selected = repos.filter((r) => selectedRepos.includes(r.name));
      const data = await generateGithubDescription({
        username: githubUsername,
        repos: selected,
      });
      setProfileText(data.description);
      toast.success("Description generated! Review and edit if needed.");
    } catch (err) {
      toast.error(err.message || "Failed to generate description.");
    } finally {
      setGeneratingDesc(false);
    }
  };

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
      <Tabs value={profileType} onValueChange={(v) => setProfileType(v)}>
        <TabsList className="w-full">
          <TabsTrigger value="LinkedIn" className="flex-1">LinkedIn</TabsTrigger>
          <TabsTrigger value="GitHub" className="flex-1">GitHub</TabsTrigger>
        </TabsList>

        {/* ── LinkedIn Tab ── */}
        <TabsContent value="LinkedIn" className="space-y-3 mt-4">
          <Input
            placeholder="Your LinkedIn profile URL (optional)"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
          />
          {profileUrl && (
            <p className="text-xs text-green-500">✓ LinkedIn URL saved</p>
          )}
          <Textarea
            placeholder="Paste your LinkedIn About section + Experience here..."
            className="min-h-[200px]"
            value={profileText}
            onChange={(e) => setProfileText(e.target.value)}
          />
          {profileText && (
            <p className="text-xs text-green-500">✓ LinkedIn profile text saved</p>
          )}
          <p className="text-xs text-muted-foreground">
            💡 Go to your LinkedIn profile → click "More" → "Save to PDF" or
            copy-paste your About + Experience sections.
          </p>
        </TabsContent>

        {/* ── GitHub Tab ── */}
        <TabsContent value="GitHub" className="space-y-4 mt-4">

          {/* Step 1 — Enter GitHub URL + Fetch Repos */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Step 1 — Enter your GitHub URL</p>
            <div className="flex gap-2">
              <Input
                placeholder="https://github.com/yourusername"
                value={githubUrl}
                onChange={(e) => {
                  setGithubUrl(e.target.value);
                  setProfileUrl(e.target.value);
                }}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={handleFetchRepos}
                disabled={fetchingRepos}
              >
                {fetchingRepos ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <><Github className="h-4 w-4 mr-1" />Fetch Repos</>
                )}
              </Button>
            </div>
            {profileUrl && (
              <p className="text-xs text-green-500">✓ GitHub URL saved</p>
            )}
          </div>

          {/* Step 2 — Select Repos */}
          {repos.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Step 2 — Select repos to include ({selectedRepos.length} selected)
              </p>
              <div className="border rounded-xl p-3 space-y-2 max-h-[280px] overflow-y-auto">
                {repos.map((repo) => (
                  <div
                    key={repo.name}
                    onClick={() => toggleRepo(repo.name)}
                    className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-all
                      ${selectedRepos.includes(repo.name)
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-muted"
                      }`}
                  >
                    <Checkbox
                      checked={selectedRepos.includes(repo.name)}
                      onCheckedChange={() => toggleRepo(repo.name)}
                      className="mt-0.5 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{repo.name}</p>
                      {repo.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {repo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        {repo.language && (
                          <Badge variant="secondary" className="text-xs">
                            {repo.language}
                          </Badge>
                        )}
                        {repo.stars > 0 && (
                          <span className="text-xs text-muted-foreground">
                            ⭐ {repo.stars}
                          </span>
                        )}
                        {repo.topics.slice(0, 2).map((t) => (
                          <Badge key={t} variant="outline" className="text-xs">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Step 3 — Generate Description */}
              <Button
                onClick={handleGenerateDescription}
                disabled={generatingDesc || selectedRepos.length === 0}
                variant="outline"
                className="w-full"
              >
                {generatingDesc ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Description...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" />Generate Profile Description from Selected Repos</>
                )}
              </Button>
            </div>
          )}

          {/* Step 3/4 — Profile Text (auto-filled or manual) */}
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {repos.length > 0 ? "Step 3 — Review & edit the generated description" : "Or paste manually"}
            </p>
            <Textarea
              placeholder="Paste your GitHub bio, top repos with descriptions, README highlights... or use the AI generator above."
              className="min-h-[180px]"
              value={profileText}
              onChange={(e) => setProfileText(e.target.value)}
            />
            {profileText && (
              <p className="text-xs text-green-500">✓ GitHub profile text saved</p>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            💡 Use the Fetch Repos button to auto-generate your profile description from your GitHub repositories.
          </p>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button onClick={handleAnalyze} disabled={loading} className="flex-1">
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing Profile...</>
          ) : (
            "Analyze My Profile"
          )}
        </Button>
        {results && (
          <Button
            variant="outline"
            onClick={() => {
              setResults(null);
              localStorage.removeItem(STORAGE_KEY);
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {results && (
        <>
          <p className="text-xs text-muted-foreground text-center">
            ✓ Showing your last saved result — click Analyze to refresh
          </p>
          <AnalyzerResults results={results} profileType={profileType} />
        </>
      )}
    </div>
  );
}