"use client";

import { useState, useEffect, useRef } from "react";
import { getNextQuestion, evaluateDesignAnswer, saveQuizResult } from "@/actions/design-quiz";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Timer, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

export function DesignQuizSimulator() {
  const TOTAL_QUESTIONS = 5;
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [scores, setScores] = useState([]);
  const [history, setHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [finished, setFinished] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState({});
  const timerRef = useRef(null);

  useEffect(() => {
    if (started && currentQuestion && !evaluation) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            handleSubmitAnswer(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [currentQuestion, evaluation]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;

  const loadNextQuestion = async () => {
    setLoading(true);
    setAnswer("");
    setEvaluation(null);
    try {
      const q = await getNextQuestion({
        level: "Mixed",
        previousQuestions: history.map((h) => h.question.question),
        score: Number(avgScore),
      });
      setCurrentQuestion(q);
      setTimeLeft(q.timeLimit || 120);
      setQuestionNumber((n) => n + 1);
    } catch (err) {
      toast.error("Failed to load question.");
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    setStarted(true);
    setScores([]);
    setHistory([]);
    setQuestionNumber(0);
    setFinished(false);
    await loadNextQuestion();
  };

  const handleSubmitAnswer = async (auto = false) => {
    clearInterval(timerRef.current);
    const finalAnswer = auto ? (answer || "No answer given — time ran out") : answer;
    if (!finalAnswer.trim() && !auto) { toast.error("Please write an answer."); return; }
    setLoading(true);
    try {
      const eval_ = await evaluateDesignAnswer({
        question: currentQuestion,
        answer: finalAnswer,
        keyPoints: currentQuestion.keyPoints,
      });
      setEvaluation(eval_);
      const newScores = [...scores, eval_.score];
      setScores(newScores);
      setHistory((prev) => [...prev, { question: currentQuestion, answer: finalAnswer, evaluation: eval_ }]);

      if (questionNumber >= TOTAL_QUESTIONS) {
        const total = (newScores.reduce((a, b) => a + b, 0) / newScores.length).toFixed(1);
        await saveQuizResult({ questions: history.map((h) => h.question.question), scores: newScores, totalScore: Number(total) });
        setFinished(true);
      }
    } catch (err) {
      toast.error("Evaluation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setStarted(false); setCurrentQuestion(null); setAnswer("");
    setEvaluation(null); setScores([]); setHistory([]);
    setQuestionNumber(0); setFinished(false);
  };

  if (!started) {
    return (
      <div className="space-y-6 text-center max-w-md mx-auto">
        <Card>
          <CardContent className="pt-6 space-y-3">
            <p className="text-4xl">🏗️</p>
            <p className="font-semibold text-lg">System Design Quiz</p>
            <p className="text-sm text-muted-foreground">
              {TOTAL_QUESTIONS} questions · Progressive difficulty · 2 min per question
            </p>
            <div className="text-left space-y-2 text-sm">
              <p>✅ AI adapts difficulty based on your score</p>
              <p>✅ Covers scalability, databases, caching, APIs</p>
              <p>✅ Instant feedback with model answers</p>
              <p>✅ Final score saved to history</p>
            </div>
          </CardContent>
        </Card>
        <Button onClick={handleStart} size="lg" className="w-full">
          Start System Design Quiz
        </Button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="space-y-6">
        <Card className="border-primary text-center">
          <CardContent className="pt-6">
            <p className="text-5xl font-bold">{avgScore}<span className="text-2xl text-muted-foreground">/10</span></p>
            <p className="text-lg font-semibold mt-1">Quiz Complete!</p>
            <p className="text-sm text-muted-foreground">
              {Number(avgScore) >= 8 ? "🏆 Excellent performance!" : Number(avgScore) >= 6 ? "👍 Good job!" : "📚 Keep practicing!"}
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          {scores.map((s, i) => (
            <div key={i} className="flex-1 text-center border rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Q{i + 1}</p>
              <p className={`font-bold ${s >= 8 ? "text-green-500" : s >= 6 ? "text-yellow-500" : "text-red-500"}`}>{s}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {history.map((item, i) => (
            <Card key={i}>
              <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpandedHistory((p) => ({ ...p, [i]: !p[i] }))}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{item.question.question.substring(0, 60)}...</p>
                  <div className="flex items-center gap-2">
                    <Badge className={item.evaluation.score >= 8 ? "bg-green-100 text-green-800" : item.evaluation.score >= 6 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                      {item.evaluation.score}/10
                    </Badge>
                    {expandedHistory[i] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </div>
                </div>
              </CardHeader>
              {expandedHistory[i] && (
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">{item.evaluation.feedback}</p>
                  <div className="bg-muted rounded p-2">
                    <p className="text-xs font-semibold mb-1">Model Answer:</p>
                    <p className="text-xs text-muted-foreground">{item.evaluation.modelAnswer}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <Button onClick={handleReset} variant="outline" className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" />Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Question {questionNumber}/{TOTAL_QUESTIONS}</span>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">Avg: {avgScore}/10</span>
            {currentQuestion && !evaluation && (
              <span className={`font-mono font-bold ${timeLeft < 30 ? "text-red-500" : timeLeft < 60 ? "text-yellow-500" : "text-green-500"}`}>
                ⏱ {formatTime(timeLeft)}
              </span>
            )}
          </div>
        </div>
        <Progress value={(questionNumber / TOTAL_QUESTIONS) * 100} />
      </div>

      {loading && !currentQuestion ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : currentQuestion && !evaluation ? (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{currentQuestion.topic}</Badge>
                <Badge className={currentQuestion.difficulty === "Easy" ? "bg-green-100 text-green-800" : currentQuestion.difficulty === "Hard" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}>
                  {currentQuestion.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{currentQuestion.question}</p>
            </CardContent>
          </Card>

          <Textarea placeholder="Write your answer here... Think about scalability, components, trade-offs..."
            value={answer} onChange={(e) => setAnswer(e.target.value)}
            className="min-h-[180px]" />

          <Button onClick={() => handleSubmitAnswer(false)} disabled={loading || !answer.trim()} className="w-full">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Evaluating...</> : "Submit Answer"}
          </Button>
        </div>
      ) : evaluation ? (
        <div className="space-y-4">
          <Card className={evaluation.score >= 8 ? "border-green-400" : evaluation.score >= 6 ? "border-yellow-400" : "border-red-400"}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className={`text-3xl font-bold ${evaluation.score >= 8 ? "text-green-500" : evaluation.score >= 6 ? "text-yellow-500" : "text-red-500"}`}>
                  {evaluation.score}/10
                </p>
                <div className="flex flex-wrap gap-1">
                  {evaluation.coveredPoints?.map((p, i) => (
                    <Badge key={i} className="bg-green-100 text-green-800 text-xs">✓ {p}</Badge>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{evaluation.feedback}</p>
            </CardContent>
          </Card>

          {evaluation.missedPoints?.length > 0 && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-orange-500">⚠️ What You Missed</CardTitle></CardHeader>
              <CardContent className="space-y-1">
                {evaluation.missedPoints.map((p, i) => <p key={i} className="text-xs text-muted-foreground">• {p}</p>)}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">💡 Model Answer</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{evaluation.modelAnswer}</p>
            </CardContent>
          </Card>

          <Button onClick={questionNumber < TOTAL_QUESTIONS ? loadNextQuestion : () => setFinished(true)}
            disabled={loading} className="w-full">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</> :
              questionNumber < TOTAL_QUESTIONS ? `Next Question (${questionNumber}/${TOTAL_QUESTIONS})` : "See Final Results"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}