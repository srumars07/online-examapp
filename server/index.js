const express = require("express");

const app = express();
const cors=require("cors");

const examRoutes = require("./routes/exam.routes");

const PORT = 5000;
app.use(cors());

app.use(express.json());

 app.use("/api/exam",examRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Online Exam API is running"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});