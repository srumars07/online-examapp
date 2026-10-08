function ResultPage({ result, onRestart }) {
    const percentage =
        (result.score / result.totalQuestions) * 100;

    return (
        <div className="result-page">
            <div className="result-card">
                <h1>Exam Completed</h1>

                <p className="score">
                    {result.score} / {result.totalQuestions}
                </p>

                <p className="percentage">
                    {percentage.toFixed(2)}%
                </p>

                <div className="result-grid">
                    <div>
                        <strong>{result.correct}</strong>
                        <span>Correct</span>
                    </div>

                    <div>
                        <strong>{result.wrong}</strong>
                        <span>Wrong</span>
                    </div>

                    <div>
                        <strong>{result.unanswered}</strong>
                        <span>Unanswered</span>
                    </div>
                </div>

                <button
                    className="primary-button"
                    onClick={onRestart}
                >
                    Take Test Again
                </button>
            </div>
        </div>
    );
}

export default ResultPage;