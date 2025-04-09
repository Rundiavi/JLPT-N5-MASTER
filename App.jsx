
import React, { useState, useEffect } from "react";

const quizData = [
  {
    id: 1,
    type: "🧠 어휘",
    question: "『책』을 뜻하는 단어는?",
    choices: ["ほん", "しんぶん", "ざっし", "えいが"],
    correct: 0,
    explanation: "ほん(本)은 '책'이라는 뜻입니다."
  },
  {
    id: 2,
    type: "🧠 문법",
    question: "ごはんを（　　　）ます。",
    choices: ["たべ", "み", "い", "はな"],
    correct: 0,
    explanation: "'밥을 먹다'는 'ごはんをたべます'입니다."
  }
];

export default function JLPTN5Master() {
  const [userAnswers, setUserAnswers] = useState(() => {
    const saved = localStorage.getItem("jlpt-n5-answers");
    return saved ? JSON.parse(saved) : {};
  });

  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    localStorage.setItem("jlpt-n5-answers", JSON.stringify(userAnswers));
  }, [userAnswers]);

  const handleAnswer = (qid, choiceIdx) => {
    if (userAnswers[qid] !== undefined) return;
    setUserAnswers({ ...userAnswers, [qid]: choiceIdx });
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setShowResults(false);
    localStorage.removeItem("jlpt-n5-answers");
  };

  const correctCount = Object.keys(userAnswers).filter(
    (id) => userAnswers[id] === quizData.find((q) => q.id === parseInt(id)).correct
  ).length;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">📘 JLPT N5 마스터</h1>

      {!showResults && quizData.map((q) => (
        <div key={q.id} className="mb-6 p-4 bg-white shadow rounded-xl">
          <h2 className="font-semibold mb-2">{q.id}. {q.question} <span className="text-sm">{q.type}</span></h2>
          {q.choices.map((choice, idx) => {
            const answered = userAnswers[q.id] !== undefined;
            const isCorrect = idx === q.correct;
            const isSelected = idx === userAnswers[q.id];

            return (
              <button
                key={idx}
                disabled={answered}
                onClick={() => handleAnswer(q.id, idx)}
                className={`w-full text-left px-4 py-2 my-1 border rounded-lg
                  ${answered && isCorrect ? "bg-green-100 border-green-400" : ""}
                  ${answered && isSelected && !isCorrect ? "bg-red-100 border-red-400" : ""}`}
              >
                {choice}
              </button>
            );
          })}
          {userAnswers[q.id] !== undefined && (
            <p className="text-sm text-gray-700 mt-2">💡 {q.explanation}</p>
          )}
        </div>
      ))}

      {!showResults && (
        <button onClick={() => setShowResults(true)} className="w-full py-3 bg-blue-600 text-white rounded-xl mt-4">
          ✅ 결과 보기
        </button>
      )}

      {showResults && (
        <div className="mt-6 bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-2">결과</h2>
          <p className="mb-4">맞힌 문제 수: {correctCount} / {quizData.length}</p>
          <ul className="list-disc ml-5">
            {quizData.map((q) => (
              <li key={q.id}>
                문제 {q.id}: {userAnswers[q.id] === q.correct ? "✅ 정답" : "❌ 오답"} — {q.explanation}
              </li>
            ))}
          </ul>
          <button onClick={resetQuiz} className="mt-4 w-full py-2 bg-gray-200 rounded-xl">🔄 다시 풀기</button>
        </div>
      )}
    </div>
  );
}
