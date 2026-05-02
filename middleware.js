import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/ai-cover-letter(.*)",
  "/interview(.*)",
  "/onboarding(.*)",
  "/skill-gap(.*)",
  "/profile-analyzer(.*)",
  "/job-tracker(.*)",
  "/resume-compare(.*)",
  "/career-goals(.*)",
  "/hr-interview(.*)",
  "/readme-generator(.*)",
  "/tech-stack(.*)",
  "/faq(.*)",
  "/company-research(.*)",
  "/referral-request(.*)",
  "/dsa-planner(.*)",
  "/system-design(.*)",
  "/coding-explainer(.*)",
  "/resume-score(.*)",
  "/cold-email(.*)",
  "/linkedin-headline(.*)",
  "/interview-questions(.*)",
  "/career-roadmap(.*)",
  "/salary-negotiation(.*)",
  "/profile-analyzer(.*)",
  "/job-tracker(.*)",
  "/tech-history(.*)",
  "/code-review(.*)",
  "/pattern-helper(.*)",
  "/mock-coding(.*)",
  "/design-quiz(.*)",
  "/architecture-explainer(.*)",
  "/concept-explainer(.*)",
  "/code-converter(.*)",
  "/query-optimizer(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|_next/static|_next/image|favicon.ico)).*)",
    "/(api|trpc)(.*)",
  ],
};