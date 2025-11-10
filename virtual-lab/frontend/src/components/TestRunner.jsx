import React, { useState } from 'react';

/**
 * TestRunner
 * Props:
 * - questions: array of { id, question, options: [], correctIndex }
 * If no questions provided, a small default quiz will be used.
 */
const TestRunner = ({ questions: propQuestions }) => {
  const defaultQuestions = [
    {
      id: 1,
      question: 'What is the worst-case time complexity of Bubble Sort?',
      options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(n^3)'],
      correctIndex: 2,
    },
    {
      id: 2,
      question: 'Which algorithm finds maximum subarray sum in O(n)?',
      options: ["Divide and Conquer", "Kadane's Algorithm", 'Brute Force', 'Dynamic Tree'],
      correctIndex: 1,
    },
    {
      id: 3,
      question: 'Which data structure is best for LIFO behavior?',
      options: ['Queue', 'Stack', 'Graph', 'HashMap'],
      correctIndex: 1,
    },
  ];

  const questions = propQuestions && propQuestions.length ? propQuestions : defaultQuestions;

  const [answers, setAnswers] = useState(() => questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const select = (qIndex, optionIndex) => {
    if (submitted) return; // lock answers after submit
    const copy = [...answers];
    copy[qIndex] = optionIndex;
    setAnswers(copy);
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    // persist a simple record in localStorage
    try {
      const key = 'vlab_scores';
      const prev = JSON.parse(localStorage.getItem(key) || '[]');
      prev.push({ timestamp: Date.now(), correct, total: questions.length });
      localStorage.setItem(key, JSON.stringify(prev));
    } catch (e) {
      // ignore storage errors
    }
  };

  const handleRetry = () => {
    setAnswers(questions.map(() => null));
    setSubmitted(false);
    setScore(null);
  };

  return (
    <div className="problem-card" style={{ marginTop: 12 }}>
      <h3 style={{ marginTop: 0 }}>Graded Quiz</h3>

      {questions.map((q, i) => (
        <div key={q.id} style={{ marginBottom: 12 }}>
          <div style={{ color: '#E2E8F0', fontWeight: 600 }}>{i + 1}. {q.question}</div>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {q.options.map((opt, oi) => {
              const isSelected = answers[i] === oi;
              const isCorrect = submitted && q.correctIndex === oi;
              const isWrongSelected = submitted && isSelected && !isCorrect;
              return (
                <button
                  key={oi}
                  onClick={() => select(i, oi)}
                  className="option"
                  style={{
                    display: 'block',
                    textAlign: 'left',
                    background: isCorrect ? 'rgba(16,185,129,0.12)' : isWrongSelected ? 'rgba(239,68,68,0.08)' : 'transparent',
                    borderColor: isCorrect ? '#10B981' : isWrongSelected ? '#EF4444' : 'rgba(255,255,255,0.08)'
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="submit-btn" onClick={handleSubmit} disabled={answers.some(a => a === null)}>
            Submit Quiz
          </button>
          <button className="next-btn" onClick={handleRetry}>
            Reset Answers
          </button>
        </div>
      ) : (
        <div>
          <div style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 8 }}>You scored {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="next-btn" onClick={handleRetry}>Retry Quiz</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestRunner;
