"use client";

import { useState, useRef } from "react";
import { evaluateAnswer } from "@/actions/interview-feedback";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

export function AnswerFeedback({ question, industry }) {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Voice input using Web Speech API (works in Chrome/Edge)
  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      toast.error("Voice input is not supported in this browser. Try Chrome.");
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
      setAnswer(transcript);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const handleEvaluate = async () => {
    if (!answer.trim()) {
      toast.error("Please type or speak your answer first.");
      return;
    }
    setLoading(true);
    try {
      const data = await evaluateAnswer({ question, userAnswer: answer, industry });
      setFeedback(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verdictColor = {
    Excellent: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Good: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "Needs Work": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Poor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <div className="space-y-4 mt-4">
      <p className="font-medium text-sm text-muted-foreground">Question:</p>
      <p className="font-semibold">{question}</p>

      <div className="relative">
        <Textarea
          placeholder="Type your answer here, or use the mic button to speak..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="min-h-[150px] pr-12"
        />
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 ${listening ? "text-red-500" : ""}`}
          onClick={toggleVoice}
          type="button"
        >
          {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
      </div>
      {listening && (
        <p className="text-xs text-red-500 animate-pulse">🎙 Listening... click mic to stop</p>
      )}

      <Button onClick={handleEvaluate} disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Evaluating...
          </>
        ) : (
          "Get AI Feedback"
        )}
      </Button>

      {feedback && (
        <div className="space-y-4 pt-2">
          {/* Score */}
          <Card>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">
                  {feedback.score}
                  <span className="text-lg text-muted-foreground">/{feedback.scoreOutOf}</span>
                </p>
                <p className="text-sm text-muted-foreground">Score</p>
              </div>
              <Badge className={verdictColor[feedback.verdict] || ""}>
                {feedback.verdict}
              </Badge>
            </CardContent>
          </Card>

          {/* Good / Missing */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-600">✓ What Was Good</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feedback.whatWasGood}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-orange-500">⚠ What Was Missing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feedback.whatWasMissing}</p>
              </CardContent>
            </Card>
          </div>

          {/* Model Answer */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">💡 Model Answer (10/10)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{feedback.improvedAnswer}</p>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Tips to Improve</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {feedback.tips.map((tip, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="text-primary font-bold">{i + 1}.</span>
                  <span className="text-muted-foreground">{tip}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}