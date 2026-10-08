import { useState } from "react";

import ExamPage from "./pages/ExamPage";
import ResultPage from "./pages/ResultPage";

function App() {
    const [examStarted, setExamStarted] = useState(false);
    const [result, setResult] = useState(null);

    const handleStartExam = () => {
        setExamStarted(true);
    };

    const handleExamComplete = (examResult) => {
        setResult(examResult);
        setExamStarted(false);
    };

    const handleRestart = () => {
        setResult(null);
        setExamStarted(true);
    };

    // Result page
    if (result) {
        return (
            <ResultPage
                result={result}
                onRestart={handleRestart}
            />
        );
    }

    // Exam page
    if (examStarted) {
        return (
            <ExamPage
                onExamComplete={handleExamComplete}
            />
        );
    }

    // Home page
    return (
        <div className="home-page">
            <div className="home-card">
                <h1>Online Examination System</h1>

                <p>
                    Welcome to the online examination portal.
                </p>

                <div className="exam-info">
                    <div>
                        <strong>10</strong>
                        <span>Questions</span>
                    </div>

                    <div>
                        <strong>30</strong>
                        <span>Minutes</span>
                    </div>

                    <div>
                        <strong>10</strong>
                        <span>Total Marks</span>
                    </div>
                </div>

                <button
                    className="start-button"
                    onClick={handleStartExam}
                >
                    Start Examination
                </button>
            </div>
        </div>
    );
}

export default App;