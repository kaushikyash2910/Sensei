import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { githubUrl } = await req.json();

    // Extract username from URL
    const match = githubUrl.match(
      /github\.com\/([a-zA-Z0-9_-]+)/
    );
    if (!match) {
      return NextResponse.json(
        { error: "Invalid GitHub URL" },
        { status: 400 }
      );
    }

    const username = match[1];

    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=20`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Sensei-App",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "GitHub user not found" },
        { status: 404 }
      );
    }

    const repos = await res.json();

    const simplified = repos.map((r) => ({
      name: r.name,
      description: r.description || "",
      language: r.language || "Unknown",
      stars: r.stargazers_count,
      topics: r.topics || [],
      url: r.html_url,
    }));

    return NextResponse.json({ username, repos: simplified });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch repos" },
      { status: 500 }
    );
  }
}