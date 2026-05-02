import { QueryForm } from "./_components/query-form";
export default function QueryOptimizerPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Database Query Optimizer</h1>
      <p className="text-muted-foreground mb-8">
        Paste any SQL query and get performance analysis, optimized rewrite,
        index suggestions, and execution plan comparison.
      </p>
      <QueryForm />
    </div>
  );
}