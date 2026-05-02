import { MockCodingSimulator } from "./_components/mock-coding-simulator";
export default function MockCodingPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Mock Coding Interview</h1>
      <p className="text-muted-foreground mb-8">
        A real timed coding interview — AI gives you a problem, you solve it,
        AI evaluates your solution with a detailed report card.
      </p>
      <MockCodingSimulator />
    </div>
  );
}