import { getHistory } from "@/actions/tech-history";
import { HistoryBoard } from "./_components/history-board";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function TechHistoryPage() {
  const history = await getHistory();

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard
        </Button>
      </Link>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tech & DSA History</h1>
          <p className="text-muted-foreground mt-1">
            All your previous searches across Tech & DSA tools.
          </p>
        </div>
      </div>
      <HistoryBoard initialHistory={history} />
    </div>
  );
}