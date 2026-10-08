import { useEffect, useState } from "react";

import ExamHeader from "../components/ExamHeader";
import QuestionCard from "../components/QuestionCard";
import QuestionPalette from "../components/QuestionPalette";
import ExamFooter from "../components/ExamFooter";

import {
    fetchQuestions,
    submitExam
} from "../services/examApi";

function getQuestionSection(question) {
    if (question.section === "Quant" || question.section === "Reasoning") {
        return question.section;
    }

    return /train|percentage|percent|\d+\s*[%×]|\d+\s*to\s*\d+|what is \d+/i.test(
        question.question
    ) ? "Quant" : "Reasoning";
}

function ExamPage({ onExamComplete }) {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [activeSection, setActiveSection] = useState("Quant");
    const [answers, setAnswers] = useState({});
    const [markedForReview, setMarkedForReview] = useState([]);
    const [visitedQuestions, setVisitedQuestions] = useState([]);
    const [timeLeft, setTimeLeft] = useState(30 * 60);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const [loadAttempt, setLoadAttempt] = useState(0);

    const sectionQuestions = questions.filter(
        (question) => getQuestionSection(question) === activeSection
    );

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const loadedQuestions = await fetchQuestions();
                setQuestions(loadedQuestions);
                const firstQuestion = loadedQuestions.find(
                    (question) => getQuestionSection(question) === "Quant"
                ) ?? loadedQuestions[0];

                if (firstQuestion) {
                    setVisitedQuestions([firstQuestion.id]);
                }
            } catch (error) {
                console.error(error);
                setLoadError(true);
            } finally {
                setLoading(false);
            }
        };

        loadQuestions();
    }, [loadAttempt]);

    useEffect(() => {
        if (loading || submitting) {
            return;
        }

        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((previous) => previous - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, loading, submitting]);

    const handleAnswerSelect = (questionId, answerIndex) => {
        setAnswers((previous) => ({
            ...previous,
            [questionId]: answerIndex
        }));
    };

    const handleNext = () => {
        if (currentQuestion < sectionQuestions.length - 1) {
            const nextIndex = currentQuestion + 1;
            setCurrentQuestion(nextIndex);
            setVisitedQuestions((previous) => [
                ...new Set([...previous, sectionQuestions[nextIndex].id])
            ]);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            const previousIndex = currentQuestion - 1;
            setCurrentQuestion(previousIndex);
            setVisitedQuestions((previous) => [
                ...new Set([...previous, sectionQuestions[previousIndex].id])
            ]);
        }
    };

    const handleMarkReviewNext = () => {
        const questionId = sectionQuestions[currentQuestion].id;

        setMarkedForReview((previous) => {
            if (previous.includes(questionId)) {
                return previous.filter(
                    (id) => id !== questionId
                );
            }

            return [...previous, questionId];
        });

        handleNext();
    };

    const handleClearResponse = () => {
        const questionId = sectionQuestions[currentQuestion].id;

        setAnswers((previous) => {
            const nextAnswers = { ...previous };
            delete nextAnswers[questionId];
            return nextAnswers;
        });
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
        setCurrentQuestion(0);

        const firstQuestion = questions.find(
            (question) => getQuestionSection(question) === section
        );

        if (firstQuestion) {
            setVisitedQuestions((previous) => [
                ...new Set([...previous, firstQuestion.id])
            ]);
        }
    };

    const handlePaletteQuestionChange = (index) => {
        setCurrentQuestion(index);
        setVisitedQuestions((previous) => [
            ...new Set([...previous, sectionQuestions[index].id])
        ]);
    };

    const handleSubmit = async () => {
        if (submitting) {
            return;
        }

        setSubmitting(true);

        try {
            const result = await submitExam(answers);

            onExamComplete(result);
        } catch (error) {
            console.error(error);
            alert("Unable to submit the exam.");
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                Loading examination...
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="loading exam-load-error" role="alert">
                <div>
                    <h1>Unable to load the exam</h1>
                    <p>Check that the exam server is running, then try again.</p>
                    <button
                        className="start-button"
                        onClick={() => {
                            setLoadError(false);
                            setLoading(true);
                            setLoadAttempt((attempt) => attempt + 1);
                        }}
                        type="button"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="loading">
                No questions available.
            </div>
        );
    }

    const question = sectionQuestions[currentQuestion];

    if (!question) {
        return <div className="loading">No questions in this section.</div>;
    }

    return (
        <div className="exam-page exam-shell">
            <ExamHeader timeLeft={timeLeft} />

            <nav className="section-tabs" aria-label="Question sections">
                {["Quant", "Reasoning"].map((section) => (
                    <button
                        aria-pressed={activeSection === section}
                        className={`section-tab${activeSection === section ? " active" : ""}`}
                        key={section}
                        onClick={() => handleSectionChange(section)}
                        type="button"
                    >
                        {section}
                    </button>
                ))}
            </nav>

            <div className="exam-workspace">
                <main className="exam-main-column">
                    <section className="question-panel">
                        <QuestionCard
                            question={question}
                            questionNumber={currentQuestion + 1}
                            selectedAnswer={answers[question.id]}
                            onAnswerSelect={handleAnswerSelect}
                        />

                        <ExamFooter
                            currentQuestion={currentQuestion}
                            totalQuestions={sectionQuestions.length}
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                            onMarkReview={handleMarkReviewNext}
                            onClearResponse={handleClearResponse}
                        />
                    </section>
                </main>

                <aside className="exam-sidebar">
                    <section className="candidate-card">
                        <div className="candidate-avatar" aria-hidden="true">C</div>
                        <div>
                            <strong>Candidate</strong>
                            <span>Examination in progress</span>
                        </div>
                    </section>

                    <QuestionPalette
                        questions={sectionQuestions}
                        currentQuestion={currentQuestion}
                        answers={answers}
                        markedForReview={markedForReview}
                        visitedQuestions={visitedQuestions}
                        section={activeSection}
                        onQuestionChange={handlePaletteQuestionChange}
                    />
                    <button
                        className="sidebar-submit"
                        disabled={submitting}
                        onClick={handleSubmit}
                        type="button"
                    >
                        {submitting ? "Submitting..." : "Submit"}
                    </button>
                </aside>
            </div>
        </div>
    );
}

export default ExamPage;