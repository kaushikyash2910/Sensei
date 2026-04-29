"use client";

import { useState, useRef, useEffect } from "react";
import { startInterview, continueInterview } from "@/actions/hr-interview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, RotateCcw, Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

export function InterviewSimulator() {
  const [setup, setSetup] = useState({ role: "", company: "", experience: "Fresher" });
  const [started, setStarted] = useState(false);
  const [history, setHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const chatEndRef = useRef(null);
const recognitionRef = useRef(null);
const [listening, setListening] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleStart = async () => {
    if (!setup.role) { toast.error("Please enter the role."); return; }
    setLoading(true);
    try {
      const data = await startInterview(setup);
      setHistory([{ role: "interviewer", message: data.message }]);
      setQuestionNumber(1);
      setStarted(true);
    } catch (err) {
      toast.error("Failed to start interview.");
    } finally {
      setLoading(false);
    }
  };
  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      toast.error("Voice input not supported in this browser. Try Chrome.");
      return;
    }
  
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
  
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
  
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setUserInput(transcript);
    };
  
    recognition.onerror = () => {
      setListening(false);
      toast.error("Voice input error. Please try again.");
    };
  
    recognition.onend = () => setListening(false);
  
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };
  
  const handleSend = async () => {
    if (!userInput.trim()) return;
    const newHistory = [...history, { role: "candidate", message: userInput }];
    setHistory(newHistory);
    setUserInput("");
    setLoading(true);

    try {
      const data = await continueInterview({
        history: newHistory,
        userAnswer: userInput,
        questionNumber,
        role: setup.role,
        company: setup.company,
      });

      setHistory((prev) => [...prev, { role: "interviewer", message: data.message, feedback: data.feedback }]);
      setQuestionNumber(data.questionNumber);

      if (data.isComplete) {
        setIsComplete(true);
        setFinalResult(data);
      }
    } catch (err) {
      toast.error("Failed to get response.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStarted(false);
    setHistory([]);
    setUserInput("");
    setQuestionNumber(0);
    setIsComplete(false);
    setFinalResult(null);
    setSetup({ role: "", company: "", experience: "Fresher" });
  };

  if (!started) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Role You're Applying For *</Label>
            <Input placeholder="e.g. Software Engineer"
              value={setup.role}
              onChange={(e) => setSetup((s) => ({ ...s, role: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <Label>Company (optional)</Label>
            <Input placeholder="e.g. Google"
              value={setup.company}
              onChange={(e) => setSetup((s) => ({ ...s, company: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <Label>Your Experience Level</Label>
            <select
              className="w-full border rounded-md px-3 py-2 bg-background text-sm"
              value={setup.experience}
              onChange={(e) => setSetup((s) => ({ ...s, experience: e.target.value }))}
            >
              <option>Fresher</option>
              <option>Junior (1-3 years)</option>
              <option>Mid-level (3-5 years)</option>
              <option>Senior (5+ years)</option>
            </select>
          </div>
        </div>
        <Button onClick={handleStart} disabled={loading} className="w-full">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Starting...</> : "Start Mock HR Interview"}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          The AI will act as a real HR interviewer and ask you 5 questions with live feedback.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Question {Math.min(questionNumber, 5)}/5</Badge>
          {setup.company && <Badge variant="secondary">{setup.company}</Badge>}
          <Badge variant="secondary">{setup.role}</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-1" />New Interview
        </Button>
      </div>

      {/* Chat */}
      <div className="border rounded-xl p-4 h-[450px] overflow-y-auto space-y-4 bg-muted/20">
        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "candidate" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
              msg.role === "interviewer"
                ? "bg-background border"
                : "bg-primary text-primary-foreground"
            }`}>
              {msg.role === "interviewer" && (
                <p className="text-xs font-semibold mb-1 text-muted-foreground">HR Interviewer</p>
              )}
              <p>{msg.message}</p>
              {msg.feedback && (
                <div className="mt-2 pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">💬 {msg.feedback}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-background border rounded-xl px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Final Result */}
      {isComplete && finalResult && (
        <Card className="border-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">🎯 Interview Complete — Final Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-bold">{finalResult.finalScore}<span className="text-lg text-muted-foreground">/10</span></p>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold mb-1 text-green-600">✓ Strengths</p>
                {finalResult.strengths?.map((s, i) => (
                  <p key={i} className="text-sm text-muted-foreground">• {s}</p>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold mb-1 text-orange-500">⚠ Improve</p>
                {finalResult.improvements?.map((s, i) => (
                  <p key={i} className="text-sm text-muted-foreground">• {s}</p>
                ))}
              </div>
            </div>
            <Button onClick={handleReset} className="w-full mt-2">
              <RotateCcw className="h-4 w-4 mr-2" />Start New Interview
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Input */}
{!isComplete && (
  <div className="space-y-2">
    <div className="relative">
      <Textarea
        placeholder="Type your answer here or click the mic to speak..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="min-h-[80px] resize-none pr-12"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.metaKey) handleSend();
        }}
      />
      {/* Mic button inside textarea */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={toggleVoice}
        className={`absolute top-2 right-2 ${
          listening
            ? "text-red-500 hover:text-red-600"
            : "text-muted-foreground hover:text-primary"
        }`}
      >
        {listening ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
    </div>

    {/* Listening indicator */}
    {listening && (
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <span className="w-1.5 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        <p className="text-xs text-red-500 font-medium animate-pulse">
          🎙 Listening... speak your answer, click mic to stop
        </p>
      </div>
    )}

    <div className="flex items-center justify-between">
      <p className="text-xs text-muted-foreground">
        🎙 Click mic to speak · Cmd+Enter to send
      </p>
      <Button
        onClick={handleSend}
        disabled={loading || !userInput.trim()}
      >
        <Send className="h-4 w-4 mr-2" />
        Send Answer
      </Button>
    </div>
  </div>
)}
    </div>
  );
}