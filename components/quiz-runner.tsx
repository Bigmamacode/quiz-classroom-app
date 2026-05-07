"use client";

import { useEffect, useMemo, useState } from "react";
import { buildQuestionOptions } from "@/lib/quiz";
import type { QuizRow } from "@/types/database";

interface AnswerState {
  selected: string;
  correct: boolean;
}

export function QuizRunner({
  questions,
  materia
}: {
  questions: QuizRow[];
  materia: string;
}) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    async function bootstrapSession() {
      try {
        const response = await fetch("/api/quiz/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            materia,
            totalQuestions: questions.length
          })
        });
        const payload = await response.json();
        if (!response.ok || !payload.sessionId) {
          setErrorMessage(payload.error || "Impossibile iniziare la sessione quiz.");
          setLoading(false);
          return;
        }
        setSessionId(payload.sessionId);
        setLoading(false);
      } catch {
        setErrorMessage("Errore di rete durante l'avvio del quiz.");
        setLoading(false);
      }
    }

    void bootstrapSession();
  }, [materia, questions.length]);

  const correctAnswers = useMemo(
    () => Object.values(answers).filter((item) => item.correct).length,
    [answers]
  );

  async function submitAnswer(option: string) {
    if (!sessionId || !currentQuestion || answers[currentQuestion.id] || submitting) {
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          quizId: currentQuestion.id,
          answer: option
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        setErrorMessage(payload.error || "Invio risposta non riuscito.");
        setSubmitting(false);
        return;
      }
      setAnswers((previous) => ({
        ...previous,
        [currentQuestion.id]: {
          selected: option,
          correct: payload.correct
        }
      }));
      setSubmitting(false);
    } catch {
      setErrorMessage("Errore di rete durante l'invio della risposta.");
      setSubmitting(false);
    }
  }

  async function goNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((value) => value + 1);
      return;
    }

    const score = Object.values(answers).filter((item) => item.correct).length;
    const response = await fetch("/api/quiz/session/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        correctAnswers: score,
        totalQuestions: questions.length
      })
    });
    const payload = await response.json();
    if (!response.ok) {
      setErrorMessage(payload.error || "Impossibile completare il quiz.");
      return;
    }
    setFinished(true);
  }

  if (loading) {
    return <div className="card">Preparazione sessione quiz...</div>;
  }

  if (errorMessage && !sessionId) {
    return (
      <div className="card result-card">
        <p className="eyebrow">Errore quiz</p>
        <h2>Impossibile avviare il test</h2>
        <p className="negative">{errorMessage}</p>
      </div>
    );
  }

  if (finished) {
    const percentage = questions.length ? ((correctAnswers / questions.length) * 100).toFixed(2) : "0.00";
    const wrongQuestions = questions.filter((question) => !answers[question.id]?.correct);
    return (
      <div className="card result-card">
        <p className="eyebrow">Quiz completato</p>
        <h2>{materia}</h2>
        <p className="score-line">
          {correctAnswers}/{questions.length} corrette
        </p>
        <p className="helper-text">Percentuale: {percentage}%</p>
        <div className="summary-list">
          {wrongQuestions.length ? wrongQuestions.map((question) => (
            <article key={question.id} className="summary-item">
              <strong>{question.domanda}</strong>
              <p>Risposta corretta: {question.corretta}</p>
              <p>{question.spiegazione}</p>
            </article>
          )) : <p>Nessun errore. Ottimo lavoro.</p>}
        </div>
      </div>
    );
  }

  const answer = answers[currentQuestion.id];

  return (
    <div className="card quiz-card">
      <div className="quiz-header">
        <div>
          <p className="eyebrow">{materia}</p>
          <h2>Domanda {currentIndex + 1} di {questions.length}</h2>
        </div>
        <span className="difficulty-pill">Livello {currentQuestion.difficolta}</span>
      </div>
      <p className="question-text">{currentQuestion.domanda}</p>
      {errorMessage ? <p className="negative">{errorMessage}</p> : null}
      <div className="answer-grid">
        {buildQuestionOptions(currentQuestion).map((option) => {
          const active = answer?.selected === option.key;
          const isCorrect = currentQuestion.corretta === option.key;
          const className = [
            "answer-button",
            active && answer?.correct ? "answer-correct" : "",
            active && !answer?.correct ? "answer-wrong" : "",
            !active && answer && isCorrect ? "answer-correct-outline" : ""
          ].join(" ").trim();
          return (
            <button
              key={option.key}
              type="button"
              className={className}
              onClick={() => void submitAnswer(option.key)}
              disabled={Boolean(answer) || submitting}
            >
              <strong>{option.key}</strong>
              <span>{option.text}</span>
            </button>
          );
        })}
      </div>

      {answer ? (
        <div className="feedback-box">
          <p className={answer.correct ? "positive" : "negative"}>
            {answer.correct ? "✅ Risposta corretta" : "❌ Risposta errata"}
          </p>
          <p><strong>Soluzione:</strong> {currentQuestion.corretta}</p>
          <p>{currentQuestion.spiegazione}</p>
          <button type="button" onClick={() => void goNext()}>
            {currentIndex < questions.length - 1 ? "Avanti" : "Termina quiz"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
