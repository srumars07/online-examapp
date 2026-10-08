function ExamHeader({ timeLeft }) {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <header className="exam-header">
            <div>
                <h1>Test name</h1>
            </div>

            <div className="timer">
                <span>Time left: HH:MM:SS</span>
                <strong>{String(hours).padStart(2, "0")}:{String(minutes % 60).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</strong>
            </div>
        </header>
    );
}

export default ExamHeader;