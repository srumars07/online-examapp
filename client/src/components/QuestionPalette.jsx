function QuestionPalette({
    questions,
    currentQuestion,
    answers,
    markedForReview,
    visitedQuestions,
    section,
    onQuestionChange
}) {
    return (
        <div className="palette">
            <h3>Palette: {section}</h3>

            <div className="palette-grid">
                {questions.map((question, index) => {
                    const isAnswered =
                        answers[question.id] !== undefined;

                    const isMarked =
                        markedForReview.includes(question.id);
                    const isVisited =
                        visitedQuestions.includes(question.id);

                    let className = "palette-button";

                    if (isAnswered && isMarked) {
                        className += " answered-review";
                    } else if (isMarked) {
                        className += " review";
                    } else if (isAnswered) {
                        className += " answered";
                    } else if (!isVisited) {
                        className += " not-visited";
                    }

                    if (index === currentQuestion) {
                        className += " active";
                    }

                    return (
                        <button
                            key={question.id}
                            className={className}
                            aria-current={index === currentQuestion ? "step" : undefined}
                            aria-label={`Question ${index + 1}${isAnswered ? ", answered" : ", not answered"}${isMarked ? ", marked for review" : ""}`}
                            onClick={() =>
                                onQuestionChange(index)
                            }
                            type="button"
                        >
                            {index + 1}
                        </button>
                    );
                })}
            </div>

            <div className="legend">
                <div><span className="legend-box answered"></span>Answered</div>
                <div><span className="legend-box unanswered"></span>Not answered</div>
                <div><span className="legend-box not-visited"></span>Not visited</div>
                <div><span className="legend-box review"></span>Marked for review</div>
                <div><span className="legend-box answered-review"></span>Answered and marked</div>
            </div>
        </div>
    );
}

export default QuestionPalette;