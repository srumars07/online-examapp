function QuestionCard({
    question,
    questionNumber,
    selectedAnswer,
    onAnswerSelect
}) {
    return (
        <div className="question-card">
            <div className="question-heading">
                <span className="question-number">Question {questionNumber}</span>
                <span className="score-rule">+2 if correct, −0.5 if wrong</span>
            </div>

            <h2 className="question-prompt">{question.question}</h2>

            <div className="options">
                {question.options.map((option, index) => (
                    <label
                        className={`option${selectedAnswer === index ? " selected" : ""}`}
                        key={index}
                    >
                        <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={selectedAnswer === index}
                            onChange={() =>
                                onAnswerSelect(
                                    question.id,
                                    index
                                )
                            }
                        />

                        <span>{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}

export default QuestionCard;