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
import { Loader2, Github, Sparkles, RefreshCw, Link2 } from "lucide-react";
import { toast } from "sonner";
import { AnalyzerResults } from "./analyzer-results";
import { ProfileExtras } from "./profile-extras";

export function AnalyzerForm() {
  const [profileType, setProfileType] = useState("LinkedIn");
  const [profileUrl, setProfileUrl] = useState("");
  const [profileText, setProfileText] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const [githubUrl, setGithubUrl] = useState("");
  const [repos, setRepos] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [fetchingRepos, setFetchingRepos] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const [githubUsername, setGithubUsername] = useState("");

  const STORAGE_KEY = "sensei_profile_analyzer";

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

  useEffect(() => {
    if (profileUrl) {
      if (profileType === "LinkedIn") {
        localStorage.setItem("sensei_linkedin_url", profileUrl);
      } else {
        localStorage.setItem("sensei_github_url", profileUrl);
      }
    }
  }, [profileUrl, profileType]);

  useEffect(() => {
    if (profileText) {
      if (profileType === "LinkedIn") {
        localStorage.setItem("sensei_linkedin_text", profileText);
      } else {
        localStorage.setItem("sensei_github_text", profileText);
      }
    }
  }, [profileText, profileType]);

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
        <TabsList className="w-full h-12 p-1 bg-muted/50 rounded-xl">
          <TabsTrigger
            value="LinkedIn"
            className="flex-1 h-full rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2 font-medium"
          >
            <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">in</span>
            </div>
            LinkedIn
          </TabsTrigger>
          <TabsTrigger
            value="GitHub"
            className="flex-1 h-full rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2 font-medium"
          >
            <Github className="h-4 w-4" />
            GitHub
          </TabsTrigger>
        </TabsList>

        {/* LinkedIn Tab */}
        <TabsContent value="LinkedIn" className="space-y-4 mt-4">
          <div className="relative">
            <Link2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Your LinkedIn profile URL (optional)"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              className="pl-9"
            />
          </div>
          {profileUrl && (
            <p className="text-xs text-emerald-500 flex items-center gap-1">
              <span>✓</span> LinkedIn URL saved
            </p>
          )}

          <div className="relative rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 transition-colors bg-muted/10 p-5">
            <Textarea
              placeholder="Paste your LinkedIn About section + Experience here..."
              className="min-h-[180px] border-0 bg-transparent p-0 resize-none focus-visible:ring-0 text-sm"
              value={profileText}
              onChange={(e) => setProfileText(e.target.value)}
            />
            {profileText && (
              <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                {profileText.split(" ").filter(Boolean).length} words pasted
              </p>
            )}
          </div>
          {profileText && (
            <p className="text-xs text-emerald-500 flex items-center gap-1">
              <span>✓</span> LinkedIn profile text saved
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            💡 Go to your LinkedIn profile → click "More" → "Save to PDF" or copy-paste your About + Experience sections.
          </p>
        </TabsContent>

        {/* GitHub Tab */}
        <TabsContent value="GitHub" className="space-y-4 mt-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Step 1 — Enter your GitHub URL
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Github className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="https://github.com/yourusername"
                  value={githubUrl}
                  onChange={(e) => {
                    setGithubUrl(e.target.value);
                    setProfileUrl(e.target.value);
                  }}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" onClick={handleFetchRepos} disabled={fetchingRepos}>
                {fetchingRepos ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <><Github className="h-4 w-4 mr-1" />Fetch Repos</>
                )}
              </Button>
            </div>
            {profileUrl && (
              <p className="text-xs text-emerald-500">✓ GitHub URL saved</p>
            )}
          </div>

          {repos.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Step 2 — Select repos ({selectedRepos.length} selected)
              </p>
              <div className="rounded-xl border bg-muted/10 divide-y max-h-[260px] overflow-y-auto">
                {repos.map((repo) => (
                  <div
                    key={repo.name}
                    onClick={() => toggleRepo(repo.name)}
                    className={`flex items-start gap-3 p-3 cursor-pointer transition-all ${
                      selectedRepos.includes(repo.name)
                        ? "bg-primary/5 border-l-2 border-l-primary"
                        : "hover:bg-muted/50"
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
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {repo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {repo.language && (
                          <Badge variant="secondary" className="text-xs h-5">{repo.language}</Badge>
                        )}
                        {repo.stars > 0 && (
                          <span className="text-xs text-muted-foreground">⭐ {repo.stars}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleGenerateDescription}
                disabled={generatingDesc || selectedRepos.length === 0}
                variant="outline"
                className="w-full gap-2"
              >
                {generatingDesc ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Generating Description...</>
                ) : (
                  <><Sparkles className="h-4 w-4" />Generate Profile Description from {selectedRepos.length} Repos</>
                )}
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {repos.length > 0 ? "Step 3 — Review & edit" : "Or paste manually"}
            </p>
            <div className="relative rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 transition-colors bg-muted/10 p-5">
              <Textarea
                placeholder="Paste your GitHub bio, top repos with descriptions, README highlights..."
                className="min-h-[150px] border-0 bg-transparent p-0 resize-none focus-visible:ring-0 text-sm"
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
              />
              {profileText && (
                <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                  {profileText.split(" ").filter(Boolean).length} words
                </p>
              )}
            </div>
            {profileText && (
              <p className="text-xs text-emerald-500">✓ GitHub profile text saved</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Analyze Button */}
      <div className="flex gap-3">
        <Button
          onClick={handleAnalyze}
          disabled={loading}
          className="flex-1 h-11 gap-2 font-semibold"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Analyzing {profileType} Profile...</>
          ) : (
            <><Sparkles className="h-4 w-4" />Analyze My {profileType} Profile</>
          )}
        </Button>
        {results && (
          <Button
            variant="outline"
            className="h-11 gap-2"
            onClick={() => {
              setResults(null);
              localStorage.removeItem(STORAGE_KEY);
            }}
          >
            <RefreshCw className="h-4 w-4" />Clear
          </Button>
        )}
      </div>

      {results && (
  <>
    <div className="flex items-center gap-2">
      <div className="flex-1 h-px bg-border" />
      <p className="text-xs text-muted-foreground px-2">✓ Last saved result — click Analyze to refresh</p>
      <div className="flex-1 h-px bg-border" />
    </div>
    <AnalyzerResults results={results} profileType={profileType} />
    <ProfileExtras
      profileType={profileType}
      profileText={profileText}
      currentScore={results.overallScore}
    />
  </>
)}
    </div>
  );
}