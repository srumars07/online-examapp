const express = require("express");

const {
  getQuestions,
  submitExam
} = require("../controllers/exam.controller");

const router = express.Router();

router.get("/questions", getQuestions);

router.post("/submit", submitExam);
//checking
router.get("/", (req, res) => {
    res.json({
        message: "Exam API is working"
    });
});
module.exports = router;