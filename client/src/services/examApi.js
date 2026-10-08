const API_URL = "http://localhost:5000/api/exam";

export const fetchQuestions = async () => {
    const response = await fetch(`${API_URL}/questions`);

    if (!response.ok) {
        throw new Error("Failed to fetch questions");
    }

    const data = await response.json();

    if (!Array.isArray(data.questions)) {
        throw new Error("The exam server returned an invalid question list");
    }

    return data.questions;
};

export const submitExam = async (answers) => {
    const response = await fetch(`${API_URL}/submit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            answers
        })
    });

    if (!response.ok) {
        throw new Error("Failed to submit exam");
    }

    return response.json();
};