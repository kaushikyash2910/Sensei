import { InterviewSimulator } from "./_components/interview-simulator";

export default function HRInterviewPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Mock HR Interview Simulator</h1>
      <p className="text-muted-foreground mb-8">
        Practice a real conversational HR interview — AI acts as the interviewer,
        asks 5 questions, gives live feedback, and scores your performance.
      </p>
      <InterviewSimulator />
    </div>
  );
}