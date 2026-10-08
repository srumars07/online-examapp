function ExamFooter({
    currentQuestion,
    totalQuestions,
    onPrevious,
    onNext,
    onMarkReview,
    onClearResponse
}) {
    return (
        <div className="exam-footer">
            <button className="mark-button" onClick={onMarkReview} type="button">
                Mark for Review &amp; Next
            </button>

            <button onClick={onClearResponse} type="button">
                Clear Response
            </button>

            <button
                onClick={onPrevious}
                disabled={currentQuestion === 0}
                type="button"
            >
                Back
            </button>

            <button
                className="save-next-button"
                onClick={onNext}
                disabled={currentQuestion === totalQuestions - 1}
                type="button"
            >
                Save &amp; Next
            </button>
        </div>
    );
}

export default ExamFooter;