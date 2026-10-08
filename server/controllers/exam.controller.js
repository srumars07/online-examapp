const questions = require("../qbank/questions.json");

// Send questions to the frontend without correct answers
const getQuestions = (req, res) => {
  const safeQuestions = questions.map((question) => ({
    id: question.id,
    question: question.question,
    options: question.options
  }));

  res.json({
    duration: 15 * 60,
    totalQuestions: safeQuestions.length,
    questions: safeQuestions
  });
};


// Calculate the result on the server
const submitExam = (req, res) => {
  const { answers } = req.body;

  if (!answers || typeof answers !== "object") {
    return res.status(400).json({
      message: "Invalid answer data."
    });
  }

  let correct = 0;
  let wrong = 0;
  let attempted = 0;

  questions.forEach((question) => {
    const userAnswer = answers[question.id];

    if (userAnswer === undefined || userAnswer === null) {
      return;
    }

    attempted++;

    if (Number(userAnswer) === question.correctAnswer) {
      correct++;
    } else {
      wrong++;
    }
  });

  const totalQuestions = questions.length;
  const unanswered = totalQuestions - attempted;

  // +2 for correct answer
  // -0.5 for wrong answer
  const score = (correct * 2) - (wrong * 0.5);

  const maximumScore = totalQuestions * 2;

  const percentage = Math.max(
    0,
    (score / maximumScore) * 100
  );

  res.json({
    totalQuestions,
    attempted,
    correct,
    wrong,
    unanswered,
    score: Number(score.toFixed(2)),
    maximumScore,
    percentage: Number(percentage.toFixed(2))
  });
};


module.exports = {
  getQuestions,
  submitExam
};